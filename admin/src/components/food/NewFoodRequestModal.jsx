import React, { useState } from 'react';
import { Utensils, X, Plus } from 'lucide-react';
import { HACKATHON_TEAMS } from '../../data/mockRoster';
import { FOOD_MENU_ITEMS, DIETARY_TAGS } from '../../data/mockFoodMenu';
import { useOpsSession } from '../../context/OpsSessionContext';
import Button from '../common/Button';

export default function NewFoodRequestModal({ isOpen, onClose }) {
  const { addFoodRequest } = useOpsSession();

  const [team, setTeam] = useState(HACKATHON_TEAMS[0]);
  const [participantName, setParticipantName] = useState('');
  const [table, setTable] = useState('Table 01');
  const [selectedMenuItem, setSelectedMenuItem] = useState(FOOD_MENU_ITEMS[0].name);
  const [quantity, setQuantity] = useState(2);
  const [dietary, setDietary] = useState(FOOD_MENU_ITEMS[0].dietary);
  const [customNotes, setCustomNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleMenuChange = (e) => {
    const itemName = e.target.value;
    setSelectedMenuItem(itemName);
    const itemObj = FOOD_MENU_ITEMS.find((f) => f.name === itemName);
    if (itemObj) {
      setDietary(itemObj.dietary);
      setQuantity(itemObj.defaultQty);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addFoodRequest({
        team,
        participantName: participantName.trim() || 'Team Member',
        table,
        items: `${quantity}x ${selectedMenuItem}`,
        quantity: Number(quantity),
        dietary,
        notes: customNotes.trim()
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1.12rem' }}>Log Manual Catering / Food Request</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="food-team-select">
                Team
              </label>
              <select
                id="food-team-select"
                className="form-select"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              >
                {HACKATHON_TEAMS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="food-table">
                Desk / Table #
              </label>
              <input
                id="food-table"
                type="text"
                className="form-input"
                value={table}
                onChange={(e) => setTable(e.target.value)}
                placeholder="e.g. Table 04 / Lab B"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="food-participant">
              Participant Name (Optional)
            </label>
            <input
              id="food-participant"
              type="text"
              className="form-input"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="e.g. Diya Patel (leave blank for team)"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="menu-item-select">
                Food / Snack Item
              </label>
              <select
                id="menu-item-select"
                className="form-select"
                value={selectedMenuItem}
                onChange={handleMenuChange}
              >
                {FOOD_MENU_ITEMS.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name} ({item.dietary})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="food-qty">
                Quantity
              </label>
              <input
                id="food-qty"
                type="number"
                min="1"
                max="10"
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="dietary-select">
                Dietary Tag
              </label>
              <select
                id="dietary-select"
                className="form-select"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
              >
                {DIETARY_TAGS.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="food-notes">
                Allergies / Special Notes
              </label>
              <input
                id="food-notes"
                type="text"
                className="form-input"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Extra hot, no cheese"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting} icon={Plus}>
              {isSubmitting ? 'Logging...' : 'Queue Food Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
