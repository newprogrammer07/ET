import { useState, useEffect, useRef } from 'react'
import { Scene1, Scene2, Scene3 } from '../components/video/VideoScenes'
import { generateVideoScript } from '../api/videoScript'
import { speak, stopSpeaking, preloadVoices } from '../utils/narrator'
import { mockSignals } from '../data/mockSignals'

// ─── Static market data for the demo ─────────────────────────────────────────
// In production this would come from the live NSE API.
// For the hackathon demo, this data is hardcoded to match the signal feed.

const MARKET_DATA = {
  nifty:         22847,
  niftyChange:   1.23,
  sensex:        75210,
  sensexChange:  0.98,
  topSignal:     mockSignals[0],   // TATAMOTORS from existing mock data
  fii:           2180,
  dii:           1640,
  mood:          'Bullish',
}

const SCENE_DURATION_MS = 5000   // 5 seconds per scene = 15 seconds total

// ─── Main page component ──────────────────────────────────────────────────────

export function MarketVideo() {
  const [status, setStatus]           = useState('idle')
  // idle | generating | playing | done | error
  const [script, setScript]           = useState(null)
  const [currentScene, setCurrentScene] = useState(0)   // 0 = nothing playing
  const [error, setError]             = useState(null)
  const timerRef                      = useRef(null)

  // Preload browser voices on mount (Chrome requires this)
  useEffect(() => {
    preloadVoices()
    // Cleanup on unmount
    return () => {
      stopSpeaking()
      clearTimeout(timerRef.current)
    }
  }, [])

  // ── Generate + play ──────────────────────────────────────────────────────

  async function handleGenerate() {
    // Stop anything currently playing
    window.speechSynthesis.cancel() // This "unlocks" speech on first user interaction
    stopSpeaking()
    clearTimeout(timerRef.current)

    setStatus('generating')
    setCurrentScene(0)
    setError(null)
    setScript(null)

    try {
      const generatedScript = await generateVideoScript(MARKET_DATA)
      setScript(generatedScript)
      setStatus('playing')
      startScene(1, generatedScript)
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Script generation failed. Check that /api/chat is running.')
    }
  }

  function startScene(sceneNumber, scriptData) {
    if (sceneNumber > 3) {
      // All scenes done
      setStatus('done')
      setCurrentScene(0)
      return
    }

    setCurrentScene(sceneNumber)

    const lines = [scriptData.scene1, scriptData.scene2, scriptData.scene3]
    const text = lines[sceneNumber - 1] || ''

    // Speak the narration for this scene
    // Web Speech API — completely free, built into browser
    speak(text, null, null)

    // Advance to next scene after SCENE_DURATION_MS
    // We use a fixed timer rather than relying on speech end events
    // because browser speech timing varies and we want reliable scene sync.
    timerRef.current = setTimeout(() => {
      startScene(sceneNumber + 1, scriptData)
    }, SCENE_DURATION_MS)
  }

  function handleStop() {
    stopSpeaking()
    clearTimeout(timerRef.current)
    setStatus('idle')
    setCurrentScene(0)
  }

  function handleReplay() {
    if (!script) return
    stopSpeaking()
    clearTimeout(timerRef.current)
    setStatus('playing')
    startScene(1, script)
  }

  // ── Scene data objects ───────────────────────────────────────────────────

  const scene1Data = {
    nifty:        MARKET_DATA.nifty,
    niftyChange:  MARKET_DATA.niftyChange,
    sensex:       MARKET_DATA.sensex,
    sensexChange: MARKET_DATA.sensexChange,
  }
  const scene2Data = { signal: MARKET_DATA.topSignal }
  const scene3Data = { fii: MARKET_DATA.fii, dii: MARKET_DATA.dii }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '32px', maxWidth: 980, margin: '0 auto' }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          margin: 0,
          color: '#F5A623',
          fontFamily: "'Syne', sans-serif",
          fontSize: 26,
          fontWeight: 'bold',
          letterSpacing: '1px',
        }}>
          AI Market Video Engine
        </h1>
        <p style={{ color: '#9090A8', marginTop: 8, fontSize: 14 }}>
          One click → Claude writes the script → browser narrates it → 15-second animated video. Zero APIs beyond what this app already uses.
        </p>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28, alignItems: 'start' }}>

        {/* ════ LEFT COLUMN: Controls ════ */}
        <div>

          {/* Data inputs summary */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '18px 20px', marginBottom: 20,
          }}>
            <p style={{
              color: '#5A5A72', fontSize: 10, letterSpacing: '2px', marginBottom: 14, margin: '0 0 14px',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              TODAY'S DATA INPUTS
            </p>
            {[
              ['Nifty 50',     `${MARKET_DATA.nifty.toLocaleString('en-IN')} (+${MARKET_DATA.niftyChange}%)`],
              ['Top signal',   MARKET_DATA.topSignal?.ticker || '—'],
              ['Signal type',  (MARKET_DATA.topSignal?.signalType || '—').replace(/_/g, ' ')],
              ['Score',        `${MARKET_DATA.topSignal?.signalScore || '—'}/100`],
              ['Win rate',     `${MARKET_DATA.topSignal?.winRate || '—'}%`],
              ['FII flow',     `₹${MARKET_DATA.fii.toLocaleString('en-IN')} Cr`],
              ['DII flow',     `₹${MARKET_DATA.dii.toLocaleString('en-IN')} Cr`],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'baseline', marginBottom: 8,
              }}>
                <span style={{ color: '#5A5A72', fontSize: 12 }}>{label}</span>
                <span style={{
                  color: '#E8E8F0', fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Scene progress indicator */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              {[
                { n: 1, label: 'Nifty\nOverview' },
                { n: 2, label: 'Top\nSignal' },
                { n: 3, label: 'FII/DII\nFlows' },
              ].map(({ n, label }) => (
                <div key={n} style={{ flex: 1, textAlign: 'center' }}>
                  {/* Dot */}
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', margin: '0 auto 6px',
                    background: currentScene === n
                      ? '#F5A623'
                      : currentScene > n
                      ? '#00E676'
                      : 'rgba(255,255,255,0.1)',
                    boxShadow: currentScene === n ? '0 0 10px rgba(245,166,35,0.6)' : 'none',
                    transition: 'all 0.3s',
                  }} />
                  {/* Label */}
                  <div style={{
                    color: currentScene === n ? '#F5A623' : '#5A5A72',
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: 'pre-line', lineHeight: 1.3,
                    transition: 'color 0.3s',
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{
              height: 3, background: 'rgba(255,255,255,0.06)',
              borderRadius: 2, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: currentScene === 0 ? '0%'
                  : currentScene === 1 ? '33%'
                  : currentScene === 2 ? '66%'
                  : '100%',
                background: 'linear-gradient(90deg, #F5A623, #00E5FF)',
                borderRadius: 2,
                transition: 'width 0.4s ease-out',
              }} />
            </div>
          </div>

          {/* Primary action button */}
          <button
            onClick={
              status === 'playing' ? handleStop :
              status === 'done'    ? handleReplay :
              handleGenerate
            }
            disabled={status === 'generating'}
            style={{
              width: '100%', padding: '13px 0',
              borderRadius: 10, border: 'none', cursor: status === 'generating' ? 'not-allowed' : 'pointer',
              fontFamily: "'Syne', sans-serif", fontSize: 14,
              fontWeight: 'bold', letterSpacing: '1px',
              background: status === 'playing'
                ? 'rgba(255,82,82,0.12)'
                : status === 'generating'
                ? 'rgba(255,255,255,0.06)'
                : 'linear-gradient(135deg, #F5A623, #C4831A)',
              color: status === 'playing'
                ? '#FF5252'
                : status === 'generating'
                ? '#5A5A72'
                : '#000',
              border: status === 'playing' ? '1px solid rgba(255,82,82,0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {status === 'idle'       && '▶  Generate Video'}
            {status === 'generating' && '⏳  Claude writing script…'}
            {status === 'playing'    && '⏹  Stop'}
            {status === 'done'       && '↺  Replay'}
            {status === 'error'      && '⚠  Retry'}
          </button>

          {/* Error message */}
          {error && (
            <div style={{
              marginTop: 12, padding: '12px 14px',
              background: 'rgba(255,82,82,0.07)',
              border: '1px solid rgba(255,82,82,0.2)',
              borderRadius: 8, color: '#FF5252', fontSize: 12, lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          {/* Generated script preview */}
          {script && (
            <div style={{
              marginTop: 20,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '16px',
            }}>
              <p style={{
                color: '#5A5A72', fontSize: 10, letterSpacing: '2px',
                marginBottom: 12, fontFamily: "'JetBrains Mono', monospace",
              }}>
                CLAUDE'S SCRIPT
              </p>

              {/* Headline */}
              <p style={{
                color: '#F5A623', fontWeight: 'bold', fontSize: 13,
                marginBottom: 12, lineHeight: 1.4,
              }}>
                "{script.headline}"
              </p>

              {/* Scene lines */}
              {[
                { n: 1, text: script.scene1 },
                { n: 2, text: script.scene2 },
                { n: 3, text: script.scene3 },
              ].map(({ n, text }) => (
                <div key={n} style={{
                  padding: '8px 10px', borderRadius: 6, marginBottom: 6,
                  background: currentScene === n ? 'rgba(245,166,35,0.07)' : 'transparent',
                  borderLeft: `2px solid ${currentScene === n ? '#F5A623' : 'transparent'}`,
                  transition: 'all 0.3s',
                }}>
                  <span style={{
                    color: '#5A5A72', fontSize: 10,
                    fontFamily: "'JetBrains Mono', monospace",
                    marginRight: 6,
                  }}>
                    S{n}
                  </span>
                  <span style={{
                    color: currentScene === n ? '#E8E8F0' : '#9090A8',
                    fontSize: 12, lineHeight: 1.5,
                    transition: 'color 0.3s',
                  }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ════ RIGHT COLUMN: Video display ════ */}
        <div>

          {/* Active scene OR placeholder */}
          {currentScene === 1 && <Scene1 data={scene1Data} active={true} />}
          {currentScene === 2 && <Scene2 data={scene2Data} active={true} />}
          {currentScene === 3 && <Scene3 data={scene3Data} active={true} />}

          {currentScene === 0 && (
            <div style={{
              aspectRatio: '16 / 9',
              background: '#0A0A0F',
              borderRadius: 12,
              border: '1px dashed rgba(255,255,255,0.08)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 14,
            }}>
              <div style={{ fontSize: 44 }}>🎬</div>
              <div style={{
                color: '#3A3A52', fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1px',
              }}>
                {status === 'done'      ? 'VIDEO COMPLETE — CLICK REPLAY'  :
                 status === 'generating' ? 'GENERATING SCRIPT…'            :
                                          'READY TO GENERATE'}
              </div>
            </div>
          )}

          {/* Metadata row below video */}
          <div style={{
            marginTop: 12, display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{
              color: '#3A3A52', fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              3 SCENES · 5 SEC EACH · 15 SECONDS TOTAL
            </span>
            <span style={{
              color: '#3A3A52', fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              VOICE + VISUALS · NO HUMAN EDITING
            </span>
          </div>
        </div>

      </div>

      {/* ── SEBI disclaimer ── */}
      <div style={{
        marginTop: 28, padding: '13px 20px',
        background: 'rgba(255,179,0,0.04)',
        borderLeft: '3px solid rgba(255,179,0,0.35)',
        borderRadius: '0 8px 8px 0',
        color: '#9090A8', fontSize: 12, lineHeight: 1.6,
      }}>
        <strong style={{ color: '#FFB300' }}>Disclaimer: </strong>
        All videos generated by OpportunityRadar are for informational and analytical purposes only.
        They do not constitute investment advice. Past signal performance does not guarantee future results.
        Consult a SEBI-registered investment advisor before making any financial decisions.
      </div>

    </div>
  )
}
