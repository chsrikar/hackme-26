import { Trophy, Award, Medal, CheckCircle2, Star } from 'lucide-react';
import Badge from '../common/Badge';

export default function PrizeCard({ prize }) {
  const isChampion = prize.highlight;

  return (
    <div className={`prize-card ${isChampion ? 'champion' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isChampion ? (
            <Trophy size={28} color="#fbbf24" />
          ) : prize.rank === '2nd Place' ? (
            <Award size={26} color="#94a3b8" />
          ) : (
            <Medal size={26} color="#d97706" />
          )}
          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{prize.rank}</span>
        </div>
        <Badge variant={isChampion ? 'amber' : 'cyan'}>{prize.badge}</Badge>
      </div>

      <div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '2px' }}>{prize.title}</h3>
        <div className="prize-amount">{prize.amount}</div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>({prize.cash} + Cloud credits)</p>
      </div>

      <ul className="prize-perks-list">
        {prize.perks.map((perk, idx) => (
          <li key={idx} className="prize-perk-item">
            <CheckCircle2 size={16} color={isChampion ? '#fbbf24' : 'var(--color-primary)'} style={{ flexShrink: 0, marginTop: '3px' }} />
            <span>{perk}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategoryPrizeCard({ item }) {
  return (
    <div className="category-prize-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Badge variant="purple">Category Bounty</Badge>
        <span className="code-font" style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '1.2rem' }}>
          {item.amount}
        </span>
      </div>
      <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{item.category}</h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', marginBottom: '8px', fontWeight: 600 }}>
        Sponsored by {item.sponsor}
      </p>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
        {item.description}
      </p>
    </div>
  );
}
