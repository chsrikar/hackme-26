import { useState } from 'react';
import {
  Network, Database, GitPullRequest, Cpu, CheckCircle2,
  ExternalLink, Search, Filter, Play, Check, ChevronRight,
  TrendingDown, Shield, FileCode, CheckSquare, Layers, Eye
} from 'lucide-react';
import PixelButton from '../common/PixelButton';

export default function OvermindFeatures() {
  // Section 1: Active node in Context Graph
  const [selectedNode, setSelectedNode] = useState('router');

  // Section 2: Traces table selection
  const [selectedTraces, setSelectedTraces] = useState(['TR-9801', 'TR-9802']);
  const toggleTrace = (id) => {
    setSelectedTraces((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // Section 4: Training step slider
  const [trainingStep, setTrainingStep] = useState(2400);

  const tracesData = [
    { id: 'TR-9801', agent: 'autonomous-coder', model: 'Llama-3.3-70B', latency: '142ms', tokens: '1,420', status: '200 OK' },
    { id: 'TR-9802', agent: 'zk-circuit-verifier', model: 'Overmind-ZK-8B', latency: '68ms', tokens: '840', status: '200 OK' },
    { id: 'TR-9803', agent: 'clinical-fhir-eval', model: 'Claude-3.5-Sonnet', latency: '310ms', tokens: '2,890', status: '200 OK' },
    { id: 'TR-9804', agent: 'edge-rtos-controller', model: 'DeepSeek-R1-Distill', latency: '44ms', tokens: '410', status: '200 OK' },
    { id: 'TR-9805', agent: 'quantum-annealer', model: 'Overmind-Q-7B', latency: '180ms', tokens: '1,120', status: '200 OK' },
  ];

  return (
    <div id="capability-sections" style={{ display: 'flex', flexDirection: 'column', gap: '100px', padding: '40px 0 80px 0', background: '#0a0a0c' }}>
      {/* =========================================================================
          SECTION 01: INNOVATION VECTORS & PROBLEM STATEMENTS
          ========================================================================= */}
      <section id="section-context-graph" className="page-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="font-pixel" style={{ color: 'var(--color-overmind-orange)', fontSize: '0.9rem' }}>
            // 01
          </span>
          <span className="pixel-tag" style={{ color: 'var(--color-overmind-orange)', borderColor: 'rgba(242, 98, 7, 0.4)', background: '#141210' }}>
            INNOVATION VECTORS & PROBLEM STATEMENTS
          </span>
        </div>

        <div className="overmind-grid-2col">
          {/* Left Card */}
          <div className="overmind-feature-box clip-pixel-corners" style={{ background: '#121215', borderColor: '#26262e' }}>
            <div style={{ width: '36px', height: '36px', background: '#1a1a20', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Network size={20} color="var(--color-overmind-orange)" />
            </div>

            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', color: '#ffffff', fontWeight: 700, lineHeight: 1.15, marginBottom: '16px' }}>
              Tackle frontier engineering vectors
            </h2>

            <p style={{ color: '#9ca3af', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '18px' }}>
              Choose from 4 high-impact domains: Autonomous AI Agents, Zero-Knowledge Systems, Embedded Edge Robotics & RTOS, and Scalable Decentralized Protocols.
            </p>

            <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Every vector at HACKME'26 is backed by real-world industry problem statements, pre-configured seed repositories, dataset sandboxes, and dedicated hardware debugging benches on-campus.
            </p>

            <PixelButton to="/schedule" variant="orange" size="md" icon={<ChevronRight size={16} />}>
              Explore 36h runbook
            </PixelButton>
          </div>

          {/* Right: Live Interactive Node Graph UI Window */}
          <div
            className="clip-pixel-corners"
            style={{
              background: '#0e0e12',
              border: '1px solid #23232b',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
              overflow: 'hidden'
            }}
          >
            {/* Window Chrome Titlebar */}
            <div
              style={{
                background: '#16161c',
                borderBottom: '1px solid #23232b',
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
                  hackme26_vector_topology.env
                </span>
              </div>
              <span className="font-pixel" style={{ fontSize: '0.72rem', color: '#00ff80' }}>
                LIVE TOPOLOGY // ACTIVE
              </span>
            </div>

            {/* Node Visualizer Canvas */}
            <div style={{ padding: '24px', background: '#0a0a0d', position: 'relative', minHeight: '340px' }}>
              {/* Nodes Row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  onClick={() => setSelectedNode('trigger')}
                  style={{
                    background: selectedNode === 'trigger' ? '#1c1c24' : '#121217',
                    border: `1px solid ${selectedNode === 'trigger' ? 'var(--color-overmind-orange)' : '#262630'}`,
                    padding: '12px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-mono" style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}>
                      01 // Ingestion Gateway & Prompt
                    </span>
                    <span className="font-pixel" style={{ color: '#00ff80', fontSize: '0.72rem' }}>
                      P99: 12ms
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                    Validates user context against verified schemas. Redacts untrusted inputs.
                  </div>
                </div>

                <div
                  onClick={() => setSelectedNode('router')}
                  style={{
                    background: selectedNode === 'router' ? '#1c1c24' : '#121217',
                    border: `1px solid ${selectedNode === 'router' ? 'var(--color-overmind-orange)' : '#262630'}`,
                    padding: '12px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-mono" style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}>
                      02 // Orchestrator Reasoner Node
                    </span>
                    <span className="font-pixel" style={{ color: 'var(--color-overmind-orange)', fontSize: '0.72rem' }}>
                      Llama-3.3-70B
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                    Multi-step tool planning & decision paths discovered directly from repository traces.
                  </div>
                </div>

                <div
                  onClick={() => setSelectedNode('zk')}
                  style={{
                    background: selectedNode === 'zk' ? '#1c1c24' : '#121217',
                    border: `1px solid ${selectedNode === 'zk' ? 'var(--color-overmind-orange)' : '#262630'}`,
                    padding: '12px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-mono" style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}>
                      03 // Zero-Knowledge Prover & Edge Tool
                    </span>
                    <span className="font-pixel" style={{ color: '#38bdf8', fontSize: '0.72rem' }}>
                      Halo2 Circuit
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                    Synthesizes verifiable execution proof and guarantees deterministic state updates.
                  </div>
                </div>
              </div>

              {/* Bottom Inspection Badge */}
              <div style={{ marginTop: '18px', padding: '10px 14px', background: '#121217', border: '1px solid #1f1f28', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                  CONNECTED TO: OVERMIND SDK v1.4.2
                </span>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#00ff80' }}>
                  ✓ 100% GRAPH INTEGRITY
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02: PRODUCTION TRACES TO DATASETS (2 Rows)
          ========================================================================= */}
      <section id="section-traces-datasets" className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="font-pixel" style={{ color: 'var(--color-overmind-orange)', fontSize: '0.9rem' }}>
            // 02
          </span>
          <span className="pixel-tag" style={{ color: 'var(--color-overmind-orange)', borderColor: 'rgba(242, 98, 7, 0.4)', background: '#141210' }}>
            HACKER INFRASTRUCTURE & GPU PODS
          </span>
        </div>

        {/* Row 1: Left Card + Right Production Traces Data Table */}
        <div className="overmind-grid-2col">
          {/* Card */}
          <div className="overmind-feature-box clip-pixel-corners" style={{ background: '#121215', borderColor: '#26262e' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', color: '#ffffff', fontWeight: 700, lineHeight: 1.15, marginBottom: '16px' }}>
              Campus Turing Lab residency & GPU compute
            </h2>

            <p style={{ color: '#9ca3af', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '18px' }}>
              Every shortlisted team receives high-throughput Wi-Fi 6 access, NVIDIA H100 GPU compute passes, curated dataset sandboxes, and dedicated hardware debugging benches.
            </p>

            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>
              Pre-configured development sandboxes
            </h3>

            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Zero time wasted troubleshooting drivers. Connect directly to pre-configured dev pods with CUDA 12.4, PyTorch, ROS2, and Rust toolchains pre-installed.
            </p>

            <PixelButton href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" variant="orange" size="md" target="_blank" rel="noopener noreferrer">
              Claim cluster residency
            </PixelButton>
          </div>

          {/* Right: Production Traces Data Table UI Window */}
          <div
            className="clip-pixel-corners"
            style={{
              background: '#0e0e12',
              border: '1px solid #23232b',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
              overflow: 'hidden'
            }}
          >
            {/* Table Window Header */}
            <div
              style={{
                background: '#16161c',
                borderBottom: '1px solid #23232b',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={16} color="var(--color-overmind-orange)" />
                <span className="font-mono" style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600 }}>
                  Production Traces ({tracesData.length} records)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="pixel-tag" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  FILTER: 200 OK
                </span>
                <span className="pixel-tag pixel-tag-green" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  {selectedTraces.length} SELECTED
                </span>
              </div>
            </div>

            {/* Traces Table Content */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                <thead>
                  <tr style={{ background: '#111116', color: '#6b7280', borderBottom: '1px solid #1f1f28' }}>
                    <th style={{ padding: '10px 14px' }}>SELECT</th>
                    <th style={{ padding: '10px 14px' }}>TRACE ID</th>
                    <th style={{ padding: '10px 14px' }}>AGENT</th>
                    <th style={{ padding: '10px 14px' }}>LATENCY</th>
                    <th style={{ padding: '10px 14px' }}>TOKENS</th>
                    <th style={{ padding: '10px 14px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {tracesData.map((row) => {
                    const isSelected = selectedTraces.includes(row.id);
                    return (
                      <tr
                        key={row.id}
                        onClick={() => toggleTrace(row.id)}
                        style={{
                          borderBottom: '1px solid #181822',
                          background: isSelected ? 'rgba(242, 98, 7, 0.08)' : 'transparent',
                          cursor: 'pointer',
                          color: '#d1d5db'
                        }}
                      >
                        <td style={{ padding: '10px 14px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={{ accentColor: 'var(--color-overmind-orange)', cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--color-overmind-orange)' }}>
                          {row.id}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#ffffff' }}>
                          {row.agent}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#00ff80' }}>
                          {row.latency}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          {row.tokens}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ color: '#00ff80', background: 'rgba(0,255,128,0.1)', padding: '2px 6px', borderRadius: '2px' }}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Action Strip */}
            <div style={{ padding: '12px 16px', background: '#121217', borderTop: '1px solid #1f1f28', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>
                Select traces to lift directly into curated dataset
              </span>
              <button
                className="clip-pixel-corners"
                style={{
                  background: 'var(--color-overmind-orange)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                + Add To Dataset
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Left Workshop Pre-processing UI + Right Card */}
        <div className="overmind-grid-2col">
          {/* Left: Workshop UI Window */}
          <div
            className="clip-pixel-corners"
            style={{
              background: '#0e0e12',
              border: '1px solid #23232b',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
              overflow: 'hidden'
            }}
          >
            <div style={{ background: '#16161c', borderBottom: '1px solid #23232b', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={16} color="var(--color-overmind-orange)" />
                <span className="font-mono" style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600 }}>
                  Workshop Pre-processing Engine
                </span>
              </div>
              <span className="pixel-tag pixel-tag-green" style={{ fontSize: '0.68rem' }}>
                AUDIT COMPLETED
              </span>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#13131a', border: '1px solid #22222d', padding: '10px 14px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="font-mono" style={{ fontSize: '0.8rem', color: '#ffffff' }}>Deterministic Structural Checks</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>0 malformed JSON blocks, 100% token sequence validity</div>
                </div>
                <span style={{ color: '#00ff80', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>[PASS]</span>
              </div>

              <div style={{ background: '#13131a', border: '1px solid #22222d', padding: '10px 14px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="font-mono" style={{ fontSize: '0.8rem', color: '#ffffff' }}>MinHash LSH Deduplication</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Purged 1,480 identical reasoning loops (-14.2% cost)</div>
                </div>
                <span style={{ color: '#00ff80', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>[-14.2%]</span>
              </div>

              <div style={{ background: '#13131a', border: '1px solid #22222d', padding: '10px 14px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="font-mono" style={{ fontSize: '0.8rem', color: '#ffffff' }}>PII & Secret Sanitization</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Redacted bearer tokens, auth cookies & IP headers</div>
                </div>
                <span style={{ color: '#00ff80', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>[SECURE]</span>
              </div>

              <div style={{ background: '#13131a', border: '1px solid #22222d', padding: '10px 14px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="font-mono" style={{ fontSize: '0.8rem', color: '#ffffff' }}>AI Corpus Reviewer Agent</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Suggested 18 improved multi-shot reasoning exemplars</div>
                </div>
                <span style={{ color: 'var(--color-overmind-orange)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>[APPLIED]</span>
              </div>
            </div>
          </div>

          {/* Right: Card */}
          <div className="overmind-feature-box clip-pixel-corners" style={{ background: '#121215', borderColor: '#26262e' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.1rem)', color: '#ffffff', fontWeight: 700, lineHeight: 1.15, marginBottom: '14px' }}>
              Hardware lab & sensory toolchain inventory
            </h2>

            <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Access Arduino, ESP32, Raspberry Pi 5, LIDAR modules, and biometric sensor kits from the hardware lending desk. 24/7 technical mentors assist in bench soldering, circuit debugging, and sensor integration.
            </p>

            <PixelButton to="/schedule" variant="orange" size="md">
              Explore hardware inventory
            </PixelButton>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: AUTOMATED EVALS & PR OPTIMISER (2 Rows)
          ========================================================================= */}
      <section id="section-automated-evals" className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="font-pixel" style={{ color: 'var(--color-overmind-orange)', fontSize: '0.9rem' }}>
            // 03
          </span>
          <span className="pixel-tag" style={{ color: 'var(--color-overmind-orange)', borderColor: 'rgba(242, 98, 7, 0.4)', background: '#141210' }}>
            SCORING CRITERIA & AUTOMATED EVALS
          </span>
        </div>

        {/* Row 1: Left Card + Right Evals Matrix Graph */}
        <div className="overmind-grid-2col">
          <div className="overmind-feature-box clip-pixel-corners" style={{ background: '#121215', borderColor: '#26262e' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', color: '#ffffff', fontWeight: 700, lineHeight: 1.15, marginBottom: '16px' }}>
              Meritocratic scoring with verifiable rubrics
            </h2>

            <p style={{ color: '#9ca3af', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '18px' }}>
              No black-box judging. Every project is evaluated across 4 transparent vectors: Innovation (30%), Technical Depth (30%), UI/UX Execution (20%), and Working Prototype (20%).
            </p>

            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>
              Automated test suites & git verification
            </h3>

            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Automated CI test runners verify that your code compiles, dependencies install cleanly, APIs respond under latency limits, and demonstrations pass smoke tests.
            </p>

            <PixelButton to="/faq" variant="orange" size="md">
              Inspect scoring rubric
            </PixelButton>
          </div>

          {/* Right: Evaluation Matrix UI */}
          <div
            className="clip-pixel-corners"
            style={{
              background: '#0e0e12',
              border: '1px solid #23232b',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
              overflow: 'hidden'
            }}
          >
            <div style={{ background: '#16161c', borderBottom: '1px solid #23232b', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600 }}>
                EVALUATION MATRIX // HACKME26 BENCHMARK SUITE
              </span>
              <span className="font-pixel" style={{ color: '#00ff80', fontSize: '0.72rem' }}>
                SUITE PASS: 98.4%
              </span>
            </div>

            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              <div style={{ background: '#121217', border: '1px solid #1f1f28', padding: '14px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>REASONING COHERENCE</div>
                <div style={{ fontSize: '1.8rem', color: '#00ff80', fontWeight: 800, marginTop: '4px' }}>96.8%</div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>+18.4% vs un-optimised agent</div>
              </div>

              <div style={{ background: '#121217', border: '1px solid #1f1f28', padding: '14px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>TOOL CALLING PRECISION</div>
                <div style={{ fontSize: '1.8rem', color: 'var(--color-overmind-orange)', fontWeight: 800, marginTop: '4px' }}>99.2%</div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>0 schema violations in 1,200 runs</div>
              </div>

              <div style={{ background: '#121217', border: '1px solid #1f1f28', padding: '14px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>LATENCY PROFILE (P99)</div>
                <div style={{ fontSize: '1.8rem', color: '#38bdf8', fontWeight: 800, marginTop: '4px' }}>142ms</div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>Fast edge response time</div>
              </div>

              <div style={{ background: '#121217', border: '1px solid #1f1f28', padding: '14px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>TOKEN EFFICIENCY</div>
                <div style={{ fontSize: '1.8rem', color: '#a855f7', fontWeight: 800, marginTop: '4px' }}>-34.6%</div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>Optimised system instructions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Left Git PR Diff Editor + Right Card */}
        <div className="overmind-grid-2col">
          {/* Left: Git PR Diff Editor */}
          <div
            className="clip-pixel-corners"
            style={{
              background: '#0e0e12',
              border: '1px solid #23232b',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
              overflow: 'hidden'
            }}
          >
            <div style={{ background: '#16161c', borderBottom: '1px solid #23232b', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GitPullRequest size={16} color="var(--color-overmind-orange)" />
                <span className="font-mono" style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600 }}>
                  PR #418: [Optimiser] Fix Tool Argument Hallucination
                </span>
              </div>
              <span className="pixel-tag pixel-tag-green" style={{ fontSize: '0.68rem' }}>
                PASSES EVALS (100%)
              </span>
            </div>

            <div className="overmind-code-block" style={{ margin: 0, borderRadius: 0, border: 'none', padding: '18px' }}>
              <span className="diff-info">@@ -28,5 +28,8 @@ agents/zk_verifier.py @@</span>
              <span className="diff-del">- result = model.generate(prompt=raw_query)</span>
              <span className="diff-del">- return parse_raw_json(result)</span>
              <span className="diff-add">+ # Overmind Optimiser: inject verified context schema</span>
              <span className="diff-add">+ schema = load_context_graph_schema("halo2-circuit")</span>
              <span className="diff-add">+ result = model.generate_with_eval_guard(raw_query, schema=schema)</span>
              <span className="diff-add">+ return verify_zk_proof_integrity(result)</span>
              <span style={{ color: '#6b7280', display: 'block', padding: '2px 6px' }}>  # End execution pipeline</span>
            </div>

            <div style={{ padding: '12px 16px', background: '#121217', borderTop: '1px solid #1f1f28', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: '#00ff80' }}>
                Delta: +24.8% score improvement against baseline
              </span>
              <button
                className="clip-pixel-corners"
                style={{
                  background: '#00ff80',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '6px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Merge PR ↗
              </button>
            </div>
          </div>

          {/* Right Card */}
          <div className="overmind-feature-box clip-pixel-corners" style={{ background: '#121215', borderColor: '#26262e' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.1rem)', color: '#ffffff', fontWeight: 700, lineHeight: 1.15, marginBottom: '14px' }}>
              Ship verified repositories with working prototypes
            </h2>

            <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Final submissions require a clean GitHub repository with setup README, Docker compose or live deployment link, and a 2-minute video demonstration before the hard deadline on Day 2 at 9:00 AM.
            </p>

            <PixelButton to="/schedule" variant="orange" size="md">
              Review submission deadline
            </PixelButton>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: ₹1,45,000+ PRIZE POOL & REWARDS
          ========================================================================= */}
      <section id="section-model-training" className="page-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="font-pixel" style={{ color: 'var(--color-overmind-orange)', fontSize: '0.9rem' }}>
            // 04
          </span>
          <span className="pixel-tag" style={{ color: 'var(--color-overmind-orange)', borderColor: 'rgba(242, 98, 7, 0.4)', background: '#141210' }}>
            ₹1,45,000+ PRIZE POOL & REWARDS
          </span>
        </div>

        <div className="overmind-grid-2col">
          {/* Left Card */}
          <div className="overmind-feature-box clip-pixel-corners" style={{ background: '#121215', borderColor: '#26262e' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', color: '#ffffff', fontWeight: 700, lineHeight: 1.15, marginBottom: '16px' }}>
              Compete for massive bounties & VC pitch passes
            </h2>

            <p style={{ color: '#9ca3af', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '18px' }}>
              Top podium teams and specialized category winners take home cash bounties, mechanical keyboards, cloud GPU vouchers, and direct access to incubator partners.
            </p>

            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>
              Categories for builders at every level
            </h3>

            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Awards for 1st, 2nd, and 3rd overall champions, alongside dedicated cash bounties for Best Fresher Team, Best Hardware Hack, Best Autonomous Agent, and Sponsor Challenges.
            </p>

            <PixelButton href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" variant="orange" size="md" target="_blank" rel="noopener noreferrer">
              Register for HACKME'26
            </PixelButton>
          </div>

          {/* Right: Loss Curve Chart UI & GPU Pod Monitor */}
          <div
            className="clip-pixel-corners"
            style={{
              background: '#0e0e12',
              border: '1px solid #23232b',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
              overflow: 'hidden'
            }}
          >
            <div style={{ background: '#16161c', borderBottom: '1px solid #23232b', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} color="var(--color-overmind-orange)" />
                <span className="font-mono" style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600 }}>
                  HackMe'26 Rewards: ₹1,45,000+ Prize Pool
                </span>
              </div>
              <span className="pixel-tag pixel-tag-green" style={{ fontSize: '0.68rem' }}>
                4 PODIUM TIERS + 6 BOUNTIES
              </span>
            </div>

            {/* SVG Loss Curve Chart (Matching the graphic in the user's screenshot!) */}
            <div style={{ padding: '20px 24px 10px 24px', background: '#0a0a0d', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#6b7280', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                <span>TRAINING LOSS CONVERGENCE</span>
                <span style={{ color: '#00ff80' }}>Current Loss: 0.0824</span>
              </div>

              <div style={{ width: '100%', height: '180px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 500 160" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#1f1f28" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#1f1f28" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#1f1f28" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Gradient Area under Loss Curve */}
                  <defs>
                    <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-overmind-orange)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--color-overmind-orange)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 0 140 Q 60 120, 120 70 T 250 40 T 380 25 T 500 18 L 500 160 L 0 160 Z"
                    fill="url(#lossGrad)"
                  />

                  {/* Loss Curve Line */}
                  <path
                    d="M 0 140 Q 60 120, 120 70 T 250 40 T 380 25 T 500 18"
                    fill="none"
                    stroke="var(--color-overmind-orange)"
                    strokeWidth="3"
                  />

                  {/* Checkpoint Dots */}
                  <circle cx="120" cy="70" r="4" fill="#00ff80" />
                  <circle cx="250" cy="40" r="4" fill="#00ff80" />
                  <circle cx="380" cy="25" r="4" fill="#00ff80" />
                  <circle cx="500" cy="18" r="5" fill="#ffffff" stroke="var(--color-overmind-orange)" strokeWidth="2" />
                </svg>
              </div>

              {/* Progress Bar & Telemetry */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#9ca3af', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                  <span>Epoch 4/5 • 82% Progress</span>
                  <span>ETA: 14 mins</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#1f1f28', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '82%', height: '100%', background: 'linear-gradient(90deg, #f26207, #00ff80)' }} />
                </div>
              </div>
            </div>

            {/* Bottom Specs */}
            <div style={{ padding: '14px 20px', background: '#121217', borderTop: '1px solid #1f1f28', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#6b7280' }}>GPU ALLOCATION</div>
                <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600 }}>8x H100 80GB</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#6b7280' }}>THROUGHPUT</div>
                <div style={{ fontSize: '0.88rem', color: '#00ff80', fontWeight: 600 }}>4,820 tok/sec</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#6b7280' }}>PRECISION</div>
                <div style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 600 }}>BF16 Mixed</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
