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
import { PARTICIPANT_DIRECTORY } from '../data/participantDirectory';

const OpsSessionContext = createContext(null);

// Helper to sanitize / heal participant records with official directory details
function sanitizeParticipant(p) {
  if (!p || typeof p !== 'object') return p;
  const key = p.passId || p.rollNo || p.id;
  if (!key) return p;

  const strKey = String(key).trim();
  const match = PARTICIPANT_DIRECTORY[strKey] ||
                PARTICIPANT_DIRECTORY[strKey.toUpperCase()] ||
                PARTICIPANT_DIRECTORY[strKey.toLowerCase()];
  if (match) {
    return {
      ...p,
      name: match.name,
      passId: match.passId,
      rollNo: match.passId,
      phone: String(match.phone || p.phone || ''),
      college: match.college || p.college || 'VISAT'
    };
  }

  // If name has token in parentheses (e.g. Pass Badge (3MbN2t1K))
  const nameStr = typeof p.name === 'string' ? p.name : '';
  const tokenMatch = nameStr.match(/\((.*?)\)/)?.[1];
  if (tokenMatch) {
    const foundEntry = Object.entries(PARTICIPANT_DIRECTORY).find(([k]) =>
      k.toLowerCase().startsWith(tokenMatch.toLowerCase())
    );
    if (foundEntry) {
      const matchObj = foundEntry[1];
      return {
        ...p,
        name: matchObj.name,
        passId: matchObj.passId,
        rollNo: matchObj.passId,
        phone: String(matchObj.phone || p.phone || ''),
        college: matchObj.college || p.college || 'VISAT'
      };
    }
  }
  return p;
}

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

  // Participant Roster - rehydrates from localStorage and heals with directory
  const [participants, setParticipants] = useState(() => {
    try {
      const saved = localStorage.getItem('ops_roster');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean).map(sanitizeParticipant);
        }
      }
    } catch (e) {
      console.warn('Failed to parse ops_roster:', e);
    }
    return [];
  });

  // Active Movement Passes
  const [activePasses, setActivePasses] = useState(() => {
    return [];
  });

  // Food Request Queue
  const [foodRequests, setFoodRequests] = useState(() => {
    return [];
  });

  // Mentor Assistance Queue
  const [mentorRequests, setMentorRequests] = useState(() => {
    return [];
  });

  // Day History Records
  const [dayHistory, setDayHistory] = useState(MOCK_DAY_HISTORY);

  // Scanner controls
  const [isScannerPaused, setIsScannerPaused] = useState(false);
  const [scanMode, setScanMode] = useState('auto'); // 'auto' | 'checkin' | 'WASHROOM' | etc.

  // Live Recent Scans Activity Stream
  const [recentScans, setRecentScans] = useState([]);

  const addRecentScan = useCallback((scanItem) => {
    setRecentScans((prev) => [
      {
        id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: Date.now(),
        ...scanItem
      },
      ...prev.slice(0, 9)
    ]);
  }, []);

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
    } else {
      localStorage.removeItem('ops_roster');
    }
  }, [participants]);

  // Real-time 1s ticker for live countdowns and overdue evaluation
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTicker((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial state from database
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
        if (parts.status === 'fulfilled' && Array.isArray(parts.value)) {
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
    const handleCheckin = (data) => {
      const roll = data.rollNumber || data.rollNo;
      const name = data.participantName || data.name || roll;
      const nowStr = data.scannedAt ? new Date(data.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : formatClockTime();

      setParticipants((prev) => {
        const exists = prev.some((p) => (roll && p.rollNo === roll) || (data.participantId && p.id === data.participantId));
        if (exists) {
          return prev.map((p) =>
            (roll && p.rollNo === roll) || (data.participantId && p.id === data.participantId)
              ? { ...p, status: 'present', scannedAt: nowStr, markedBy: 'qr_scan' }
              : p
          );
        }
        return [
          {
            id: data.participantId || `p_${Date.now()}`,
            name,
            rollNo: roll,
            team: data.team || 'Open Squad',
            table: data.table || 'Table 01',
            status: 'present',
            scannedAt: nowStr,
            markedBy: 'qr_scan'
          },
          ...prev
        ];
      });
      addToast('success', `✅ ${name} checked in!`);
      addRecentScan({
        name,
        rollNo: roll,
        team: data.team || 'Open Squad',
        actionType: 'CHECKIN',
        mode: 'checkin'
      });
    };

    const unsubs = [
      subscribeToEvent('attendance:marked', handleCheckin),
      subscribeToEvent('checkin:marked', handleCheckin),

      subscribeToEvent('pass:issued', (newPass) => {
        setActivePasses((prev) => [newPass, ...prev.filter((p) => p.id !== newPass.id)]);
        const cfg = getPassConfig(newPass.passType);
        addToast('info', `${cfg.icon} ${newPass.participantName} out — ${cfg.label}`, newPass.reason);
        addRecentScan({
          name: newPass.participantName,
          rollNo: newPass.rollNo,
          team: newPass.team,
          actionType: 'PASS_OUT',
          passType: newPass.passType,
          reason: newPass.reason
        });
      }),

      subscribeToEvent('hallpass:returned', (data) => {
        setActivePasses((prev) => prev.filter((p) => p.id !== data.passId));
        addToast('success', `↩️ ${data.participantName || 'Participant'} returned from pass`);
        addRecentScan({
          name: data.participantName || 'Participant',
          rollNo: data.rollNo,
          actionType: 'RETURN',
          passType: data.passType
        });
      }),

      subscribeToEvent('pass:returned', (data) => {
        setActivePasses((prev) => prev.filter((p) => p.id !== data.passId));
        addToast('success', `↩️ ${data.participantName || 'Participant'} returned from pass`);
      })
    ];

    return () => unsubs.forEach((u) => u && u());
  }, [addToast]);

  // Handle QR Scan (Supports Check-in, Any Movement Pass checkout, or Pass Return)
  const handleQrScan = useCallback(async (rawPayload) => {
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
        addToast('error', `⚠️ No active pass found for ${result.name || result.rollNo}`);
        return { success: false, error: 'No active pass' };
      }

      const elapsedMs = Date.now() - currentPass.departTime;
      const durationStr = formatDuration(elapsedMs);
      const cfg = getPassConfig(currentPass.passType);

      setActivePasses((prev) => prev.filter((p) => p.id !== currentPass.id));
      passesApi.returnPass(currentPass.id).catch(console.error);

      addRecentScan({
        name: currentPass.participantName,
        rollNo: currentPass.rollNo,
        team: currentPass.team,
        actionType: 'RETURN',
        passType: currentPass.passType,
        duration: durationStr
      });

      addToast('success', `↩️ ${currentPass.participantName} returned — duration: ${durationStr}`, `${cfg.icon} ${cfg.label} completed`);
      return { success: true, mode: 'return', duration: durationStr };
    }

    // If scan payload is a specific movement pass checkout
    if (['WASHROOM', 'FOOD_PICKUP', 'REST_BREAK', 'LEFT_VENUE'].includes(result.type) || (['WASHROOM', 'FOOD_PICKUP', 'REST_BREAK', 'LEFT_VENUE'].includes(scanMode))) {
      const passTypeToUse = scanMode !== 'auto' && scanMode !== 'checkin' ? scanMode : result.type;
      const cfg = getPassConfig(passTypeToUse);

      const target = participants.find((p) => p.rollNo === result.rollNo || p.id === result.participantId);
      const name = target?.name || result.name || `Badge ${result.rollNo}`;
      const team = target?.team || result.team || 'Open Squad';

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

      addRecentScan({
        name,
        rollNo: result.rollNo,
        team,
        actionType: 'PASS_OUT',
        passType: passTypeToUse,
        reason: newPass.reason
      });

      addToast('info', `${cfg.icon} ${name} out — ${cfg.label}`, `Allowed limit: ${cfg.overdueMinutes}m • ${team}`);
      return { success: true, mode: 'pass_checkout', type: passTypeToUse };
    }

    // Standard Check-in scan (auto-creates participant in database on the fly if not yet registered)
    const existing = participants.find(
      (p) => p.rollNo === result.rollNo || p.id === result.participantId
    );

    if (existing && existing.status === 'present') {
      addToast('error', `⚠️ ${existing.name} is already checked in (at ${existing.scannedAt || 'earlier'})`);
      return { success: false, error: 'Already checked in' };
    }

    const nowStr = formatClockTime();

    try {
      const data = await rosterApi.processScan(rawPayload, 'CHECKIN');
      const pName = data?.participantName || data?.name || result.name || `Badge ${result.rollNo}`;
      const pRoll = data?.rollNumber || data?.rollNo || result.rollNo;
      const pTeam = data?.team || result.team || 'Open Squad';
      const pTable = data?.table || result.table || 'Table 01';
      const pId = data?.participantId || data?.id || result.participantId || `p_${Date.now()}`;

      setParticipants((prev) => {
        const found = prev.some((p) => p.rollNo === pRoll || p.id === pId || (result.passId && p.passId === result.passId));
        if (found) {
          return prev.map((p) =>
            p.rollNo === pRoll || p.id === pId || (result.passId && p.passId === result.passId)
              ? {
                  ...p,
                  name: pName,
                  rollNo: result.passId || pRoll,
                  passId: result.passId || pRoll,
                  phone: result.phone || data?.phone || p.phone || '',
                  status: 'present',
                  scannedAt: nowStr,
                  markedBy: 'qr_scan'
                }
              : p
          );
        }
        return [
          {
            id: pId,
            name: pName,
            rollNo: result.passId || pRoll,
            passId: result.passId || pRoll,
            phone: result.phone || data?.phone || '',
            team: pTeam,
            table: pTable,
            status: 'present',
            scannedAt: nowStr,
            markedBy: 'qr_scan'
          },
          ...prev
        ];
      });

      addRecentScan({
        name: pName,
        rollNo: result.passId || pRoll,
        team: pTeam,
        actionType: 'CHECKIN',
        mode: 'checkin'
      });

      addToast('success', `✅ ${pName} (${result.passId || pRoll}) checked in!`, `${result.phone ? '📞 ' + result.phone + ' • ' : ''}${nowStr}`);
      return { success: true, mode: 'checkin', participant: pName };
    } catch (err) {
      if (err.response?.status === 409) {
        addToast('error', `⚠️ ${err.response?.data?.message || 'Already checked in'}`);
        return { success: false, error: 'Already checked in' };
      }
      
      // Fallback local registration if server unreachable
      const pName = result.name || `Badge ${result.rollNo}`;
      const finalPassId = result.passId || result.rollNo;
      setParticipants((prev) => {
        const found = prev.some((p) =>
          p.rollNo === result.rollNo ||
          p.rollNo === finalPassId ||
          p.passId === finalPassId ||
          (result.passId && p.passId === result.passId) ||
          (result.participantId && p.id === result.participantId)
        );
        if (found) {
          return prev.map((p) =>
            p.rollNo === result.rollNo ||
            p.rollNo === finalPassId ||
            p.passId === finalPassId ||
            (result.passId && p.passId === result.passId) ||
            (result.participantId && p.id === result.participantId)
              ? {
                  ...p,
                  name: pName,
                  rollNo: finalPassId,
                  passId: finalPassId,
                  phone: result.phone || p.phone || '',
                  status: 'present',
                  scannedAt: nowStr,
                  markedBy: 'qr_scan'
                }
              : p
          );
        }
        return [
          {
            id: result.participantId || `p_${Date.now()}`,
            name: pName,
            rollNo: finalPassId,
            passId: finalPassId,
            phone: result.phone || '',
            team: result.team || 'Team Alpha',
            table: result.table || 'Table 01',
            status: 'present',
            scannedAt: nowStr,
            markedBy: 'qr_scan'
          },
          ...prev
        ];
      });

      addRecentScan({
        name: pName,
        rollNo: finalPassId,
        team: result.team || 'Team Alpha',
        actionType: 'CHECKIN',
        mode: 'checkin'
      });

      addToast('success', `✅ ${pName} (${finalPassId}) checked in!`, `${result.phone ? '📞 ' + result.phone + ' • ' : ''}${nowStr}`);
      return { success: true, mode: 'checkin', participant: pName };
    }
  }, [scanMode, activePasses, participants, addToast]);

  // Clear roster records
  const clearRoster = useCallback(() => {
    setParticipants([]);
    setRecentScans([]);
    localStorage.removeItem('ops_roster');
    addToast('info', 'Participant roster cleared');
  }, [addToast]);

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
        recentScans,
        toasts,
        addToast,
        removeToast,
        handleQrScan,
        clearRoster,
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
