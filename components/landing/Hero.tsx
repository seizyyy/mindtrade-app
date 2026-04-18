
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
        <div className="animate-fade-in hero-right-hide" style={{ paddingLeft: '6%' }}>
          <div className="animate-float" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,.3),0 24px 64px rgba(0,0,0,.4)' }}>
            <div style={{ height: 44, background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
              {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 900, color: '#f1f5f9', marginLeft: 8 }}>MindTrade</span>
            </div>
            <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ gridColumn: '1/-1', background: 'linear-gradient(135deg,var(--navy),var(--navy2))', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Score mental · aujourd'hui</div>
                  <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 52, color: '#fff', lineHeight: 1, fontWeight: 700 }}>82</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,.15)', border: '1px solid rgba(245,158,11,.25)', borderRadius: 12, padding: '4px 10px', marginTop: 6 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b' }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#f59e0b' }}>État optimal</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>vs hier</div>
                  <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, color: 'rgba(255,255,255,.9)' }}>+14 pts</div>
                </div>
              </div>
              <div style={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {[{label:'Win rate',val:'68%',color:'#22c55e',sub:null},{label:'P&L net',val:'+620€',color:'#22c55e',sub:'68% win'},{label:'Streak',val:'14j',color:'#60a5fa',sub:null}].map(m => (
                  <div key={m.label} style={{ background: '#1e293b', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{m.label}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                      <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 18, fontWeight: 700, color: m.color }}>{m.val}</div>
                      {m.sub && <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(34,197,94,.6)', background: 'rgba(34,197,94,.1)', borderRadius: 4, padding: '1px 5px' }}>{m.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.18)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>⚠ Signal mental</div>
                {[{name:'FOMO',pct:68,color:'#ef4444'},{name:'Revenge',pct:35,color:'#f59e0b'},{name:'Discipline',pct:85,color:'#22c55e'}].map(b => (
                  <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)', width: 70, flexShrink: 0 }}>{b.name}</div>
                    <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${b.pct}%`, height: 3, background: b.color, borderRadius: 2 }} />
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: b.color }}>{b.pct}%</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#1e293b', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Check-ins · 4 semaines</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
                  {CI_PATTERN.map((s, i) => (
                    <div key={i} style={{ aspectRatio: '1', borderRadius: 2, background: s === 'ok' ? 'rgba(34,197,94,.25)' : s === 'miss' ? 'rgba(239,68,68,.2)' : s === 'now' ? '#3b82f6' : 'rgba(255,255,255,.05)' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: 'rgba(255,255,255,.3)' }}>
                  <span>89% de complétion</span>
                  <span style={{ color: '#22c55e', fontWeight: 700 }}>Streak 14j ↑</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
