import { useState, useEffect } from 'react';
import { TbUser, TbLogin, TbLogout, TbLock } from 'react-icons/tb';
import { sessionApi, lockApi } from '../../api/redisApi';
import InputField from '../common/InputField';
import ActionButton from '../common/ActionButton';
import CommandLog from '../common/CommandLog';
import TheorySection from '../common/TheorySection';

function SessionPage() {
  const [username, setUsername] = useState('alice');
  const [currentSession, setCurrentSession] = useState(null);
  const [attrKey, setAttrKey] = useState('theme');
  const [attrValue, setAttrValue] = useState('dark');
  const [inspectData, setInspectData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lockKey, setLockKey] = useState('resource:payment');
  const [lockOwner, setLockOwner] = useState('worker-1');
  const [lockOwner2, setLockOwner2] = useState('worker-2');
  const [lockTimeout, setLockTimeout] = useState('30');
  const [lockStatus, setLockStatus] = useState(null);
  const [commands, setCommands] = useState([]);
  const [error, setError] = useState(null);

  const addCommand = (data) => {
    setCommands((prev) => [...prev, data]);
    setError(null);
  };

  const handleError = (err) => {
    const msg = err.response?.data?.result || err.message;
    setError(msg);
  };

  const checkSession = async () => {
    try {
      const res = await sessionApi.me();
      addCommand(res.data);
      if (res.data.result && res.data.result !== 'null' && res.data.result !== 'No active session') {
        setCurrentSession(res.data.result);
        setIsLoggedIn(true);
      } else {
        setCurrentSession(null);
        setIsLoggedIn(false);
      }
    } catch {
      setCurrentSession(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    if (!username.trim()) return;
    try {
      const res = await sessionApi.login(username);
      addCommand(res.data);
      setIsLoggedIn(true);
      await checkSession();
    } catch (err) {
      handleError(err);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await sessionApi.logout();
      addCommand(res.data);
      setCurrentSession(null);
      setIsLoggedIn(false);
      setInspectData(null);
    } catch (err) {
      handleError(err);
    }
  };

  const handleSetAttribute = async () => {
    if (!attrKey.trim()) return;
    try {
      const res = await sessionApi.setAttribute(attrKey, attrValue);
      addCommand(res.data);
      await checkSession();
    } catch (err) {
      handleError(err);
    }
  };

  const handleInspect = async () => {
    try {
      const res = await sessionApi.inspect();
      addCommand(res.data);
      setInspectData(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  // Parse session data for display
  const sessionEntries = (() => {
    if (!currentSession) return [];
    if (typeof currentSession === 'object' && !Array.isArray(currentSession)) {
      return Object.entries(currentSession);
    }
    if (typeof currentSession === 'string') {
      try {
        const parsed = JSON.parse(currentSession);
        if (typeof parsed === 'object') return Object.entries(parsed);
      } catch {
        // not JSON
      }
      return [['session', currentSession]];
    }
    return [['session', String(currentSession)]];
  })();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <TbUser className="icon" />
          Sessions
        </h1>
      </div>

      <TheorySection title="Session Yönetimi - Temel Kavramlar">
        <p>
          Session (oturum), kullanıcının kim olduğunu ve durumunu sunucu tarafında tutan bir mekanizmadır.
          Login olduğunda oluşur, logout olduğunda veya süresi dolduğunda silinir.
          Redis ile session merkezi bir yerde saklanır — böylece birden fazla sunucu aynı session verisine erişebilir
          ve kullanıcı hangi sunucuya yönlenirse yönlensin oturumu korunur.
        </p>
        <h4>Distributed Session Problemi</h4>
        <p>
          Geleneksel uygulamalarda session verisi sunucunun belleğinde (RAM) saklanır.
          Tek sunucu varken sorun yoktur, ancak trafik arttığında birden fazla sunucu çalıştırılır
          ve önlerine bir <strong>Load Balancer</strong> konur. Load Balancer, gelen istekleri sunucular
          arasında dağıtır — bu yüzden aynı kullanıcı farklı isteklerde farklı sunuculara yönlenebilir.
          Kullanıcı Server A&apos;da login olduysa session Server A&apos;nın belleğindedir;
          bir sonraki isteği Server B&apos;ye giderse orada session yoktur ve kullanıcı &quot;çıkış yapmış&quot; gibi görünür.
          Buna karşı <strong>Sticky Session</strong> denen bir yöntem vardır — Load Balancer aynı kullanıcıyı hep aynı
          sunucuya yönlendirir. Ama bu iyi bir çözüm değildir: o sunucu çökerse session kaybolur,
          yük dengesiz dağılır ve ölçeklendirmeyi zorlaştırır.
          Redis ile bu sorun kökten çözülür: session merkezi bir yerde tutulur, tüm sunucular aynı Redis&apos;e bağlanır,
          hangi sunucuya gidersen git aynı session verisine erişirsin.
        </p>

        {/* Problem → Çözüm Akış Diyagramı */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {/* Problem */}
          <div style={{
            flex: '1 1 220px', background: 'rgba(231,76,60,0.1)', border: '2px solid var(--redis-red)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--redis-red)', fontSize: '0.95rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.2rem' }}>❌</span> Problem
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
            }}>
              <div style={{ color: 'var(--text-secondary)' }}>Kullanıcı &rarr; Server A (session var)</div>
              <div style={{ color: 'var(--redis-red)', fontWeight: 700 }}>&darr; Load Balancer yönlendirdi</div>
              <div style={{ color: 'var(--text-secondary)' }}>Kullanıcı &rarr; Server B (session YOK!)</div>
            </div>
          </div>
          {/* Çözüm */}
          <div style={{
            flex: '1 1 220px', background: 'rgba(0,255,136,0.1)', border: '2px solid var(--accent-green)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.95rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.2rem' }}>✅</span> Çözüm: Redis
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
            }}>
              <div style={{ color: 'var(--text-secondary)' }}>Server A &rarr; Redis (session yaz)</div>
              <div style={{ color: 'var(--accent-green)', fontWeight: 700 }}>&darr; Merkezi store</div>
              <div style={{ color: 'var(--text-secondary)' }}>Server B &rarr; Redis (session oku ✓)</div>
            </div>
          </div>
        </div>

        <h4>Spring Session + Redis Entegrasyonu</h4>
        <ul>
          <li>Spring Session, <code>HttpSession</code> API&apos;sini olduğu gibi kullanmanı sağlar — kod değişikliği gerekmez. Arka planda session verisi Redis&apos;e <strong>hash</strong> olarak yazılır</li>
          <li>Tüm uygulama instance&apos;ları aynı Redis&apos;e bağlanır. Kullanıcı hangi sunucuya düşerse düşsün, session verisi Redis&apos;ten okunur</li>
          <li><strong>Horizontal scaling:</strong> Yeni sunucu eklediğinde ekstra bir ayar gerekmez — Redis&apos;e bağlandığı anda session&apos;lara erişebilir</li>
          <li><strong>Otomatik temizlik:</strong> Redis TTL (Time To Live) ile süresi dolan session&apos;lar otomatik silinir. Kullanıcı 30 dakika işlem yapmazsa session kendiliğinden ölür</li>
        </ul>
        <h4>Avantajlar</h4>
        <div className="feature-grid" style={{ marginBottom: 16 }}>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🛡️</div>
            <div className="feature-title">Dayanıklılık</div>
            <div className="feature-desc">Sunucu çökse bile session kaybolmaz — veri Redis&apos;te durur, kullanıcı başka sunucudan devam eder.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>⚖️</div>
            <div className="feature-title">Sticky Session Yok</div>
            <div className="feature-desc">Load Balancer kullanıcıyı hep aynı sunucuya yönlendirmek zorunda kalmaz. İstekler sunucular arasında eşit dağılır.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>⚡</div>
            <div className="feature-title">Hızlı Erişim</div>
            <div className="feature-desc">Session verisine ~0.1ms&apos;de erişim. RAM tabanlı, disk yok.</div>
          </div>
        </div>
        <div className="tip-box">
          <strong>İpucu:</strong> Session TTL&apos;sini uygulamanızın ihtiyacına göre ayarlayın. Tipik web uygulamalarında 30 dakika, hassas uygulamalarda 5-10 dakika uygundur.
        </div>

        <h4>Bu Örnek Ne Gösteriyor?</h4>
        <p>
          Bu demo, <strong>Spring Session&apos;ın arka planda Redis&apos;i nasıl kullandığını</strong> adım adım gösterir.
          Normal bir <code>HttpSession</code> kullanıyormuş gibi login olur, attribute ekler ve logout olursun —
          ancak arka planda tüm bu veriler Redis&apos;e yazılır.
        </p>
        <ul>
          <li><strong>Login:</strong> Session oluşur ve Redis&apos;e hash olarak yazılır</li>
          <li><strong>Set Attribute:</strong> Session&apos;a eklediğin her veri (tema, dil, sepet vb.) Redis&apos;teki hash&apos;e yeni bir field olarak eklenir</li>
          <li><strong>Inspect Session:</strong> Redis&apos;te session için oluşturulan ham anahtarları ve TTL (kalan ömür) değerini görürsün. Her istek attığında TTL sıfırlanır — kullanıcı aktif oldukça session yaşar</li>
          <li><strong>Logout:</strong> Session invalidate edilir ve Redis&apos;teki tüm session anahtarları silinir</li>
        </ul>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Not: Bu demo tek sunucuda çalıştığı için distributed session farkını doğrudan hissedemezsin.
          Gerçek senaryoda birden fazla sunucu aynı Redis&apos;e bağlanır ve kullanıcı hangi sunucuya düşerse düşsün
          aynı session verisine erişir.
        </p>
      </TheorySection>

      <div className="two-columns" style={{ marginBottom: 16 }}>
        <div>
          {/* Login Section */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title">
              <TbLogin className="icon" />
              {isLoggedIn ? 'Session Active' : 'Login'}
            </div>

            {!isLoggedIn ? (
              <>
                <div className="form-row">
                  <InputField label="Username" value={username} onChange={setUsername} placeholder="Enter username" />
                </div>
                <ActionButton variant="primary" onClick={handleLogin}>Login</ActionButton>
              </>
            ) : (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--accent-green)',
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'var(--redis-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'white',
                  }}>
                    {(username || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {username}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>
                      Session Active
                    </div>
                  </div>
                </div>

                <div className="button-group">
                  <ActionButton variant="danger" onClick={handleLogout}>
                    <TbLogout /> Logout
                  </ActionButton>
                  <ActionButton variant="info" onClick={checkSession}>Refresh</ActionButton>
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
          </div>

          {/* Session Attributes */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title">Session Attributes</div>

            <div className="form-row">
              <InputField label="Attribute Key" value={attrKey} onChange={setAttrKey} placeholder="e.g. theme" />
              <InputField label="Attribute Value" value={attrValue} onChange={setAttrValue} placeholder="e.g. dark" />
            </div>

            <div className="button-group">
              <ActionButton
                variant="success"
                onClick={handleSetAttribute}
                disabled={!isLoggedIn}
              >
                Set Attribute
              </ActionButton>
              <ActionButton variant="info" onClick={handleInspect}>
                Inspect Session
              </ActionButton>
            </div>
          </div>
        </div>

        <div>
          {/* Current Session Display */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title">Current Session Data</div>

            {sessionEntries.length === 0 ? (
              <div className="empty-state">
                {isLoggedIn ? 'Loading session data...' : 'No active session. Please login first.'}
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionEntries.map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ color: 'var(--accent-blue)' }}>{k}</td>
                      <td>
                        {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Session Inspector */}
          <div className="card">
            <div className="card-title">Session Inspector (Raw Redis Data)</div>

            {inspectData === null ? (
              <div className="empty-state">
                Click "Inspect Session" to see raw Redis session data.
              </div>
            ) : (
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-input)',
                padding: 14,
                borderRadius: 'var(--radius-sm)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                maxHeight: 300,
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
              }}>
                {typeof inspectData === 'object'
                  ? JSON.stringify(inspectData, null, 2)
                  : String(inspectData)}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Distributed Lock Section */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">
          <TbLock className="icon" />
          Distributed Lock (Redlock)
        </div>

        <div style={{ marginBottom: 16 }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: 8 }}>Neden Distributed Lock?</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            Birden fazla sunucu aynı kaynağa (örn. ödeme işlemi, stok güncelleme) aynı anda eriştiğinde
            {' '}<strong>race condition</strong> oluşur — iki sunucu aynı ürünü aynı anda satabilir veya aynı parayı iki kez çekebilir.
            Distributed Lock, bir kaynağı aynı anda sadece bir sunucunun kullanmasını garanti eder.
            Redis&apos;te <code>SET key value NX EX timeout</code> komutuyla çalışır:
            {' '}<strong>NX</strong> sayesinde key zaten varsa set edilmez (lock alınamaz),
            {' '}<strong>EX</strong> ile timeout süresi verilir — lock&apos;ı alan sunucu çökerse bile lock otomatik serbest kalır.
          </p>

          {/* Lock Diyagramı */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{
              flex: '1 1 200px', background: 'rgba(231,76,60,0.1)', border: '2px solid var(--redis-red)',
              borderRadius: 'var(--radius-sm)', padding: 14,
            }}>
              <div style={{ fontWeight: 700, color: 'var(--redis-red)', fontSize: '0.95rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '1.2rem' }}>❌</span> Lock Olmadan
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.8,
              }}>
                Instance A → Stoktan düş (stok=1)<br />
                Instance B → Stoktan düş (stok=1)<br />
                → İkisi de sattı ama stok 1&apos;di! CONFLICT!
              </div>
            </div>
            <div style={{
              flex: '1 1 200px', background: 'rgba(0,255,136,0.1)', border: '2px solid var(--accent-green)',
              borderRadius: 'var(--radius-sm)', padding: 14,
            }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.95rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span> Lock ile
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.8,
              }}>
                Instance A → Lock al ✓ → Stoktan düş → Lock bırak<br />
                Instance B → Lock al ✗ → Bekle... → Stok 0, satış iptal<br />
                → Sıralı erişim, veri tutarlı!
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
            padding: 12, marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
            color: 'var(--accent-blue)',
          }}>
            <strong>Pattern:</strong> SET lockKey ownerValue NX EX timeout<br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
              NX = sadece key yoksa set et | EX = timeout süresi (saniye) | Owner = kimin kilitlediği
            </span>
          </div>
        </div>

        <div className="form-row" style={{ marginBottom: 12 }}>
          <InputField label="Lock Key (ortak kaynak)" value={lockKey} onChange={setLockKey} placeholder="resource:payment" />
          <InputField label="Timeout (s)" value={lockTimeout} onChange={setLockTimeout} placeholder="30" type="number" />
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          {/* Worker 1 */}
          <div style={{
            flex: '1 1 220px', border: '2px solid var(--accent-blue)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.95rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              Worker 1
            </div>
            <InputField label="Owner" value={lockOwner} onChange={setLockOwner} placeholder="worker-1" />
            <div className="button-group" style={{ marginTop: 8 }}>
              <ActionButton variant="primary" onClick={async () => {
                try {
                  const res = await lockApi.acquire(lockKey, lockOwner, Number(lockTimeout));
                  addCommand(res.data);
                  setLockStatus(res.data.result);
                } catch (err) { handleError(err); }
              }}>Acquire</ActionButton>
              <ActionButton variant="danger" onClick={async () => {
                try {
                  const res = await lockApi.release(lockKey, lockOwner);
                  addCommand(res.data);
                  setLockStatus(res.data.result);
                } catch (err) { handleError(err); }
              }}>Release</ActionButton>
            </div>
          </div>

          {/* Worker 2 */}
          <div style={{
            flex: '1 1 220px', border: '2px solid var(--accent-orange)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-orange)', fontSize: '0.95rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              Worker 2
            </div>
            <InputField label="Owner" value={lockOwner2} onChange={setLockOwner2} placeholder="worker-2" />
            <div className="button-group" style={{ marginTop: 8 }}>
              <ActionButton variant="primary" onClick={async () => {
                try {
                  const res = await lockApi.acquire(lockKey, lockOwner2, Number(lockTimeout));
                  addCommand(res.data);
                  setLockStatus(res.data.result);
                } catch (err) { handleError(err); }
              }}>Acquire</ActionButton>
              <ActionButton variant="danger" onClick={async () => {
                try {
                  const res = await lockApi.release(lockKey, lockOwner2);
                  addCommand(res.data);
                  setLockStatus(res.data.result);
                } catch (err) { handleError(err); }
              }}>Release</ActionButton>
            </div>
          </div>
        </div>

        <ActionButton variant="info" onClick={async () => {
          try {
            const res = await lockApi.status(lockKey);
            addCommand(res.data);
            setLockStatus(res.data.result);
          } catch (err) { handleError(err); }
        }}>Check Status</ActionButton>

        {lockStatus && (
          <div className="result-display fade-in" style={{ marginTop: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
            }}>
              <span style={{
                padding: '4px 14px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.9rem',
                backgroundColor: lockStatus.locked ? 'rgba(231,76,60,0.15)' : 'rgba(0,255,136,0.15)',
                color: lockStatus.locked ? 'var(--redis-red)' : 'var(--accent-green)',
                border: `1px solid ${lockStatus.locked ? 'var(--redis-red)' : 'var(--accent-green)'}`,
              }}>
                {lockStatus.locked ? 'LOCKED' : 'UNLOCKED'}
              </span>
              {lockStatus.owner && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Owner: {lockStatus.owner}
                </span>
              )}
              {lockStatus.remainingTtlSeconds != null && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent-orange)' }}>
                  TTL: {lockStatus.remainingTtlSeconds}s
                </span>
              )}
            </div>
            <pre style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
              color: 'var(--text-secondary)', backgroundColor: 'var(--bg-input)',
              padding: 12, borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-wrap',
            }}>
              {JSON.stringify(lockStatus, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <CommandLog commands={commands} onClear={() => setCommands([])} />

      {/* Soru-Cevap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Soru & Cevap</div>
        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Kullanıcı giriş yaptıktan sonra tarayıcıyı kapatıp tekrar açsa oturumu devam eder mi?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Session bilgisi Redis&apos;te tutulduğu için sunucu tarafında durmaya devam eder. Ama tarayıcıdaki çerez (cookie)
            &quot;session cookie&quot; ise tarayıcı kapandığında silinir ve kullanıcı yeniden giriş yapmalıdır.
            Eğer çerezin de bir süresi (expire) varsa, tarayıcı kapansa bile süre dolana kadar oturum devam edebilir.
          </div>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            3 farklı sunucu var ve kullanıcı her istekte farklı sunucuya yönlendiriliyor. Oturumu kaybolur mu?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Session bilgisi sunucunun kendi belleğinde tutuluyorsa evet, kaybolur — çünkü diğer sunucu o oturumu tanımaz.
            Ama session Redis&apos;te tutuluyorsa kaybolmaz. Her sunucu aynı Redis&apos;e baktığı için hangi sunucuya giderse gitsin
            kullanıcının oturumu devam eder. Redis tabanlı session yönetiminin en büyük avantajı budur.
          </div>
        </details>
      </div>
    </div>
  );
}

export default SessionPage;
