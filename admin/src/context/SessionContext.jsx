import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_STUDENTS_CS301,
  INITIAL_HALL_PASSES,
  MOCK_CLASSES,
  MOCK_PAST_SESSIONS
} from '../data/mockRoster';
import { sessionApi, attendanceApi, hallPassApi } from '../services/api';
import { subscribeToEvent, emitMockEvent } from '../services/socket';
import { validateAndParseQrPayload } from '../utils/qrValidation';
import { formatClockTime, formatDuration, getHallPassTiming } from '../utils/timeFormat';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  // Currently active session (default loaded with CS-301 for instant demo capability)
  const [activeSession, setActiveSession] = useState(() => {
    const saved = localStorage.getItem('active_class_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default active session for instant demo
    return {
      id: 'sess-active-01',
      classId: 'CS-301',
      className: 'Advanced Algorithms & Complexity',
      period: 'Period 2 (10:00 AM - 11:30 AM)',
      startTime: Date.now() - 32 * 60 * 1000, // Started 32 minutes ago
      status: 'active'
    };
  });

  // Live Roster
  const [roster, setRoster] = useState(() => {
    const saved = localStorage.getItem('active_session_roster');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_STUDENTS_CS301;
  });

  // Live Hall Passes
  const [activeHallPasses, setActiveHallPasses] = useState(() => {
    return INITIAL_HALL_PASSES;
  });

  // Past Sessions History (in-memory + local storage)
  const [sessionHistory, setSessionHistory] = useState(MOCK_PAST_SESSIONS);

  // Scanner status (active or paused)
  const [isScannerPaused, setIsScannerPaused] = useState(false);

  // Scan Mode: 'auto' | 'attendance' | 'hallpass_return'
  const [scanMode, setScanMode] = useState('auto');

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const addToast = useCallback((type, message, details = null) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message, details, createdAt: Date.now() }]);

    // Auto-remove toast after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save session state to localStorage
  useEffect(() => {
    if (activeSession) {
      localStorage.setItem('active_class_session', JSON.stringify(activeSession));
    } else {
      localStorage.removeItem('active_class_session');
    }
  }, [activeSession]);

  useEffect(() => {
    if (roster && roster.length > 0) {
      localStorage.setItem('active_session_roster', JSON.stringify(roster));
    }
  }, [roster]);

  // Client-side real-time timer ticker: re-evaluates hall-pass timings and session elapsed time every 1s
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute enriched hall pass data with live statuses (normal, warning, overdue)
  const enrichedHallPasses = activeHallPasses.map((pass) => {
    const timing = getHallPassTiming(pass.departTime, pass.expectedDurationMinutes);
    return {
      ...pass,
      ...timing
    };
  }).sort((a, b) => {
    // Sort overdue to top, then warning, then normal
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return b.percentUsed - a.percentUsed;
  });

  // Calculate roster counters
  const presentCount = roster.filter((s) => s.status === 'present').length;
  const absentCount = roster.filter((s) => s.status === 'absent').length;
  const notScannedCount = roster.filter((s) => s.status === 'not_scanned').length;
  const totalCount = roster.length;

  // Real-time socket subscriptions
  useEffect(() => {
    const unsubs = [
      subscribeToEvent('attendance:marked', (data) => {
        setRoster((prev) =>
          prev.map((student) =>
            student.rollNo === data.rollNo || student.id === data.studentId
              ? { ...student, status: 'present', scannedAt: data.scannedAt || formatClockTime(), markedBy: data.markedBy || 'qr_scan' }
              : student
          )
        );
        addToast('success', `✅ ${data.name || data.rollNo} marked present`);
      }),

      subscribeToEvent('hallpass:requested', (newPass) => {
        setActiveHallPasses((prev) => [newPass, ...prev.filter((p) => p.id !== newPass.id)]);
        addToast('info', `🚶 Hall pass issued to ${newPass.studentName}`, newPass.reason);
      }),

      subscribeToEvent('hallpass:returned', (data) => {
        setActiveHallPasses((prev) => prev.filter((p) => p.id !== data.passId && p.studentId !== data.studentId));
        addToast('success', `↩️ ${data.studentName || 'Student'} returned from hall pass`);
      }),

      subscribeToEvent('hallpass:overdue', (data) => {
        addToast('error', `⚠️ Overdue Alert: ${data.studentName} is past expected return time!`);
      }),

      subscribeToEvent('session:closed', () => {
        setActiveSession(null);
        addToast('info', 'Class session has been closed.');
      })
    ];

    return () => {
      unsubs.forEach((unsub) => unsub && unsub());
    };
  }, [addToast]);

  // Handle scanned QR payload (from camera or simulated injector)
  const handleQrScan = useCallback((rawPayload) => {
    const result = validateAndParseQrPayload(rawPayload);

    if (!result.isValid) {
      addToast('error', `⚠️ ${result.error || 'Invalid QR code'}`);
      return { success: false, error: result.error };
    }

    // Determine target mode (auto-detect or forced)
    let modeToUse = scanMode === 'auto' ? result.type : scanMode;

    // Check if the student is currently out on a hall pass
    const activePass = activeHallPasses.find(
      (p) => p.rollNo === result.rollNo || p.studentId === result.studentId
    );

    if (modeToUse === 'hallpass_return' || (scanMode === 'auto' && activePass)) {
      if (!activePass) {
        addToast('error', `⚠️ No active hall pass found for ${result.name} (${result.rollNo})`);
        return { success: false, error: 'No active pass found' };
      }

      const elapsedMs = Date.now() - activePass.departTime;
      const durationStr = formatDuration(elapsedMs);

      // Remove from active hall passes
      setActiveHallPasses((prev) => prev.filter((p) => p.id !== activePass.id));

      // Optimistic API call
      hallPassApi.returnScanPass(activePass.id).catch(console.error);

      // Feedback toast
      addToast('success', `↩️ ${activePass.studentName} returned — duration: ${durationStr}`, `Pass closed successfully`);
      return { success: true, mode: 'hallpass_return', student: activePass.studentName, duration: durationStr };
    }

    // Attendance mode
    const student = roster.find(
      (s) => s.rollNo === result.rollNo || s.id === result.studentId
    );

    if (!student) {
      addToast('error', `⚠️ Student ${result.rollNo} is not in this class roster`);
      return { success: false, error: 'Student not in roster' };
    }

    if (student.status === 'present') {
      addToast('error', `⚠️ ${student.name} is already marked present (at ${student.scannedAt || 'earlier'})`);
      return { success: false, error: 'Already marked present' };
    }

    const nowTimeStr = formatClockTime();

    // Mark present in roster
    setRoster((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? { ...s, status: 'present', scannedAt: nowTimeStr, markedBy: 'qr_scan' }
          : s
      )
    );

    // Call attendance API
    attendanceApi.markAttendance({
      sessionId: activeSession?.id,
      studentId: student.id,
      rollNo: student.rollNo,
      scannedAt: nowTimeStr,
      type: 'qr_scan'
    }).catch(console.error);

    // Feedback toast
    addToast('success', `✅ ${student.name} marked present`, `Roll: ${student.rollNo} • ${nowTimeStr}`);
    return { success: true, mode: 'attendance', student: student.name };
  }, [scanMode, activeHallPasses, roster, activeSession, addToast]);

  // Start a new session
  const startSession = async (selectedClass) => {
    const newSession = await sessionApi.startSession({
      classId: selectedClass.id,
      className: selectedClass.name,
      period: selectedClass.period
    });

    // Reset roster for this class
    const initialRoster = await sessionApi.getSessionRoster(selectedClass.id);
    setRoster(initialRoster);
    setActiveSession(newSession);

    addToast('info', `Started session for ${selectedClass.name}`);
    return newSession;
  };

  // Close the active session
  const closeSession = async () => {
    if (!activeSession) return;

    // Auto-force-close any active hall passes
    if (activeHallPasses.length > 0) {
      activeHallPasses.forEach((pass) => {
        hallPassApi.forceClosePass(pass.id, 'Session closed').catch(console.error);
      });
      setActiveHallPasses([]);
    }

    // Prepare history item
    const summary = {
      presentCount,
      absentCount: absentCount + notScannedCount, // un-scanned become absent on close
      totalCount
    };

    const closedHistoryRecord = {
      id: activeSession.id,
      classId: activeSession.classId,
      className: activeSession.className,
      period: activeSession.period,
      date: new Date().toISOString().split('T')[0],
      startTime: formatClockTime(new Date(activeSession.startTime)),
      endTime: formatClockTime(),
      presentCount: summary.presentCount,
      absentCount: summary.absentCount,
      totalCount: summary.totalCount,
      hallPassCount: 3,
      overdueCount: 1,
      status: 'closed'
    };

    await sessionApi.closeSession(activeSession.id, summary);

    // Update history list
    setSessionHistory((prev) => [closedHistoryRecord, ...prev]);

    // Mark remaining not_scanned students as absent
    setRoster((prev) =>
      prev.map((s) => (s.status === 'not_scanned' ? { ...s, status: 'absent', markedBy: 'system_close' } : s))
    );

    setActiveSession(null);
    localStorage.removeItem('active_class_session');
    addToast('info', 'Session locked and saved to Session History.');
  };

  // Manual override for attendance (present / absent)
  const manualMark = async (studentId, status, overrideNotes) => {
    const nowTimeStr = formatClockTime();
    setRoster((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status,
              scannedAt: status === 'present' ? (s.scannedAt || nowTimeStr) : null,
              markedBy: 'faculty_override',
              overrideNotes: overrideNotes || 'Manual faculty override'
            }
          : s
      )
    );

    await attendanceApi.manualOverride({
      sessionId: activeSession?.id,
      studentId,
      status,
      reason: overrideNotes
    }).catch(console.error);

    addToast('info', `Student status updated to ${status.toUpperCase()}`);
  };

  // Force close a hall pass
  const forceClosePass = async (passId, reason = 'Faculty override') => {
    const target = activeHallPasses.find((p) => p.id === passId);
    setActiveHallPasses((prev) => prev.filter((p) => p.id !== passId));

    await hallPassApi.forceClosePass(passId, reason).catch(console.error);
    addToast('info', `Force-closed hall pass for ${target?.studentName || 'student'}`);
  };

  return (
    <SessionContext.Provider
      value={{
        activeSession,
        roster,
        activeHallPasses: enrichedHallPasses,
        sessionHistory,
        stats: {
          presentCount,
          absentCount,
          notScannedCount,
          totalCount,
          rate: totalCount ? Math.round((presentCount / totalCount) * 100) : 0
        },
        isScannerPaused,
        setIsScannerPaused,
        scanMode,
        setScanMode,
        toasts,
        addToast,
        removeToast,
        handleQrScan,
        startSession,
        closeSession,
        manualMark,
        forceClosePass
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
