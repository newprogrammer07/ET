export async function streamPortfolioAnalysis(question, portfolio, signals, onChunk, onComplete) {
  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, portfolio, signals })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let currentText = ''

    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      
      const lines = buffer.split('\n\n')
      // The last element might be an incomplete chunk, so we keep it in the buffer
      buffer = lines.pop()

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.text) {
              currentText += data.text
              onChunk(currentText)
            }
          } catch (e) {
            console.error('SSE parse error:', e)
          }
        }
      }
    }

    onComplete(currentText)
  } catch (error) {
    console.error("AI Analysis failed:", error)
    onComplete("⚠️ Unable to connect to backend AI services. Please try again.")
  }
}
