import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  MOCK_DAYS,
  INITIAL_PARTICIPANTS,
  INITIAL_ACTIVE_PASSES,
  INITIAL_FOOD_REQUESTS,
  INITIAL_MENTOR_REQUESTS,
  MOCK_DAY_HISTORY
} from '../data/mockRoster';
import { daySessionApi, passesApi, foodApi, mentorApi, rosterApi } from '../services/api';
import { subscribeToEvent } from '../services/socket';
import { validateAndParseQrPayload } from '../utils/qrValidation';
import { getPassTiming, formatClockTime, formatDuration } from '../utils/timeFormat';
import { getPassConfig } from '../utils/passTypeConfig';

const OpsSessionContext = createContext(null);

export function OpsSessionProvider({ children }) {
  // Theme state: dark mode default for night hackathon venue
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ops_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ops_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Active Day Session
  const [activeDay, setActiveDay] = useState(() => {
    const saved = localStorage.getItem('ops_active_day');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      id: 'day-sess-01',
      dayId: 'day-1',
      dayName: 'Day 1 — 24H Overnight Sprint & Hacking Kickoff',
      code: 'Day 1',
      startTime: Date.now() - 3 * 60 * 60 * 1000 - 15 * 60 * 1000, // Started 3h 15m ago
      status: 'active'
    };
  });

  // Participant Roster
  const [participants, setParticipants] = useState(() => {
    const saved = localStorage.getItem('ops_roster');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_PARTICIPANTS;
  });

  // Active Movement Passes
  const [activePasses, setActivePasses] = useState(() => {
    return INITIAL_ACTIVE_PASSES;
  });

  // Food Request Queue
  const [foodRequests, setFoodRequests] = useState(() => {
    return INITIAL_FOOD_REQUESTS;
  });

  // Mentor Assistance Queue
  const [mentorRequests, setMentorRequests] = useState(() => {
    return INITIAL_MENTOR_REQUESTS;
  });

  // Day History Records
  const [dayHistory, setDayHistory] = useState(MOCK_DAY_HISTORY);

  // Scanner controls
  const [isScannerPaused, setIsScannerPaused] = useState(false);
  const [scanMode, setScanMode] = useState('auto'); // 'auto' | 'checkin' | 'WASHROOM' | etc.

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, details = null) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message, details, createdAt: Date.now() }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save session state to localStorage
  useEffect(() => {
    if (activeDay) localStorage.setItem('ops_active_day', JSON.stringify(activeDay));
    else localStorage.removeItem('ops_active_day');
  }, [activeDay]);

  useEffect(() => {
    if (participants && participants.length > 0) {
      localStorage.setItem('ops_roster', JSON.stringify(participants));
    }
  }, [participants]);

  // Real-time 1s ticker for live countdowns and overdue evaluation
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTicker((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial state from Django SQLite backend
  useEffect(() => {
    let mounted = true;
    const fetchInitialData = async () => {
      try {
        const [parts, passes, foods, mentors] = await Promise.allSettled([
          rosterApi.getParticipants(),
          passesApi.getActivePasses(),
          foodApi.getFoodRequests(),
          mentorApi.getMentorRequests()
        ]);
        if (!mounted) return;
        if (parts.status === 'fulfilled' && parts.value?.length > 0) {
          setParticipants(parts.value);
        }
        if (passes.status === 'fulfilled' && Array.isArray(passes.value)) {
          setActivePasses(passes.value);
        }
        if (foods.status === 'fulfilled' && Array.isArray(foods.value)) {
          setFoodRequests(foods.value);
        }
        if (mentors.status === 'fulfilled' && Array.isArray(mentors.value)) {
          setMentorRequests(mentors.value);
        }
      } catch (err) {
        console.warn('Initial data fetch fallback to mock:', err);
      }
    };
    fetchInitialData();
    return () => { mounted = false; };
  }, []);

  // Enriched active passes with type-specific overdue calculations
  const enrichedPasses = activePasses.map((pass) => {
    const timing = getPassTiming(pass.departTime, pass.passType);
    return {
      ...pass,
      ...timing
    };
  }).sort((a, b) => {
    // Critical Left-Venue overdue goes to the top!
    if (a.passType === 'LEFT_VENUE' && a.isOverdue && !(b.passType === 'LEFT_VENUE' && b.isOverdue)) return -1;
    if (b.passType === 'LEFT_VENUE' && b.isOverdue && !(a.passType === 'LEFT_VENUE' && a.isOverdue)) return 1;
    // Then general overdue
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return b.percentUsed - a.percentUsed;
  });

  // Critical Left-Venue overdue passes count for persistent safety banner
  const criticalLeftVenueOverdue = enrichedPasses.filter(
    (p) => p.passType === 'LEFT_VENUE' && p.isOverdue
  );

  // Overall counts and team stats
  const checkedInCount = participants.filter((p) => p.status === 'present').length;
  const notCheckedInCount = participants.filter((p) => p.status === 'not_scanned').length;
  const absentCount = participants.filter((p) => p.status === 'absent').length;
  const totalCount = participants.length;

  // Compute team rollups: how many teams have all members checked in
  const uniqueTeams = Array.from(new Set(participants.map((p) => p.team)));
  const completedTeams = uniqueTeams.filter((teamName) => {
    const members = participants.filter((p) => p.team === teamName);
    return members.length > 0 && members.every((m) => m.status === 'present');
  });

  // Real-time socket event subscriptions
  useEffect(() => {
    const unsubs = [
      subscribeToEvent('checkin:marked', (data) => {
        setParticipants((prev) =>
          prev.map((p) =>
            p.rollNo === data.rollNo || p.id === data.participantId
              ? { ...p, status: 'present', scannedAt: data.scannedAt || formatClockTime(), markedBy: 'qr_scan' }
              : p
          )
        );
        addToast('success', `✅ ${data.name || data.rollNo} checked in!`);
      }),

      subscribeToEvent('pass:issued', (newPass) => {
        setActivePasses((prev) => [newPass, ...prev.filter((p) => p.id !== newPass.id)]);
        const cfg = getPassConfig(newPass.passType);
        addToast('info', `${cfg.icon} ${newPass.participantName} out — ${cfg.label}`, newPass.reason);
      }),

      subscribeToEvent('pass:returned', (data) => {
        setActivePasses((prev) => prev.filter((p) => p.id !== data.passId));
        addToast('success', `↩️ ${data.participantName || 'Participant'} returned from pass`);
      })
    ];

    return () => unsubs.forEach((u) => u && u());
  }, [addToast]);

  // Handle QR Scan (Supports Check-in, Any Movement Pass checkout, or Pass Return)
  const handleQrScan = useCallback((rawPayload) => {
    const result = validateAndParseQrPayload(rawPayload);

    if (!result.isValid) {
      addToast('error', `⚠️ ${result.error || 'Invalid QR code'}`);
      return { success: false, error: result.error };
    }

    // Check if participant currently holds an active pass
    const currentPass = activePasses.find(
      (p) => p.rollNo === result.rollNo || p.studentId === result.participantId
    );

    // If scanning a RETURN (or auto-detecting return when pass is already open)
    const isReturnScan = result.type === 'RETURN' || (scanMode === 'return') || (scanMode === 'auto' && currentPass && result.type === 'CHECKIN');

    if (isReturnScan) {
      if (!currentPass) {
        addToast('error', `⚠️ No active pass found for ${result.name} (${result.rollNo})`);
        return { success: false, error: 'No active pass' };
      }

      const elapsedMs = Date.now() - currentPass.departTime;
      const durationStr = formatDuration(elapsedMs);
      const cfg = getPassConfig(currentPass.passType);

      setActivePasses((prev) => prev.filter((p) => p.id !== currentPass.id));
      passesApi.returnPass(currentPass.id).catch(console.error);

      addToast('success', `↩️ ${currentPass.participantName} returned — duration: ${durationStr}`, `${cfg.icon} ${cfg.label} completed`);
      return { success: true, mode: 'return', duration: durationStr };
    }

    // If scan payload is a specific movement pass checkout
    if (['WASHROOM', 'FOOD_PICKUP', 'REST_BREAK', 'LEFT_VENUE'].includes(result.type) || (['WASHROOM', 'FOOD_PICKUP', 'REST_BREAK', 'LEFT_VENUE'].includes(scanMode))) {
      const passTypeToUse = scanMode !== 'auto' && scanMode !== 'checkin' ? scanMode : result.type;
      const cfg = getPassConfig(passTypeToUse);

      const target = participants.find((p) => p.rollNo === result.rollNo || p.id === result.participantId);
      const name = target?.name || result.name;
      const team = target?.team || result.team;

      const newPass = {
        id: `pass-${Date.now().toString().slice(-5)}`,
        studentId: target?.id || result.participantId || 'p_ext',
        participantName: name,
        rollNo: result.rollNo,
        team,
        passType: passTypeToUse,
        reason: result.reason || `Authorized ${cfg.label}`,
        departTime: Date.now(),
        status: 'active'
      };

      setActivePasses((prev) => [newPass, ...prev]);
      passesApi.issuePass(newPass).catch(console.error);

      addToast('info', `${cfg.icon} ${name} out — ${cfg.label}`, `Allowed limit: ${cfg.overdueMinutes}m • ${team}`);
      return { success: true, mode: 'pass_checkout', type: passTypeToUse };
    }

    // Standard Check-in scan
    const participant = participants.find(
      (p) => p.rollNo === result.rollNo || p.id === result.participantId
    );

    if (!participant) {
      addToast('error', `⚠️ Badge ${result.rollNo} is not registered in this hackathon cohort`);
      return { success: false, error: 'Not in roster' };
    }

    if (participant.status === 'present') {
      addToast('error', `⚠️ ${participant.name} is already checked in (at ${participant.scannedAt || 'earlier'})`);
      return { success: false, error: 'Already checked in' };
    }

    const nowStr = formatClockTime();

    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participant.id
          ? { ...p, status: 'present', scannedAt: nowStr, markedBy: 'qr_scan' }
          : p
      )
    );

    rosterApi.processScan(participant.rollNo, 'CHECKIN').catch(console.error);

    addToast('success', `✅ ${participant.name} checked in!`, `${participant.team} • Table: ${participant.table} • ${nowStr}`);
    return { success: true, mode: 'checkin', participant: participant.name };
  }, [scanMode, activePasses, participants, addToast]);

  // Start new day session
  const startDaySession = async (dayObj) => {
    const newSession = await daySessionApi.startDaySession({
      dayId: dayObj.id,
      dayName: dayObj.name,
      code: dayObj.code
    });
    setActiveDay(newSession);
    addToast('info', `Started operations session: ${dayObj.name}`);
    return newSession;
  };

  // Close current day session
  const closeDaySession = async () => {
    if (!activeDay) return;

    if (activePasses.length > 0) {
      activePasses.forEach((p) => passesApi.forceClosePass(p.id, 'Day session closed'));
      setActivePasses([]);
    }

    const summary = {
      checkedInCount,
      absentCount: absentCount + notCheckedInCount,
      totalCount,
      completedTeamsCount: completedTeams.length,
      foodServedCount: foodRequests.filter((f) => f.status === 'delivered').length
    };

    const record = {
      id: activeDay.id,
      dayCode: activeDay.code,
      dayName: activeDay.dayName,
      date: new Date().toISOString().split('T')[0],
      startTime: formatClockTime(new Date(activeDay.startTime)),
      endTime: formatClockTime(),
      totalCheckedIn: summary.checkedInCount,
      totalRegistered: summary.totalCount,
      teamsCompleted: summary.completedTeamsCount,
      totalTeams: uniqueTeams.length,
      passesByType: { WASHROOM: 30, FOOD_PICKUP: 18, REST_BREAK: 12, LEFT_VENUE: 3 },
      foodRequestsDelivered: summary.foodServedCount,
      status: 'closed'
    };

    await daySessionApi.closeDaySession(activeDay.id, summary);
    setDayHistory((prev) => [record, ...prev]);

    setParticipants((prev) =>
      prev.map((p) => (p.status === 'not_scanned' ? { ...p, status: 'absent', markedBy: 'day_closed' } : p))
    );

    setActiveDay(null);
    localStorage.removeItem('ops_active_day');
    addToast('info', 'Day session closed & finalized into Day History.');
  };

  // Manual Check-in override
  const manualCheckIn = async (participantId, status, notes) => {
    const nowStr = formatClockTime();
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId
          ? { ...p, status, scannedAt: status === 'present' ? nowStr : null, markedBy: 'ops_override', overrideNotes: notes }
          : p
      )
    );
    await rosterApi.manualCheckInOverride({ participantId, status, notes }).catch(console.error);
    addToast('info', `Participant status set to ${status.toUpperCase()}`);
  };

  // Force close a pass
  const forceClosePass = async (passId, reason = 'Ops force-close') => {
    const target = activePasses.find((p) => p.id === passId);
    setActivePasses((prev) => prev.filter((p) => p.id !== passId));
    await passesApi.forceClosePass(passId, reason).catch(console.error);
    addToast('info', `Force-closed pass for ${target?.participantName || 'participant'}`);
  };

  // Food Request actions
  const addFoodRequest = async (reqData) => {
    const created = await foodApi.createFoodRequest(reqData);
    setFoodRequests((prev) => [created, ...prev]);
    addToast('success', `🍔 Food order logged for ${reqData.team}`, reqData.items);
  };

  const advanceFoodStatus = async (requestId) => {
    const target = foodRequests.find((f) => f.id === requestId);
    if (!target) return;

    const pipeline = ['pending', 'preparing', 'ready', 'delivered'];
    const currIdx = pipeline.indexOf(target.status);
    if (currIdx < pipeline.length - 1) {
      const nextStatus = pipeline[currIdx + 1];
      setFoodRequests((prev) =>
        prev.map((f) => (f.id === requestId ? { ...f, status: nextStatus, ...(nextStatus === 'delivered' ? { deliveredAt: Date.now() } : {}) } : f))
      );
      await foodApi.updateFoodStatus(requestId, nextStatus).catch(console.error);
      addToast('info', `Order #${requestId} advanced to ${nextStatus.toUpperCase()}`);
    }
  };

  // Mentor Queue actions
  const claimMentorTicket = async (ticketId, mentorName = 'Ops Lead') => {
    setMentorRequests((prev) =>
      prev.map((m) => (m.id === ticketId ? { ...m, status: 'claimed', mentorAssigned: mentorName } : m))
    );
    await mentorApi.claimTicket(ticketId, mentorName).catch(console.error);
    addToast('info', `Mentor ticket claimed by ${mentorName}`);
  };

  const resolveMentorTicket = async (ticketId) => {
    setMentorRequests((prev) =>
      prev.map((m) => (m.id === ticketId ? { ...m, status: 'resolved', resolvedAt: Date.now() } : m))
    );
    await mentorApi.resolveTicket(ticketId).catch(console.error);
    addToast('success', `Mentor request resolved`);
  };

  return (
    <OpsSessionContext.Provider
      value={{
        theme,
        toggleTheme,
        activeDay,
        participants,
        activePasses: enrichedPasses,
        criticalLeftVenueOverdue,
        foodRequests,
        mentorRequests,
        dayHistory,
        stats: {
          checkedInCount,
          notCheckedInCount,
          absentCount,
          totalCount,
          checkInRate: totalCount ? Math.round((checkedInCount / totalCount) * 100) : 0,
          completedTeamsCount: completedTeams.length,
          totalTeamsCount: uniqueTeams.length
        },
        isScannerPaused,
        setIsScannerPaused,
        scanMode,
        setScanMode,
        toasts,
        addToast,
        removeToast,
        handleQrScan,
        startDaySession,
        closeDaySession,
        manualCheckIn,
        forceClosePass,
        addFoodRequest,
        advanceFoodStatus,
        claimMentorTicket,
        resolveMentorTicket
      }}
    >
      {children}
    </OpsSessionContext.Provider>
  );
}

export function useOpsSession() {
  const ctx = useContext(OpsSessionContext);
  if (!ctx) throw new Error('useOpsSession must be used within OpsSessionProvider');
  return ctx;
}
