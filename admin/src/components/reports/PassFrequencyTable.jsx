import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import Tag from '../common/Tag';

export default function PassFrequencyTable({ data = [] }) {
  const [threshold, setThreshold] = useState(8);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          Track total movement passes and left-venue patterns by team
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
          <label htmlFor="pass-threshold" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            Pass Alert Threshold:
          </label>
          <input
            id="pass-threshold"
            type="number"
            min="2"
            max="25"
            className="form-input"
            style={{ width: '60px', minHeight: '30px', padding: '2px 8px', fontSize: '0.82rem' }}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value) || 2)}
          />
          <span style={{ color: 'var(--text-muted)' }}>passes</span>
        </div>
      </div>

      <div className="roster-table-container">
        <table className="roster-table">
          <thead>
            <tr>
              <th>Team & Participant</th>
              <th>Badge Code</th>
              <th>🚻 Washroom</th>
              <th>🍔 Food</th>
              <th>😴 Rest</th>
              <th>🚪 Left Venue</th>
              <th>Total Passes</th>
              <th>Safety Flag</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const isFlagged = row.total >= threshold || row.leftVenue >= 2;

              return (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: isFlagged ? 'rgba(239, 68, 68, 0.08)' : undefined
                  }}
                >
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {row.participant}
                    </div>
                    <Tag type="team" style={{ fontSize: '0.7rem', padding: '1px 6px', marginTop: '2px' }}>
                      {row.team}
                    </Tag>
                  </td>

                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {row.rollNo}
                    </span>
                  </td>

                  <td>{row.washroom}</td>
                  <td>{row.food}</td>
                  <td>{row.rest}</td>

                  <td>
                    <strong style={{ color: row.leftVenue >= 2 ? '#ef4444' : undefined }}>
                      {row.leftVenue}
                    </strong>
                  </td>

                  <td>
                    <strong style={{ fontSize: '0.94rem' }}>{row.total}</strong>
                  </td>

                  <td>
                    {row.leftVenue >= 2 ? (
                      <span className="status-badge overdue" style={{ fontSize: '0.72rem' }}>
                        <ShieldAlert size={12} />
                        <span>High Left-Venue</span>
                      </span>
                    ) : isFlagged ? (
                      <span className="status-badge warning" style={{ fontSize: '0.72rem' }}>
                        <AlertTriangle size={12} />
                        <span>High Frequency</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Normal</span>
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
