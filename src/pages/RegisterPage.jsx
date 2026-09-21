import RegistrationForm from '../components/register/RegistrationForm';

export default function RegisterPage() {
  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="denmu-section-header">
        <div>
          <span className="mono-tag" style={{ color: 'var(--color-accent)', display: 'block', marginBottom: '8px' }}>
            // HACKME26 REGISTRATION PORTAL
          </span>
          <h1 className="denmu-section-title" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}>
            APPLICATION FOR COHORT 2026
          </h1>
        </div>
        <span className="mono-tag">OCT. 16–18, 2026</span>
      </div>

      <div style={{ maxWidth: '840px', margin: '0 auto', paddingTop: 'var(--space-xl)' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-2xl)' }}>
          HACKME26 is open to undergraduate, graduate, and recent collegiate builders from all institutions. Participation is completely free. Admitted teams receive on-campus residency, $5,000 in GPU cloud clusters, and direct access to hiring partners.
        </p>
        <RegistrationForm />
      </div>
    </div>
  );
}
