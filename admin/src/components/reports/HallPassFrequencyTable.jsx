import React, { useState } from 'react';
import { AlertTriangle, Flame } from 'lucide-react';

export default function HallPassFrequencyTable({ data = [] }) {
  const [threshold, setThreshold] = useState(5);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          Students with high hall pass frequency during the selected date window
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
          <label htmlFor="freq-threshold" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            Highlight Alert Threshold:
          </label>
          <input
            id="freq-threshold"
            type="number"
            min="1"
            max="20"
            className="form-input"
            style={{ width: '64px', minHeight: '32px', padding: '4px 8px', fontSize: '0.82rem' }}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value) || 1)}
          />
          <span style={{ color: 'var(--text-muted)' }}>passes</span>
        </div>
      </div>

      <div className="roster-table-container">
        <table className="roster-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Total Passes</th>
              <th>Overdue Incidents</th>
              <th>Avg Duration</th>
              <th>Flag Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const isFlagged = item.totalPasses >= threshold;

              return (
                <tr
                  key={item.studentId}
                  style={{
                    backgroundColor: isFlagged ? '#fffbeb' : undefined
                  }}
                >
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.name}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                      {item.rollNo}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, fontSize: '0.94rem' }}>
                      {item.totalPasses}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        color: item.overdueCount > 0 ? 'var(--status-absent-solid)' : 'var(--text-muted)'
                      }}
                    >
                      {item.overdueCount}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                      {item.avgMinutes} mins
                    </span>
                  </td>
                  <td>
                    {isFlagged ? (
                      <span
                        className="status-badge warning"
                        style={{ fontSize: '0.74rem' }}
                      >
                        <AlertTriangle size={12} />
                        <span>High Frequency ({item.totalPasses})</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
