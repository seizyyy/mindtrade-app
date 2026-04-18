
const CI_PATTERN = ['ok','ok','miss','ok','ok','off','off','ok','ok','ok','ok','miss','off','off','ok','ok','ok','ok','miss','off','off','ok','ok','ok','ok','now'];

const ciColor: Record<string, string> = {
  ok: 'rgba(22,101,52,.2)',
  miss: 'rgba(155,28,28,.15)',
  off: 'rgba(12,12,10,.05)',
  now: 'var(--navy)',
};

export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh', padding: '157px 5% 80px',
      display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      <div style={{ position: 'absolute', top: -200, right: -100, width: 600, height: 600, background: 'radial-gradient(circle,rgba(15,39,68,.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, background: 'radial-gradient(circle,rgba(184,134,11,.05) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 60, alignItems: 'center' }}>
        {/* LEFT */}
        <div>
          <div className="animate-fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: '6px 14px', marginBottom: 28 }}>
            <div className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--g)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink2)', letterSpacing: '.03em' }}>Score mental · 10 min/jour · Résultats mesurables</span>
          </div>

          <h1 className="animate-fade-up" style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(42px,5vw,68px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-.02em', marginBottom: 24, color: 'var(--ink)' }}>
            Ils t'expliquent<br />
            <span style={{ position: 'relative', color: 'var(--ink3)' }}>
              pourquoi tu as perdu.
              <span style={{ position: 'absolute', left: 0, top: '50%', width: '100%', height: 2, background: 'var(--r)', transform: 'rotate(-2deg)', display: 'block' }} />
            </span><br />
            MindTrade <em style={{ fontStyle: 'italic', color: 'var(--navy)' }}>t'évite</em><br />
            de perdre.
          </h1>

          <p className="animate-fade-up-2" style={{ fontSize: 17, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            Les autres journaux analysent tes trades <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>après coup</strong>. MindTrade intervient <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>avant l'ouverture des charts</strong> — score mental, signal mental, confluences — pour que tu ne prennes plus de mauvaises décisions dans un mauvais état.
          </p>

          <div className="animate-fade-up-3" style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <a href="#acces" style={{ background: 'var(--ink)', color: '#fff', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-outfit)' }}>
              Démarrer maintenant →
            </a>
            <a href="#produit" style={{ color: 'var(--ink2)', padding: '14px 20px', fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font-outfit)' }}>
              Voir le produit →
            </a>
          </div>

          <div className="animate-fade-up-4" style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex' }}>
              {['TM','JL','AR','PK','+'].map((init, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--bg)', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', marginLeft: i === 0 ? 0 : -8 }}>
                  {init}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink2)' }}>
              <strong style={{ color: 'var(--ink)' }}>312 traders</strong> l'utilisent déjà · Remboursé 14j si pas convaincu
            </div>
          </div>
        </div>

        {/* RIGHT — Dashboard Preview */}
        <div className="animate-fade-in hero-right-hide" style={{ paddingLeft: '2%' }}>
          <div className="animate-float" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,.4),0 32px 80px rgba(0,0,0,.5)' }}>

            {/* Chrome bar */}
            <div style={{ height: 36, background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 6 }}>
              {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: .8 }} />)}
              <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 4, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 180, margin: '0 auto' }}>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,.25)' }}>mindtrade.co/dashboard</span>
              </div>
            </div>

            {/* App layout */}
            <div style={{ display: 'flex', height: 420 }}>

              {/* Sidebar */}
              <div style={{ width: 130, background: '#1e293b', borderRight: '1px solid rgba(255,255,255,.07)', padding: '10px 6px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-.3px', padding: '2px 6px', marginBottom: 10 }}>MindTrade</div>
                {['Vue d\'ensemble','Check-in','Log de trades','Rapport hebdo','Journal'].map((label, i) => (
                  <div key={label} style={{ padding: '6px 8px', borderRadius: 5, background: i === 0 ? 'rgba(255,255,255,.08)' : 'transparent', border: `1px solid ${i === 0 ? 'rgba(255,255,255,.1)' : 'transparent'}`, color: i === 0 ? '#f1f5f9' : 'rgba(255,255,255,.35)', fontSize: 10, fontWeight: i === 0 ? 600 : 400, marginBottom: 1 }}>
                    {label}
                  </div>
                ))}
                <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '10px' }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>Score mental</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#22c55e', lineHeight: 1 }}>82</div>
                  <div style={{ fontSize: 9, color: '#22c55e', marginTop: 1, fontWeight: 600 }}>Optimal</div>
                  <div style={{ height: 2, background: 'rgba(255,255,255,.08)', borderRadius: 1, marginTop: 6 }}>
                    <div style={{ height: '100%', width: '82%', background: '#22c55e', borderRadius: 1 }} />
                  </div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>🔥 14j de streak</div>
                </div>
              </div>

              {/* Main */}
              <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>

                {/* Signal */}
                <div style={{ background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === 0 ? '#22c55e' : 'rgba(255,255,255,.1)' }} />)}
                  </div>
                  <div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 2 }}>Signal de session</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>État mental optimal</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 1 }}>Bonne condition pour opérer. Applique ton plan.</div>
                  </div>
                </div>

                {/* 4 métriques */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                  {[
                    { label: 'Score mental', val: '82', color: '#22c55e' },
                    { label: 'Win rate',     val: '80%', color: '#22c55e' },
                    { label: 'P&L net',      val: '+2 916€', color: '#22c55e' },
                    { label: 'Profit factor',val: '9.38', color: '#22c55e' },
                  ].map(m => (
                    <div key={m.label} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,.07)', borderRadius: 7, padding: '10px 10px' }}>
                      <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>{m.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: m.color, lineHeight: 1, fontFamily: 'Georgia, serif' }}>{m.val}</div>
                    </div>
                  ))}
                </div>

                {/* Graphique + trades */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 6, flex: 1 }}>
                  <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,.07)', borderRadius: 7, padding: '10px 12px' }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Score mental — 7 jours</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 56 }}>
                      {[{d:'DI',s:60,c:'#f59e0b'},{d:'LU',s:100,c:'#22c55e'},{d:'MA',s:84,c:'#22c55e'},{d:'ME',s:40,c:'#ef4444'},{d:'JE',s:76,c:'#22c55e'},{d:'VE',s:92,c:'#22c55e'},{d:'SA',s:82,c:'#22c55e'}].map(b => (
                        <div key={b.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                          <div style={{ width: '100%', height: `${b.s * 0.52}px`, background: b.c, borderRadius: '2px 2px 0 0', opacity: .85 }} />
                          <div style={{ fontSize: 7, color: 'rgba(255,255,255,.25)' }}>{b.d}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,.07)', borderRadius: 7, padding: '10px 12px' }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Derniers trades</div>
                    {[
                      { pair: 'NAS100',  pnl: '+896€',  color: '#22c55e' },
                      { pair: 'GBP/USD', pnl: '+544€',  color: '#22c55e' },
                      { pair: 'US30',    pnl: '-348€',  color: '#ef4444' },
                      { pair: 'EUR/USD', pnl: '+704€',  color: '#22c55e' },
                    ].map(t => (
                      <div key={t.pair} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                        <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,.6)' }}>{t.pair}</div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: t.color }}>{t.pnl}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
