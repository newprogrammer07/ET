import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

export function SignalScoreRadar({ scores }) {
  const data = [
    { dimension: 'Pattern',     score: scores.patternStrength    },
    { dimension: 'Win Rate',    score: scores.historicalWinRate  },
    { dimension: 'Volume',      score: scores.volumeConfirmation },
    { dimension: 'Fundamental', score: scores.fundamentalAlign   },
    { dimension: 'Sentiment',   score: scores.sentimentScore     },
  ]

  return (
    <div style={{ width: 220, height: 180, margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.15)" gridType="polygon" />
          <PolarAngleAxis 
            dataKey="dimension" 
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} 
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="var(--accent-teal)"
            fill="var(--accent-gold)"
            fillOpacity={0.25}
            strokeWidth={1.5}
            isAnimationActive={true}
            animationBegin={200}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
