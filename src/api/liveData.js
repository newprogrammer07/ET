export async function getNiftyLive() {
  try {
    const resp = await fetch('/api/market/indices', { signal: AbortSignal.timeout(15000) })
    if (!resp.ok) throw new Error(`Market API returned status ${resp.status}`)
    const data = await resp.json()
    
    console.log('[LiveData] Fetched real market indices from backend')
    
    return {
      value: data.nifty.value,
      change: data.nifty.change,
      pctChange: data.nifty.pctChange,
      open: data.nifty.open,
      high: data.nifty.high,
      low: data.nifty.low,
      sensex: data.sensex.value,
      sensexChange: data.sensex.change,
      sensexPct: data.sensex.pctChange,
    }
  } catch (error) {
    console.warn("Falling back to Nifty 50 mock data due to API failure:", error)
    return {
      value: 22847.45,
      change: 124.30,
      pctChange: 0.55,
      open: 22750.10,
      high: 22865.20,
      low: 22720.50,
      sensex: 75210,
      sensexChange: 350,
      sensexPct: 0.47,
    }
  }
}
