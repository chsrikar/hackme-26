import axios from 'axios';
import {
  MOCK_DAYS,
  INITIAL_PARTICIPANTS,
  INITIAL_ACTIVE_PASSES,
  INITIAL_FOOD_REQUESTS,
  INITIAL_MENTOR_REQUESTS,
  MOCK_DAY_HISTORY,
  MOCK_PASS_FREQUENCY_REPORT,
  MOCK_FOOD_DEMAND_TREND,
  MOCK_OPS_USER
} from '../data/mockRoster';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ops_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  // Admin authentication with hardcoded credentials
  login: async (username, password) => {
    await new Promise((r) => setTimeout(r, 300));
    
    // Validate credentials
    if (username && username.trim().toUpperCase() === 'ADMIN' && password === 'H@ackME#26') {
      return {
        token: 'hackme26_admin_jwt_token_secured',
        user: { 
          id: 'admin-001',
          username: 'ADMIN',
          role: 'administrator',
          permissions: ['all']
        }
      };
    }
    
    throw new Error('Invalid username or password');
  }
};

export const daySessionApi = {
  getDays: async () => {
    try {
      const res = await apiClient.get('/days/');
      if (res.data && res.data.length > 0) {
        return res.data.map((d) => ({
          id: String(d.id),
          code: d.code,
          name: d.name,
          startTime: d.start_time ? new Date(d.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
          expectedEndTime: d.end_time ? new Date(d.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
          totalParticipants: d.total_participants || 24,
          totalTeams: d.total_teams || 8,
          venue: d.venue,
          status: d.status
        }));
      }
    } catch (e) {
      console.warn('daySessionApi.getDays fallback to mock:', e);
    }
    return MOCK_DAYS;
  },

  startDaySession: async (dayPayload) => {
    try {
      const res = await apiClient.post('/days/', {
        code: dayPayload.code,
        name: dayPayload.dayName || dayPayload.name,
        venue: dayPayload.venue || 'Convention Center Arena',
        status: 'active'
      });
      return {
        id: String(res.data.id),
        dayId: dayPayload.dayId || String(res.data.id),
        dayName: res.data.name,
        code: res.data.code,
        startTime: res.data.start_time ? new Date(res.data.start_time).getTime() : Date.now(),
        status: res.data.status
      };
    } catch (e) {
      console.warn('startDaySession fallback:', e);
      return {
        id: `day-sess-${Date.now().toString().slice(-5)}`,
        dayId: dayPayload.dayId,
        dayName: dayPayload.dayName,
        code: dayPayload.code,
        startTime: Date.now(),
        status: 'active'
      };
    }
  },

  closeDaySession: async (sessionId, summary) => {
    try {
      const res = await apiClient.post(`/days/${sessionId}/close/`, summary);
      return res.data;
    } catch (e) {
      console.warn('closeDaySession fallback:', e);
      return { sessionId, status: 'closed', closedAt: Date.now(), summary };
    }
  },

  getDayHistory: async () => {
    try {
      const res = await apiClient.get('/days/');
      if (res.data && res.data.length > 0) {
        return res.data.filter((d) => d.status === 'closed').map((d) => ({
          id: String(d.id),
          dayCode: d.code,
          dayName: d.name,
          date: d.start_time ? d.start_time.split('T')[0] : new Date().toISOString().split('T')[0],
          startTime: d.start_time,
          endTime: d.end_time || 'Ended',
          totalCheckedIn: d.total_participants || 24,
          totalRegistered: d.total_participants || 24,
          teamsCompleted: 8,
          totalTeams: 8,
          passesByType: { WASHROOM: 12, FOOD_PICKUP: 8, REST_BREAK: 6, LEFT_VENUE: 2 },
          foodRequestsDelivered: 4,
          status: 'closed'
        }));
      }
    } catch (e) {
      console.warn('getDayHistory fallback:', e);
    }
    return MOCK_DAY_HISTORY;
  }
};

export const rosterApi = {
  getParticipants: async () => {
    try {
      const res = await apiClient.get('/participants/');
      if (res.data && Array.isArray(res.data)) {
        return res.data.map((p) => ({
          id: String(p.id),
          name: p.name,
          rollNo: p.rollNo || p.rollNumber || p.roll_no,
          team: p.team || p.team_name,
          table: p.table,
          status: p.status,
          scannedAt: p.scannedAt ? new Date(p.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (p.scanned_at ? new Date(p.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null),
          markedBy: p.markedBy || p.marked_by,
          phone: p.phone,
          overrideNotes: p.overrideNotes || p.override_notes
        }));
      }
    } catch (e) {
      console.warn('rosterApi.getParticipants fallback:', e);
    }
    return [];
  },

  manualCheckInOverride: async (payload) => {
    try {
      const res = await apiClient.post(`/participants/${payload.participantId}/override/`, {
        status: payload.status,
        notes: payload.notes
      });
      return res.data;
    } catch (e) {
      console.warn('manualCheckInOverride fallback:', e);
      return { success: true, markedBy: 'ops_override', ...payload };
    }
  },

  processScan: async (tokenOrRoll, type = 'CHECKIN', reason = '') => {
    try {
      const res = await axios.post('/api/scan', { qrToken: String(tokenOrRoll) }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return res.data;
    } catch (nodeErr) {
      if (nodeErr.response?.status === 409) {
        throw nodeErr;
      }
      try {
        const res = await apiClient.post('/participants/scan/', {
          rollNo: tokenOrRoll,
          type,
          reason
        });
        return res.data;
      } catch (e) {
        throw nodeErr;
      }
    }
  }
};

export const scanApi = {
  logScanToBackend: async (tokenOrCode, scanType = 'EVENT ENTRY', location = 'Admin Scanner Station') => {
    const payload = {
      token: String(tokenOrCode).trim(),
      qrToken: String(tokenOrCode).trim(),
      passId: String(tokenOrCode).trim(),
      type: scanType,
      location,
      scannedBy: 'Admin Portal Web'
    };

    const endpoints = [
      '/api/scan',
      'http://127.0.0.1:5000/api/scan',
      'http://localhost:5000/api/scan',
      'http://192.168.0.185:5000/api/scan'
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'cors'
        });
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch {}
    }
    return null;
  },

  scanQr: async (qrToken) => {
    return scanApi.logScanToBackend(qrToken, 'EVENT ENTRY');
  },
  getBadgeToken: async (rollNo) => {
    const res = await axios.get(`/api/participants/${rollNo}/badge-token`);
    return res.data;
  }
};

export const passesApi = {
  getActivePasses: async () => {
    try {
      const res = await apiClient.get('/passes/?status=active');
      if (res.data) {
        return res.data.map((p) => ({
          id: String(p.id),
          studentId: String(p.participant),
          participantName: p.participant_name,
          rollNo: p.roll_no,
          team: p.team,
          passType: p.pass_type,
          reason: p.reason,
          departTime: new Date(p.depart_time).getTime(),
          status: p.status,
          overdueThresholdMinutes: p.overdue_threshold_minutes
        }));
      }
    } catch (e) {
      console.warn('passesApi.getActivePasses fallback:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_ACTIVE_PASSES));
  },

  issuePass: async (payload) => {
    try {
      const res = await apiClient.post('/participants/scan/', {
        rollNo: payload.rollNo,
        type: payload.passType,
        reason: payload.reason
      });
      return {
        id: String(res.data.pass_id || `pass-${Date.now().toString().slice(-4)}`),
        ...payload,
        departTime: Date.now(),
        status: 'active'
      };
    } catch (e) {
      console.warn('passesApi.issuePass fallback:', e);
      return {
        id: `pass-${Date.now().toString().slice(-4)}`,
        ...payload,
        departTime: Date.now(),
        status: 'active'
      };
    }
  },

  returnPass: async (passId) => {
    try {
      const res = await apiClient.post(`/passes/${passId}/mark_returned/`);
      return res.data;
    } catch (e) {
      console.warn('passesApi.returnPass fallback:', e);
      return { success: true, passId, returnedAt: Date.now() };
    }
  },

  forceClosePass: async (passId, reason) => {
    try {
      const res = await apiClient.post(`/passes/${passId}/force_close/`, { closed_by: reason });
      return res.data;
    } catch (e) {
      console.warn('passesApi.forceClosePass fallback:', e);
      return { success: true, passId, closedBy: 'ops_force_close', reason };
    }
  }
};

export const foodApi = {
  getFoodRequests: async () => {
    try {
      const res = await apiClient.get('/food/');
      if (res.data && res.data.length > 0) {
        return res.data.map((f) => ({
          id: String(f.id),
          team: f.team,
          table: f.table,
          items: f.items,
          status: f.status,
          requestedAt: new Date(f.requested_at).getTime(),
          deliveredAt: f.delivered_at ? new Date(f.delivered_at).getTime() : null,
          dietaryNotes: f.dietary_notes
        }));
      }
    } catch (e) {
      console.warn('foodApi.getFoodRequests fallback:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_FOOD_REQUESTS));
  },

  createFoodRequest: async (reqData) => {
    try {
      const res = await apiClient.post('/food/', {
        team: reqData.team,
        table: reqData.table,
        items: reqData.items,
        dietary_notes: reqData.dietaryNotes || ''
      });
      return {
        id: String(res.data.id),
        status: res.data.status,
        requestedAt: new Date(res.data.requested_at).getTime(),
        ...reqData
      };
    } catch (e) {
      console.warn('foodApi.createFoodRequest fallback:', e);
      return {
        id: `food-${Date.now().toString().slice(-4)}`,
        status: 'pending',
        requestedAt: Date.now(),
        ...reqData
      };
    }
  },

  updateFoodStatus: async (requestId, nextStatus) => {
    try {
      const res = await apiClient.patch(`/food/${requestId}/advance/`);
      return { id: requestId, status: res.data.status, updatedAt: Date.now() };
    } catch (e) {
      console.warn('foodApi.updateFoodStatus fallback:', e);
      return { id: requestId, status: nextStatus, updatedAt: Date.now() };
    }
  }
};

export const mentorApi = {
  getMentorRequests: async () => {
    try {
      const res = await apiClient.get('/mentors/');
      if (res.data && res.data.length > 0) {
        return res.data.map((m) => ({
          id: String(m.id),
          team: m.team,
          table: m.table,
          topic: m.topic,
          urgency: m.urgency,
          status: m.status,
          requestedAt: new Date(m.requested_at).getTime(),
          mentorAssigned: m.mentor_assigned,
          resolvedAt: m.resolved_at ? new Date(m.resolved_at).getTime() : null
        }));
      }
    } catch (e) {
      console.warn('mentorApi.getMentorRequests fallback:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_MENTOR_REQUESTS));
  },

  claimTicket: async (ticketId, mentorName = 'Ops Mentor') => {
    try {
      const res = await apiClient.patch(`/mentors/${ticketId}/claim/`, { mentor_name: mentorName });
      return { id: ticketId, status: res.data.status, mentorAssigned: res.data.mentor_assigned };
    } catch (e) {
      console.warn('mentorApi.claimTicket fallback:', e);
      return { id: ticketId, status: 'claimed', mentorAssigned: mentorName };
    }
  },

  resolveTicket: async (ticketId) => {
    try {
      const res = await apiClient.patch(`/mentors/${ticketId}/resolve/`);
      return { id: ticketId, status: res.data.status, resolvedAt: Date.now() };
    } catch (e) {
      console.warn('mentorApi.resolveTicket fallback:', e);
      return { id: ticketId, status: 'resolved', resolvedAt: Date.now() };
    }
  }
};

export const reportsApi = {
  getHackathonReports: async () => {
    try {
      const res = await apiClient.get('/reports/summary/');
      if (res.data) {
        return {
          passFrequency: MOCK_PASS_FREQUENCY_REPORT,
          foodDemandTrend: MOCK_FOOD_DEMAND_TREND,
          summary: res.data
        };
      }
    } catch (e) {
      console.warn('reportsApi fallback:', e);
    }
    return {
      passFrequency: MOCK_PASS_FREQUENCY_REPORT,
      foodDemandTrend: MOCK_FOOD_DEMAND_TREND
    };
  }
};

export default apiClient;
