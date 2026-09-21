import Badge from '../common/Badge';

export default function SponsorTierBadge({ tier }) {
  const variantMap = {
    'Title Sponsors': 'cyan',
    'Gold Sponsors': 'amber',
    'Silver Sponsors': 'purple',
    'Ecosystem & Community Partners': 'emerald'
  };

  return <Badge variant={variantMap[tier] || 'cyan'}>{tier}</Badge>;
}
