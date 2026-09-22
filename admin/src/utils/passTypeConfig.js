// Central configuration for Hackathon Pass Types
// Adding a new pass type here automatically propagates throughout the app

export const PASS_TYPES = {
  WASHROOM: {
    id: 'WASHROOM',
    label: 'Washroom',
    icon: '🚻',
    overdueMinutes: 10,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.35)',
    description: 'Quick restroom break inside hackathon perimeter'
  },
  FOOD_PICKUP: {
    id: 'FOOD_PICKUP',
    label: 'Food Pickup',
    icon: '🍔',
    overdueMinutes: 20,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    description: 'Cafeteria, food truck, or outside delivery counter'
  },
  REST_BREAK: {
    id: 'REST_BREAK',
    label: 'Rest Break',
    icon: '😴',
    overdueMinutes: 45,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.35)',
    description: 'Nap pods or quiet chillout lounge'
  },
  LEFT_VENUE: {
    id: 'LEFT_VENUE',
    label: 'Left Venue',
    icon: '🚪',
    overdueMinutes: 60,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    isCritical: true,
    description: 'Stepped outside main gates / campus boundary'
  }
};

export const PASS_TYPE_LIST = Object.values(PASS_TYPES);

export function getPassConfig(typeKey) {
  if (!typeKey) return PASS_TYPES.WASHROOM;
  const normalized = String(typeKey).toUpperCase().replace(/-/g, '_');
  return PASS_TYPES[normalized] || PASS_TYPES.WASHROOM;
}
