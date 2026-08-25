import { useState } from 'react';
import { TbShieldLock } from 'react-icons/tb';
import { rateLimitApi } from '../../api/redisApi';
import InputField from '../common/InputField';
import ActionButton from '../common/ActionButton';
import CommandLog from '../common/CommandLog';
import TheorySection from '../common/TheorySection';

function RateLimitPage() {
  const [clientId, setClientId] = useState('user:1');
  const [window, setWindow] = useState('60');
  const [limit, setLimit] = useState('10');
  const [status, setStatus] = useState(null);
  const [requestHistory, setRequestHistory] = useState([]);
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

  const handleSendRequest = async () => {
    try {
      const res = await rateLimitApi.request(clientId, Number(window), Number(limit));
      addCommand(res.data);
      setStatus(res.data.result);
      setRequestHistory((prev) => [
        {
          ...res.data.result,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ].slice(0, 30));
    } catch (err) {
      handleError(err);
    }
  };

  const handleCheckStatus = async () => {
    try {
      const res = await rateLimitApi.status(clientId, Number(window), Number(limit));
      addCommand(res.data);
      setStatus(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  const handleReset = async () => {
    try {
      const res = await rateLimitApi.reset(clientId);
      addCommand(res.data);
      setStatus(null);
      setRequestHistory([]);
    } catch (err) {
      handleError(err);
    }
  };

  const usedPercent = status ? Math.min(100, (status.currentCount / status.limit) * 100) : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <TbShieldLock className="icon" />
          Rate Limiting
        </h1>
      </div>

      <TheorySection title="Rate Limiting - Temel Kavramlar">
        <h4>Rate Limiting Nedir?</h4>
        <p>
          Rate Limiting, bir kullanıcının veya IP&apos;nin belirli bir süre içinde yapabileceği istek sayısını sınırlar.
          API&apos;leri kötüye kullanıma, brute-force saldırılarına ve aşırı yüklenmeye karşı korur.
          Redis&apos;in Sorted Set yapısı ile sliding window (kayan pencere) yöntemi uygulanır —
          her istek timestamp&apos;iyle kaydedilir ve zaman penceresi dışına çıkan istekler otomatik temizlenir.
          Örneğin: <strong>1 dakikada max 5 login denemesi</strong>.
        </p>
        <ul>
          <li><strong>Sunucu koruma:</strong> Aşırı yükten ve DDoS'tan koruma</li>
          <li><strong>API abuse engelleme:</strong> Kötüye kullanımı sınırlama</li>
          <li><strong>Brute-force zorlaştırma:</strong> Şifre deneme saldırılarını yavaşlatma</li>
          <li><strong>Kaynak yönetimi:</strong> Adil kullanım politikası uygulama</li>
        </ul>

        <h4>Neden Redis?</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Özellik</th><th>Neden Önemli?</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>RAM tabanlı hız</strong></td><td>Her istekte sayaç kontrolü mikrosaniyede tamamlanır, latency eklemez</td></tr>
            <tr><td><strong>Atomic işlemler</strong></td><td>INCR komutu race condition olmadan güvenli sayaç artırır</td></tr>
            <tr><td><strong>TTL desteği</strong></td><td>EXPIRE ile pencere sonunda sayaç otomatik sıfırlanır</td></tr>
            <tr><td><strong>Distributed</strong></td><td>Birden fazla sunucu aynı Redis'i kullanarak ortak sayaç tutar</td></tr>
          </tbody>
        </table>

        <h4>Redis ile Nasıl Çalışır?</h4>
        <p>Her kullanıcı/IP için bir key tutulur (ör. <code>rate:192.168.1.10</code>):</p>
        <ul>
          <li><code>INCR</code> → sayaç artırılır</li>
          <li>İlk istekte <code>EXPIRE</code> → TTL (ör. 60 sn) verilir</li>
          <li>Key 60 saniye sonra otomatik silinir → sayaç sıfırlanır</li>
          <li>Limit aşılırsa → <strong>HTTP 429 Too Many Requests</strong></li>
        </ul>

        <h4>Algoritmalar</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🔲</div>
            <div className="feature-title">Fixed Window</div>
            <div className="feature-desc">
              Sabit zaman dilimleri (ör. her dakika) içinde sayaç tutulur. <code>INCR</code> + <code>EXPIRE</code> ile. <strong>En basit yöntem.</strong>
              <br /><span style={{ color: 'var(--redis-red)' }}>Dezavantaj:</span> Pencere sınırında burst olabilir — 59. saniyede 10 + 61. saniyede 10 = 2 saniyede 20 istek geçebilir.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🪟</div>
            <div className="feature-title">Sliding Window</div>
            <div className="feature-desc">
              Son X saniyedeki tüm istekler Sorted Set&apos;te timestamp ile saklanır. Pencere dışındakiler temizlenir.
              <strong> En hassas yöntem</strong>, burst&apos;a izin vermez.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🪣</div>
            <div className="feature-title">Token Bucket</div>
            <div className="feature-desc">
              Kullanıcıya belirli hızda token eklenir, her istek 1 token harcar. Token yoksa istek reddedilir.
              <strong> Kontrollü burst&apos;a izin verir</strong> — en yaygın ve esnek yöntemlerden biri.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🚰</div>
            <div className="feature-title">Leaky Bucket</div>
            <div className="feature-desc">
              İstekler bir kovaya dolar, sabit hızda dışarı &quot;akar&quot;. Trafiği yumuşatır, çıkış hızı sabittir.
              <strong> Burst&apos;ı tamamen engeller</strong> — stabil throughput sağlar.
            </div>
          </div>
        </div>

        <h4>Algoritma Karşılaştırması</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Algoritma</th><th>Burst</th><th>Hassasiyet</th><th>Karmaşıklık</th><th>Kullanım</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Fixed Window</strong></td><td>Sınırda burst riski</td><td>Düşük</td><td>Çok basit</td><td>Basit API limitleri</td></tr>
            <tr><td><strong>Sliding Window</strong></td><td>Yok</td><td>Yüksek</td><td>Orta</td><td>Hassas rate limiting</td></tr>
            <tr><td><strong>Token Bucket</strong></td><td>Kontrollü izin</td><td>Yüksek</td><td>Orta</td><td>API gateway, CDN</td></tr>
            <tr><td><strong>Leaky Bucket</strong></td><td>Yok</td><td>Yüksek</td><td>Orta</td><td>Trafik şekillendirme, sabit çıkış</td></tr>
          </tbody>
        </table>

        <h4>Sliding Window Çalışma Prensibi</h4>
        <div className="step-flow">
          <div className="step-flow-item">
            <div className="step-flow-number">1</div>
            <div className="step-flow-content">
              <strong>ZREMRANGEBYSCORE</strong>
              <p>Pencere dışındaki eski istekleri Sorted Set&apos;ten temizle</p>
            </div>
          </div>
          <div className="step-flow-item info">
            <div className="step-flow-number">2</div>
            <div className="step-flow-content">
              <strong>ZCARD</strong>
              <p>Pencere içindeki mevcut istek sayısını say</p>
            </div>
          </div>
          <div className="step-flow-item success">
            <div className="step-flow-number">3</div>
            <div className="step-flow-content">
              <strong>ZADD (limit aşılmadıysa)</strong>
              <p>Yeni isteği timestamp ile Sorted Set&apos;e ekle</p>
            </div>
          </div>
          <div className="step-flow-item">
            <div className="step-flow-number">4</div>
            <div className="step-flow-content">
              <strong>EXPIRE</strong>
              <p>Key&apos;e TTL ayarla (pencere süresi kadar)</p>
            </div>
          </div>
        </div>

        {/* Sliding Window Diyagramı */}
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
          padding: 16, marginBottom: 16, overflowX: 'auto',
        }}>
          <div style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.85rem', marginBottom: 12 }}>
            Sliding Window — Zaman Çizgisi
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 4, fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
          }}>
            {['t-70s', 't-55s', 't-40s', 't-30s', 't-15s', 't-5s', 'now'].map((t, i) => {
              const inWindow = i >= 2; // last 60s window starts at t-60s
              return (
                <div key={t} style={{
                  padding: '6px 8px', textAlign: 'center',
                  background: inWindow ? 'rgba(0,255,136,0.15)' : 'rgba(231,76,60,0.1)',
                  border: `1px solid ${inWindow ? 'var(--accent-green)' : 'var(--redis-red)'}`,
                  borderRadius: 'var(--radius-sm)',
                  color: inWindow ? 'var(--accent-green)' : 'var(--redis-red)',
                  fontWeight: 600,
                }}>
                  <div>{t}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {inWindow ? 'sayılır' : 'silinir'}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            ← Pencere dışı (temizlenir) | Pencere içi (sayılır) →
          </div>
        </div>

        <div className="tip-box">
          <strong>İpucu:</strong> Redis Sorted Set, timestamp&apos;i score olarak kullanarak doğal bir sliding window sağlar.
          <code>ZREMRANGEBYSCORE</code> + <code>ZCARD</code> + <code>ZADD</code> ile verimli şekilde çalışır.
        </div>

        <h4>Rate Limiting Tek Başına Yetmez!</h4>
        <p>Gerçek sistemlerde rate limiting ilk savunma hattıdır, ancak tek başına yeterli değildir. Ek güvenlik katmanları:</p>
        <table className="theory-table">
          <thead>
            <tr><th>Katman</th><th>Açıklama</th><th>Ne Zaman?</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Account Lock</strong></td><td>N başarısız denemede hesap geçici kilitlenir</td><td>Brute-force şifre saldırısı</td></tr>
            <tr><td><strong>CAPTCHA</strong></td><td>Bot/insan ayrımı yapar</td><td>Otomatik istek şüphesi</td></tr>
            <tr><td><strong>IP Ban</strong></td><td>Sürekli saldıran IP tamamen engellenir</td><td>Agresif/tekrarlayan saldırı</td></tr>
            <tr><td><strong>Exponential Backoff</strong></td><td>Her başarısız denemede bekleme süresi katlanır (1s → 2s → 4s → 8s...)</td><td>Tekrarlayan hatalı istekler</td></tr>
            <tr><td><strong>MFA</strong></td><td>Şifre + ikinci doğrulama (SMS, Auth app)</td><td>Hassas işlemler, login</td></tr>
          </tbody>
        </table>

        <h4>Gerçek Sistem Yaklaşımı</h4>
        <p>Bu katmanlar genellikle birlikte, sıralı olarak uygulanır:</p>
        <div className="step-flow">
          <div className="step-flow-item">
            <div className="step-flow-number">1</div>
            <div className="step-flow-content">
              <strong>Redis Rate Limit</strong>
              <p>İlk filtre — istek sayısını sınırla. Aşılırsa HTTP 429.</p>
            </div>
          </div>
          <div className="step-flow-item info">
            <div className="step-flow-number">2</div>
            <div className="step-flow-content">
              <strong>Account Lock</strong>
              <p>N başarısız login → hesabı geçici kilitle (ör. 15 dk).</p>
            </div>
          </div>
          <div className="step-flow-item">
            <div className="step-flow-number">3</div>
            <div className="step-flow-content">
              <strong>CAPTCHA</strong>
              <p>Şüpheli aktivite tespit edilirse bot kontrolü uygula.</p>
            </div>
          </div>
          <div className="step-flow-item success">
            <div className="step-flow-number">4</div>
            <div className="step-flow-content">
              <strong>MFA + IP Ban</strong>
              <p>Kimlik doğrulama güvenliği + agresif saldırganları kalıcı engelle.</p>
            </div>
          </div>
        </div>
        <div className="tip-box">
          <strong>Özet:</strong> Rate limiting tek başına bir güvenlik çözümü değildir. Redis rate limit ilk filtre olarak çalışır, ardından Account Lock, CAPTCHA, MFA ve IP Ban katmanları ile birlikte kullanılır.
        </div>
      </TheorySection>

      {error && <div className="error-message">{error}</div>}

      <div className="two-columns" style={{ marginBottom: 16 }}>
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title">
              <TbShieldLock className="icon" />
              Rate Limiter
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 14px 0', lineHeight: 1.6 }}>
              Sliding Window Log algoritmasını deneyelim: bir client ID için zaman penceresi ve limit belirleyelim,
              ardından &quot;Send Request&quot; ile istekler gönderelim. Limit aşıldığında isteklerin reddedildiğini gözlemleyelim.
              Sliding window olduğu için sabit bir sıfırlanma anı yoktur — en eski istekler pencere dışına çıktıkça
              yeni isteklere otomatik olarak yer açılır.
            </p>
            <div className="form-row">
              <InputField label="Client ID" value={clientId} onChange={setClientId} placeholder="user:1" />
            </div>
            <div className="form-row">
              <InputField label="Window (seconds)" value={window} onChange={setWindow} placeholder="60" type="number" />
              <InputField label="Limit (max requests)" value={limit} onChange={setLimit} placeholder="10" type="number" />
            </div>
            <div className="button-group" style={{ marginBottom: 12 }}>
              <ActionButton variant="primary" onClick={handleSendRequest}>Send Request</ActionButton>
              <ActionButton variant="info" onClick={handleCheckStatus}>Check Status</ActionButton>
              <ActionButton variant="danger" onClick={handleReset}>Reset</ActionButton>
            </div>

            {status && (
              <div className="result-display fade-in">
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
                }}>
                  <span style={{
                    padding: '4px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    backgroundColor: status.allowed !== false ? 'rgba(0,255,136,0.15)' : 'rgba(231,76,60,0.15)',
                    color: status.allowed !== false ? 'var(--accent-green)' : 'var(--redis-red)',
                    border: `1px solid ${status.allowed !== false ? 'var(--accent-green)' : 'var(--redis-red)'}`,
                  }}>
                    {status.allowed !== false ? 'ALLOWED' : 'DENIED'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {status.currentCount}/{status.limit}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{
                    fontSize: '0.75rem', color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4,
                  }}>
                    Quota Usage
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${usedPercent}%`,
                        backgroundColor: usedPercent >= 100 ? 'var(--redis-red)' : usedPercent >= 80 ? 'var(--accent-orange)' : 'var(--accent-green)',
                      }}
                    >
                      {status.remaining} remaining
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Request History */}
          <div className="card">
            <div className="card-title">Request History</div>
            {requestHistory.length === 0 ? (
              <div className="empty-state">No requests yet. Click &quot;Send Request&quot; to start.</div>
            ) : (
              <div style={{ maxHeight: 250, overflowY: 'auto' }}>
                {requestHistory.map((entry, index) => (
                  <div key={index} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '6px 10px', borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.8rem', fontFamily: 'var(--font-mono)',
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{entry.clientId}</span>
                    <span style={{
                      color: entry.allowed ? 'var(--accent-green)' : 'var(--redis-red)',
                      fontWeight: 600,
                    }}>
                      {entry.allowed ? 'ALLOWED' : 'DENIED'}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {entry.currentCount}/{entry.limit}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      {entry.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Rate Limit Status</div>
          {!status ? (
            <div className="empty-state">Send a request or check status to see rate limit info.</div>
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--text-primary)' }}>
                    {status.currentCount}
                  </div>
                  <div className="stat-label">Current Count</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>
                    {status.limit}
                  </div>
                  <div className="stat-label">Limit</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{
                    color: status.remaining > 0 ? 'var(--accent-green)' : 'var(--redis-red)',
                  }}>
                    {status.remaining}
                  </div>
                  <div className="stat-label">Remaining</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--text-secondary)' }}>
                    {status.windowSeconds}s
                  </div>
                  <div className="stat-label">Window</div>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{
                  fontSize: '0.75rem', color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
                }}>
                  Raw Data
                </div>
                <pre style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                  color: 'var(--text-secondary)', backgroundColor: 'var(--bg-input)',
                  padding: 12, borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-wrap',
                }}>
                  {JSON.stringify(status, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      </div>

      <CommandLog commands={commands} onClear={() => setCommands([])} />

      {/* Soru-Cevap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Soru & Cevap</div>
        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Black Friday&apos;de bir e-ticaret sitesine normaldeki trafiğin 50 katı geliyor. Rate limiting olmazsa ne olur, olursa gerçek müşteriler de engellenir mi?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Rate limiting olmazsa botlar stok tükenmeden binlerce satın alma isteği gönderir, sunucu çöker ve gerçek müşteriler siteye bile giremez.
            Ama limit çok sıkı tutulursa bu sefer gerçek müşteriler de &quot;çok fazla istek&quot; hatası alır ve alışveriş yapamaz.
            İşte burada denge kritiktir: limiti çok düşük tutarsan müşteri kaybedersin, çok yüksek tutarsan koruma işe yaramaz.
            İyi bir rate limiting stratejisi botları engellerken gerçek kullanıcıları etkilememelidir.
          </div>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Twitter (X) neden kullanıcılara günlük tweet okuma limiti koydu? Bu karar arkasındaki teknik sebep ne olabilir?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Botlar ve veri kazıyıcılar (scraper) sürekli içerik çekerek sunuculara aşırı yük bindiriyordu.
            Günlük okuma limiti koyarak hem bot trafiğini engellemiş oldular hem de sunucu maliyetlerini kontrol altına aldılar.
            Bu tıpkı bir büfede &quot;kişi başı 3 tabak&quot; kuralı koymak gibidir — kaynakların herkes tarafından adil kullanılmasını sağlar.
          </div>
        </details>
      </div>
    </div>
  );
}

export default RateLimitPage;
