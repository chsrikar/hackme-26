import React from 'react';

export default function StatusBadge({ status = 'not_scanned' }) {
  const norm = String(status).toLowerCase();

  let label = 'NOT CHECKED IN';
  let badgeClass = 'not-scanned';

  if (norm === 'present') {
    label = 'CHECKED IN';
    badgeClass = 'present';
  } else if (norm === 'absent') {
    label = 'ABSENT';
    badgeClass = 'absent';
  } else if (norm === 'overdue') {
    label = 'OVERDUE';
    badgeClass = 'overdue';
  } else if (norm === 'warning' || norm === 'expiring') {
    label = 'EXPIRING';
    badgeClass = 'warning';
  }

  return (
    <span className={`status-badge ${badgeClass}`}>
      <span className="status-dot"></span>
      <span>{label}</span>
    </span>
  );
}
