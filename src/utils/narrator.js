// Web Speech API wrapper — completely free, works in all modern browsers.
// Best voice quality: Chrome on Windows (Microsoft neural voices) or Chrome on Mac.

export async function preloadVoices() {
  // Chrome bug: voices are not available synchronously on first load
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve(voices)
      return
    }
    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices())
    }
    // Timeout fallback — resolve after 2s even if voices don't load
    setTimeout(() => resolve([]), 2000)
  })
}

export function getPreferredVoice() {
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null

  // Priority order — best quality voices for an anchor/news delivery style
  const preferredNames = [
    'Google UK English Male',
    'Microsoft George - English (United Kingdom)',
    'Microsoft David - English (United States)',
    'Microsoft Mark - English (United States)',
    'Google US English',
    'Alex',                        // macOS built-in
    'Daniel',                      // macOS UK English
  ]

  for (const name of preferredNames) {
    const match = voices.find(v => v.name === name)
    if (match) return match
  }

  // Fallback: any English male voice, then any English voice
  return (
    voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male')) ||
    voices.find(v => v.lang.startsWith('en')) ||
    voices[0]
  )
}

export function speak(text, onStart, onEnd) {
  // Cancel any ongoing speech before starting new
  window.speechSynthesis.cancel()

  if (!text || text.trim().length === 0) {
    onEnd?.()
    return null
  }

  const utterance = new SpeechSynthesisUtterance(text)
  const voice = getPreferredVoice()
  if (voice) utterance.voice = voice

  utterance.rate   = 0.92   // Slightly slower than default = authoritative anchor feel
  utterance.pitch  = 1.0
  utterance.volume = 1.0
  utterance.lang   = 'en-IN' // Indian English

  utterance.onstart = () => onStart?.()
  utterance.onend   = () => onEnd?.()
  utterance.onerror = () => onEnd?.() // Treat error as end — never hang the timer

  window.speechSynthesis.speak(utterance)
  return utterance
}

export function stopSpeaking() {
  window.speechSynthesis.cancel()
}
