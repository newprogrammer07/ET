// Calls the existing Claude API to generate a 15-second video script.
// Returns a parsed JSON object with 3 scene narration lines + headline.

export async function generateVideoScript(marketData) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt: `You are an ET Markets video anchor. Generate a 15-second market update script.
Return ONLY a raw JSON object. No markdown. No backticks. No explanation. No extra text.
Exact schema — follow it precisely:
{
  "headline": "max 8 words, punchy market headline for today",
  "scene1": "exactly 5 seconds of speech about Nifty and Sensex. Max 20 words. Start with the Nifty value.",
  "scene2": "exactly 5 seconds about the top signal. Max 20 words. Say the company name and signal type clearly.",
  "scene3": "exactly 5 seconds closing. Max 20 words. Mention FII and DII flows. End with the words: Not investment advice."
}
Rules:
- Say 'Nifty Fifty' not 'Nifty 50' (for natural speech)
- Use natural broadcast anchor tone — confident, factual
- scene3 MUST end with exactly these words: Not investment advice.
- All rupee amounts: say 'crore' not 'Cr'`,
      question: `Generate a 15-second market video script for today.
Market data:
- Nifty 50: ${marketData.nifty.toLocaleString('en-IN')} (${marketData.niftyChange > 0 ? '+' : ''}${marketData.niftyChange}% today)
- Sensex: ${marketData.sensex.toLocaleString('en-IN')} (${marketData.sensexChange > 0 ? '+' : ''}${marketData.sensexChange}%)
- Top signal of the day: ${marketData.topSignal.companyName} (${marketData.topSignal.ticker}) — ${marketData.topSignal.signalType.replace(/_/g, ' ')} — Score: ${marketData.topSignal.signalScore}/100 — Win Rate: ${marketData.topSignal.winRate}%
- FII net flow: ₹${marketData.fii} crore
- DII net flow: ₹${marketData.dii} crore
- Market mood: ${marketData.mood}`
    })
  })

  if (!response.ok) throw new Error(`Claude API error: ${response.status}`)

  const data = await response.json()

  // Handle both response shapes from the existing /api/chat endpoint
  const raw = data.content?.[0]?.text || data.response || data.message || ''
  if (!raw) throw new Error('Empty response from Claude API')

  // Strip any accidental markdown fences
  const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    throw new Error(`Claude returned invalid JSON. Raw: ${clean.slice(0, 200)}`)
  }
}
