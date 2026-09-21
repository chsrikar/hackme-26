import { useState } from 'react';
import { tracks } from '../../data/tracks';
import { ArrowRight, CheckCircle2, Users, Mail, Plus, Trash2 } from 'lucide-react';
import PixelButton from '../common/PixelButton';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    teamName: '',
    trackPreference: tracks[0]?.id || 'ai-ml-intelligence',
    teamMembers: [
      { name: '', email: '' },
      { name: '', email: '' }
    ]
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [regId, setRegId] = useState('');

  const addMember = () => {
    if (formData.teamMembers.length < 3) { // up to 3 additional members (total 4)
      setFormData((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { name: '', email: '' }]
      }));
    }
  };

  const removeMember = (index) => {
    if (formData.teamMembers.length > 1) { // minimum 2 additional (total 3)
      setFormData((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.filter((_, i) => i !== index)
      }));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.teamMembers];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, teamMembers: updated }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid Email is required';
    if (!formData.institution.trim()) errs.institution = 'College/Institution is required';
    if (!formData.teamName.trim()) errs.teamName = 'Team Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      console.log('HACK 26 Registration Data:', formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      setRegId(`HACK26-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 700);
  };

  if (isSuccess) {
    return (
      <div
        className="clip-pixel-corners"
        style={{
          background: '#0d0d12',
          border: '2px solid var(--color-overmind-orange)',
          padding: 'clamp(32px, 6vw, 48px)',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(0,0,0,0.8)'
        }}
      >
        <CheckCircle2 size={46} color="#00ff80" style={{ margin: '0 auto 16px auto' }} />
        <span className="pixel-tag" style={{ color: '#00ff80', borderColor: 'rgba(0,255,128,0.4)', background: '#0e1c14' }}>
          REGISTRATION CONFIRMED
        </span>

        <h3 style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 800, margin: '12px 0 16px 0' }}>
          Welcome to HACK 26!
        </h3>

        <p style={{ maxWidth: '540px', margin: '0 auto 24px auto', color: '#d1d5db', lineHeight: 1.6 }}>
          Team <strong>{formData.teamName}</strong> has been registered for HACK 26 at VISAT Engineering College. A confirmation dispatch has been sent to <strong>{formData.email}</strong>.
        </p>

        <div style={{ display: 'inline-block', background: '#14141c', border: '1px solid #292938', padding: '12px 24px', marginBottom: '28px' }}>
          <div className="font-mono" style={{ fontSize: '0.75rem', color: '#9ca3af' }}>REGISTRATION TICKET ID</div>
          <div className="font-pixel" style={{ fontSize: '1.4rem', color: 'var(--color-overmind-orange)', marginTop: '4px' }}>
            {regId}
          </div>
        </div>

        <div>
          <PixelButton
            variant="stone"
            size="md"
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                fullName: '',
                email: '',
                institution: '',
                teamName: '',
                trackPreference: tracks[0]?.id || 'ai-ml-intelligence',
                teamMembers: [
                  { name: '', email: '' },
                  { name: '', email: '' }
                ]
              });
            }}
          >
            Register Another Team
          </PixelButton>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="clip-pixel-corners"
      style={{
        background: '#0d0d12',
        border: '1px solid #242430',
        padding: 'clamp(24px, 5vw, 44px)',
        boxShadow: '0 16px 50px rgba(0,0,0,0.7)'
      }}
      noValidate
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Team Leader: Full Name & Email */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e5e7eb', marginBottom: '6px' }}>
              Full Name (Team Leader) *
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Chen"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="clip-pixel-corners"
              style={{
                width: '100%',
                background: '#14141a',
                border: errors.fullName ? '1px solid #ef4444' : '1px solid #282836',
                color: '#ffffff',
                padding: '12px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
              required
            />
            {errors.fullName && <span style={{ color: '#ef4444', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e5e7eb', marginBottom: '6px' }}>
              Email Address *
            </label>
            <input
              type="email"
              placeholder="leader@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="clip-pixel-corners"
              style={{
                width: '100%',
                background: '#14141a',
                border: errors.email ? '1px solid #ef4444' : '1px solid #282836',
                color: '#ffffff',
                padding: '12px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
              required
            />
            {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
          </div>
        </div>

        {/* College / Institution & Team Name */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e5e7eb', marginBottom: '6px' }}>
              College / Institution *
            </label>
            <input
              type="text"
              placeholder="e.g. VISAT Engineering College"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="clip-pixel-corners"
              style={{
                width: '100%',
                background: '#14141a',
                border: errors.institution ? '1px solid #ef4444' : '1px solid #282836',
                color: '#ffffff',
                padding: '12px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
              required
            />
            {errors.institution && <span style={{ color: '#ef4444', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '4px', display: 'block' }}>{errors.institution}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e5e7eb', marginBottom: '6px' }}>
              Team Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Neural Vectors"
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              className="clip-pixel-corners"
              style={{
                width: '100%',
                background: '#14141a',
                border: errors.teamName ? '1px solid #ef4444' : '1px solid #282836',
                color: '#ffffff',
                padding: '12px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
              required
            />
            {errors.teamName && <span style={{ color: '#ef4444', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '4px', display: 'block' }}>{errors.teamName}</span>}
          </div>
        </div>

        {/* Track Preference */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e5e7eb', marginBottom: '6px' }}>
            Track Preference
          </label>
          <select
            value={formData.trackPreference}
            onChange={(e) => setFormData({ ...formData, trackPreference: e.target.value })}
            className="clip-pixel-corners"
            style={{
              width: '100%',
              background: '#14141a',
              border: '1px solid #282836',
              color: '#ffffff',
              padding: '12px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {tracks.map((t) => (
              <option key={t.id} value={t.id} style={{ background: '#14141a', color: '#fff' }}>
                {t.title} — {t.genre}
              </option>
            ))}
          </select>
        </div>

        {/* Team Members (3–4 members fixed) */}
        <div style={{ borderTop: '1px dashed #282836', paddingTop: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#ffffff', fontWeight: 700 }}>
                Team Members (Fixed 3–4 Members)
              </span>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af' }}>
                Leader + {formData.teamMembers.length} members ({formData.teamMembers.length + 1} total builders)
              </span>
            </div>

            {formData.teamMembers.length < 3 && (
              <button
                type="button"
                onClick={addMember}
                className="clip-pixel-corners"
                style={{
                  background: '#1a1a24',
                  border: '1px solid #323244',
                  color: 'var(--color-overmind-orange)',
                  padding: '4px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={13} /> Add 4th Member
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {formData.teamMembers.map((member, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: '10px',
                  alignItems: 'center'
                }}
              >
                <input
                  type="text"
                  placeholder={`Member ${idx + 2} Name`}
                  value={member.name}
                  onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                  className="clip-pixel-corners"
                  style={{
                    background: '#14141a',
                    border: '1px solid #282836',
                    color: '#ffffff',
                    padding: '10px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                />
                <input
                  type="email"
                  placeholder={`Member ${idx + 2} Email`}
                  value={member.email}
                  onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                  className="clip-pixel-corners"
                  style={{
                    background: '#14141a',
                    border: '1px solid #282836',
                    color: '#ffffff',
                    padding: '10px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                />
                {formData.teamMembers.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '6px' }}
                    title="Remove member"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit CTA */}
        <div style={{ marginTop: '10px' }}>
          <PixelButton
            type="submit"
            variant="orange"
            size="lg"
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isSubmitting ? 'PROCESSING APPLICATION...' : 'Submit Registration'}
          </PixelButton>
        </div>
      </div>
    </form>
  );
}
