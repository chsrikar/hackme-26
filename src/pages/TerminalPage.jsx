import { useState, useRef, useEffect } from 'react';
import { Terminal as TermIcon, ArrowLeft, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function TerminalPage() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: "HACKME'26 ARENA OPERATING SYSTEM (v2.6.4-turing)" },
    { type: 'system', text: "Connected to Node: cluster-04.hackme26.internal" },
    { type: 'system', text: "Type 'help' to inspect available system commands or click shortcuts below.\n" }
  ]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    const newEntries = [{ type: 'user', text: `$ ${cmd}` }];

    switch (trimmed) {
      case 'help':
        newEntries.push({
          type: 'output',
          text: `AVAILABLE COMMANDS:
  schedule    - Inspect Day 1 & Day 2 chronological timetable
  vectors     - List 4 innovation vectors & problem statements
  prizes      - View ₹5,00,000+ podium cash, vouchers & track bounties
  rules       - Review team composition & submission guidelines
  mentors     - Display faculty leads and industry jury panels
  rubric      - Show 5-pillar scoring weightage and evals
  register    - Navigate to registration form
  clear       - Clear terminal output buffer`
        });
        break;

      case 'schedule':
        newEntries.push({
          type: 'output',
          text: `[REDIRECTING] Navigating to /schedule runbook...`
        });
        setTimeout(() => navigate('/schedule'), 600);
        break;

      case 'vectors':
      case 'tracks':
        newEntries.push({
          type: 'output',
          text: `[REDIRECTING] Opening /vectors domain topology...`
        });
        setTimeout(() => navigate('/vectors'), 600);
        break;

      case 'prizes':
        newEntries.push({
          type: 'output',
          text: `[REDIRECTING] Loading /prizes and fellowship grants...`
        });
        setTimeout(() => navigate('/prizes'), 600);
        break;

      case 'rules':
        newEntries.push({
          type: 'output',
          text: `[REDIRECTING] Opening /rules and protocol guidelines...`
        });
        setTimeout(() => navigate('/rules'), 600);
        break;

      case 'mentors':
        newEntries.push({
          type: 'output',
          text: `[REDIRECTING] Accessing /mentors advisory panel...`
        });
        setTimeout(() => navigate('/mentors'), 600);
        break;

      case 'rubric':
        newEntries.push({
          type: 'output',
          text: `[REDIRECTING] Loading /rubric scoring benchmarks...`
        });
        setTimeout(() => navigate('/rubric'), 600);
        break;

      case 'register':
        newEntries.push({
          type: 'output',
          text: `[REDIRECTING] Opening registration form in external portal...`
        });
        setTimeout(() => window.open('https://forms.gle/Z1KZCfkG4Jqq4eqj9', '_blank'), 600);
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        newEntries.push({
          type: 'error',
          text: `zsh: command not found: ${trimmed}. Type 'help' for available commands.`
        });
    }

    setHistory((prev) => [...prev, ...newEntries]);
    setInput('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleCommand(input);
  };

  return (
    <div style={{ backgroundColor: '#070708', minHeight: '100vh', color: '#f5f5f4', paddingTop: '40px', paddingBottom: '90px' }}>
      <div className="page-container">
        {/* Back breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#9ca3af',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={14} /> // HOME TERMINAL
          </Link>
        </div>

        {/* Page Header */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span
              className="pixel-tag"
              style={{
                color: 'var(--color-overmind-orange)',
                borderColor: 'rgba(242, 98, 7, 0.4)',
                background: '#161210'
              }}
            >
              CLI SUBSYSTEM // LIVE CONSOLE
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            HACKME'26 Interactive Terminal
          </h1>
        </div>

        {/* Quick Command Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['help', 'schedule', 'vectors', 'prizes', 'rules', 'mentors', 'rubric', 'register', 'clear'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleCommand(cmd)}
              className="clip-pixel-corners"
              style={{
                background: '#13131a',
                border: '1px solid #282836',
                color: '#d1d5db',
                padding: '6px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              ${cmd}
            </button>
          ))}
        </div>

        {/* Terminal Window */}
        <div
          className="clip-pixel-corners"
          style={{
            background: '#090a0d',
            border: '2px solid #232730',
            boxShadow: '0 20px 60px rgba(0,0,0,0.85)',
            overflow: 'hidden'
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Terminal Titlebar */}
          <div
            style={{
              background: '#13151b',
              borderBottom: '1px solid #232730',
              padding: '10px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span className="font-mono" style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '8px' }}>
                hackme26_sh — zsh — 80x24
              </span>
            </div>
            <span className="font-pixel" style={{ fontSize: '0.72rem', color: '#00ff80' }}>
              ONLINE // 142ms
            </span>
          </div>

          {/* Terminal Screen Body */}
          <div
            style={{
              padding: '24px',
              minHeight: '440px',
              maxHeight: '600px',
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              lineHeight: 1.6
            }}
          >
            {history.map((item, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '8px',
                  whiteSpace: 'pre-wrap',
                  color:
                    item.type === 'user'
                      ? '#ffffff'
                      : item.type === 'system'
                      ? '#38bdf8'
                      : item.type === 'error'
                      ? '#f87171'
                      : '#00ff80'
                }}
              >
                {item.text}
              </div>
            ))}

            {/* Live prompt input line */}
            <form onSubmit={onSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
              <span style={{ color: 'var(--color-overmind-orange)', fontWeight: 700 }}>hackme26@cluster:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
                placeholder="type command..."
              />
            </form>
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
