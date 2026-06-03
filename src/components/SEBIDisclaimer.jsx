export default function SEBIDisclaimer() {
  return (
    <footer style={{ padding: '12px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
      <div className="sebi-disclaimer" style={{ maxWidth: 1440, margin: '0 auto' }}>
        ⚠️ <strong>SEBI Compliance Notice:</strong> OpportunityRadar provides analytical signals for informational purposes only. This is NOT investment advice. Past signal performance does not guarantee future results. Data delay: NSE OHLCV 15 min, BSE Bulk Deals EOD. Consult a SEBI-registered advisor before investing.
      </div>
    </footer>
  )
}
