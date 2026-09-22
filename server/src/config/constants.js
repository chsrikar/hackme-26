// Centralized Hackathon Operations Constants & Thresholds

export const PASS_CONFIG = {
  washroom: {
    label: 'Washroom Break',
    thresholdMinutes: 10,
    tokenExpiryMinutes: 20, // 2x threshold
    icon: '🚻'
  },
  food_pickup: {
    label: 'Food / Outside Order Pickup',
    thresholdMinutes: 20,
    tokenExpiryMinutes: 40,
    icon: '🍔'
  },
  rest_break: {
    label: 'Rest / Nap Lounge Break',
    thresholdMinutes: 45,
    tokenExpiryMinutes: 90,
    icon: '😴'
  },
  left_venue: {
    label: 'Left Venue (Temporary Offsite)',
    thresholdMinutes: 90,
    tokenExpiryMinutes: 180,
    icon: '🚪',
    criticalSafetyAlert: true
  }
};

export const BASE_PASS_EXPIRY_HOURS = 24;

export const OVERDUE_SWEEPER_INTERVAL_MS = 30 * 1000; // Sweep every 30s
