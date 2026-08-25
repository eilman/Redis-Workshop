import { useState, useEffect, useRef } from 'react';
import { TbClock } from 'react-icons/tb';
import { ttlApi, stringApi } from '../../api/redisApi';
import InputField from '../common/InputField';
import ActionButton from '../common/ActionButton';
import CommandLog from '../common/CommandLog';
import TheorySection from '../common/TheorySection';

function TtlPage() {
  const [key, setKey] = useState('temp:session');
  const [value, setValue] = useState('session-data-xyz');
  const [ttlSeconds, setTtlSeconds] = useState('30');
  const [expireSeconds, setExpireSeconds] = useState('60');
  const [remaining, setRemaining] = useState(null);
  const [originalTtl, setOriginalTtl] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [currentValue, setCurrentValue] = useState(null);
  const [commands, setCommands] = useState([]);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const addCommand = (data) => {
    setCommands((prev) => [...prev, data]);
    setError(null);
  };

  const handleError = (err) => {
    const msg = err.response?.data?.result || err.message;
    setError(msg);
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startPolling = (initialTtl) => {
    // Stop any existing polling
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPolling(true);
    setOriginalTtl(initialTtl);

    intervalRef.current = setInterval(async () => {
      try {
        const res = await ttlApi.remaining(key);
        const ttl = res.data.result;
        if (ttl === null || ttl === undefined || ttl <= -2) {
          // Key expired or doesn't exist
          setRemaining(-2);
          setCurrentValue(null);
          setIsPolling(false);
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        } else {
          setRemaining(Number(ttl));
          if (Number(ttl) <= 0 && Number(ttl) !== -1) {
            setIsPolling(false);
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch {
        setIsPolling(false);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 1000);
  };

  const handleSetWithTtl = async () => {
    if (!key.trim()) return;
    try {
      const res = await ttlApi.setWithTtl(key, value, Number(ttlSeconds));
      addCommand(res.data);
      setCurrentValue(value);
      setRemaining(Number(ttlSeconds));
      startPolling(Number(ttlSeconds));
    } catch (err) {
      handleError(err);
    }
  };

  const handleCheckRemaining = async () => {
    if (!key.trim()) return;
    try {
      const res = await ttlApi.remaining(key);
      addCommand(res.data);
      setRemaining(Number(res.data.result));
    } catch (err) {
      handleError(err);
    }
  };

  const handleExpire = async () => {
    if (!key.trim()) return;
    try {
      const res = await ttlApi.expire(key, Number(expireSeconds));
      addCommand(res.data);
      setRemaining(Number(expireSeconds));
      startPolling(Number(expireSeconds));
    } catch (err) {
      handleError(err);
    }
  };

  const handlePersist = async () => {
    if (!key.trim()) return;
    try {
      const res = await ttlApi.persist(key);
      addCommand(res.data);
      setRemaining(-1);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPolling(false);
    } catch (err) {
      handleError(err);
    }
  };

  const handleGetValue = async () => {
    if (!key.trim()) return;
    try {
      const res = await stringApi.get(key);
      addCommand(res.data);
      setCurrentValue(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  // Calculate progress bar values
  const getProgressPercent = () => {
    if (remaining === null || remaining === -1) return 100;
    if (remaining <= -2) return 0;
    if (!originalTtl || originalTtl <= 0) return 100;
    return Math.max(0, (remaining / originalTtl) * 100);
  };

  const getProgressColor = () => {
    const pct = getProgressPercent();
    if (pct > 60) return 'var(--accent-green)';
    if (pct > 30) return 'var(--accent-orange)';
    return 'var(--redis-red)';
  };

  const getTtlDisplay = () => {
    if (remaining === null) return 'Unknown';
    if (remaining === -1) return 'No expiry (persistent)';
    if (remaining <= -2) return 'Key expired or does not exist';
    return `${remaining} seconds remaining`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <TbClock className="icon" />
          TTL / Expiry
        </h1>
      </div>

      <TheorySection title="TTL (Time To Live) - Temel Kavramlar">
        <p>
          TTL (Time To Live), bir key&apos;in belirli bir süre sonra <strong>otomatik olarak silinmesini</strong> sağlar.
          Redis&apos;te her key&apos;e saniye veya milisaniye cinsinden bir ömür verilebilir.
          Süre dolduğunda key otomatik silinir — manuel temizlemeye gerek kalmaz.
          Cache süresi, session timeout, geçici token&apos;lar ve rate limiting penceresi gibi
          zamana dayalı tüm senaryolarda kritik bir mekanizmadır.
        </p>
        <h4>TTL Nasıl Çalışır?</h4>
        {/* Lazy vs Active Expiration Karşılaştırma Kartları */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{
            flex: '1 1 220px', background: 'rgba(255,184,0,0.1)', border: '2px solid var(--accent-orange)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-orange)', fontSize: '0.95rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.2rem' }}>🐢</span> Lazy Expiration
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-orange)',
              background: 'var(--bg-input)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', marginBottom: 8, textAlign: 'center',
            }}>
              GET key &rarr; Süre dolmuş mu? &rarr; Sil
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Key&apos;e <strong>erişildiğinde</strong> kontrol edilir. Pasif yaklaşım — erişilmeyen key&apos;ler bellekte kalabilir.
            </div>
          </div>
          <div style={{
            flex: '1 1 220px', background: 'rgba(0,212,255,0.1)', border: '2px solid var(--accent-blue)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.95rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span> Active Expiration
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-blue)',
              background: 'var(--bg-input)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', marginBottom: 8, textAlign: 'center',
            }}>
              10 Hz &rarr; Rastgele 20 key &rarr; Süresi dolanları sil
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Redis <strong>periyodik olarak</strong> (saniyede 10 kez) rastgele key&apos;leri kontrol eder. Aktif temizlik sağlar.
            </div>
          </div>
        </div>
        <div className="tip-box" style={{ marginBottom: 12 }}>
          <strong>Not:</strong> Bu iki mekanizma birlikte çalışarak süresi dolan key&apos;lerin zamanında temizlenmesini sağlar.
        </div>
        <h4>Önemli Kavramlar</h4>
        <ul>
          <li><strong>Cache Jitter:</strong> Tüm key'lere aynı TTL vermek yerine rastgele bir sapma ekleyin. Böylece <em>thundering herd</em> (aynı anda toplu cache miss) problemini önlersiniz</li>
          <li><strong>PERSIST:</strong> Bir key'in TTL'sini kaldırıp kalıcı yapmak için kullanılır</li>
          <li><strong>Sliding TTL:</strong> Her erişimde TTL'yi yeniden ayarlayarak aktif key'lerin silinmesini önleyin</li>
        </ul>
        <h4>Temel Komutlar</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Açıklama</th></tr>
          </thead>
          <tbody>
            <tr><td><code>SET key val EX 30</code></td><td>Değer + TTL birlikte atanır. Süreyi değiştirmek istersen değeri tekrar yazman gerekir</td></tr>
            <tr><td><code>TTL key</code></td><td>Kalan süreyi öğren (-1: kalıcı, -2: yok)</td></tr>
            <tr><td><code>EXPIRE key 60</code></td><td>Değere dokunmadan sadece süreyi günceller. Session uzatma gibi durumlarda idealdir</td></tr>
            <tr><td><code>PERSIST key</code></td><td>TTL'yi kaldır, key kalıcı olsun</td></tr>
          </tbody>
        </table>
        <h4>Cache vs Persist Ayrımı</h4>
        <p>
          Redis'te key'leri iki kategoriye ayırmak iyi bir pratiktir: <strong>cache (geçici)</strong> ve <strong>persist (kalıcı)</strong> veriler.
        </p>
        {/* Görsel: Cache vs Persist karşılaştırması */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{
            flex: '1 1 200px', background: 'rgba(255,184,0,0.1)', border: '2px solid var(--accent-orange)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-orange)', fontSize: '0.95rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.2rem' }}>⏳</span> Cache (Geçici)
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-blue)', marginBottom: 6 }}>cache:user:123</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <li>TTL var (örn. 1 saat)</li>
              <li>Kaybolursa DB'den tekrar çekilir</li>
            </ul>
          </div>
          <div style={{
            flex: '1 1 200px', background: 'rgba(0,212,255,0.1)', border: '2px solid var(--accent-blue)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.95rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.2rem' }}>💾</span> Persist (Kalıcı)
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-blue)', marginBottom: 6 }}>data:user:123</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <li>TTL yok veya çok uzun</li>
              <li>Kaybolursa veri kaybolur!</li>
            </ul>
          </div>
        </div>

        <h4>E-Ticaret Cache Örneği</h4>
        <div className="tip-box" style={{marginBottom: 12}}>
          <strong>Senaryo: &quot;En Çok Satan Ürünler&quot;</strong>
          <p style={{marginTop: 6, marginBottom: 8}}>
            Bu sorguyu her seferinde veritabanından çekmek pahalıdır. Redis ile önbelleğe alınır:
          </p>
          <code style={{ display: 'block', marginBottom: 10 }}>SET cache:top-products &quot;[...]&quot; EX 300</code>
          <p style={{ margin: 0 }}>
            İstek gelince önce Redis kontrol edilir.
            Varsa (<strong style={{ color: 'var(--accent-green)' }}>cache hit</strong>) anında döner.
            Yoksa (<strong style={{ color: 'var(--accent-orange)' }}>cache miss</strong>) DB&apos;den çekilir ve Redis&apos;e yazılır.
          </p>
        </div>

        <h4>Cache Mantığı</h4>
        {/* Görsel: Cache akış diyagramı */}
        <div className="step-flow">
          <div className="step-flow-item">
            <div className="step-flow-number">1</div>
            <div className="step-flow-content">
              <strong>Redis'e Bak (RAM)</strong>
              <p><code>GET cache:top-products</code></p>
            </div>
          </div>
          <div className="step-flow-item success">
            <div className="step-flow-number">2a</div>
            <div className="step-flow-content">
              <strong>HIT &rarr; Anında Döndür</strong>
              <p>Veri RAM'de bulundu, mikrosaniyede döner.</p>
            </div>
          </div>
          <div className="step-flow-item info">
            <div className="step-flow-number">2b</div>
            <div className="step-flow-content">
              <strong>MISS &rarr; DB'den Çek &rarr; Redis'e Yaz &rarr; Döndür</strong>
              <p>Veri bulunamadı. DB sorgusu yapılır, sonuç Redis'e cache'lenir.</p>
            </div>
          </div>
        </div>

        <div className="warning-box">
          <strong>Dikkat:</strong> TTL -1 dönerse key kalıcıdır (expiry yok). TTL -2 dönerse key mevcut değildir veya süresi dolmuştur.
        </div>
      </TheorySection>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">
          <TbClock className="icon" />
          Set Key with TTL
        </div>

        <div className="form-row">
          <InputField label="Key" value={key} onChange={setKey} placeholder="Key name" />
          <InputField label="Value" value={value} onChange={setValue} placeholder="Value" />
          <InputField label="TTL (seconds)" value={ttlSeconds} onChange={setTtlSeconds} placeholder="30" type="number" />
        </div>

        <div className="button-group" style={{ marginBottom: 16 }}>
          <ActionButton variant="primary" onClick={handleSetWithTtl}>SET with TTL</ActionButton>
          <ActionButton variant="info" onClick={handleCheckRemaining}>CHECK TTL</ActionButton>
          <ActionButton variant="success" onClick={handleGetValue}>GET Value</ActionButton>
        </div>

        <div className="form-row">
          <InputField label="Yeni süre (saniye)" value={expireSeconds} onChange={setExpireSeconds} placeholder="60" type="number" />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <ActionButton variant="warning" onClick={handleExpire}>EXPIRE (Süreyi Güncelle)</ActionButton>
            <ActionButton variant="danger" onClick={handlePersist}>PERSIST (Süreyi Kaldır)</ActionButton>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">TTL Countdown</div>

        <div style={{ marginBottom: 12 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {getTtlDisplay()}
            </span>
            {isPolling && (
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--accent-green)',
                animation: 'pulse 1s infinite',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Live
              </span>
            )}
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${getProgressPercent()}%`,
                backgroundColor: getProgressColor(),
              }}
            >
              {remaining !== null && remaining > 0 && `${remaining}s`}
            </div>
          </div>
        </div>

        {currentValue !== null && (
          <div className="result-display" style={{ marginTop: 12 }}>
            <div className="result-display-title">Current Value</div>
            <span className="result-display-value">{String(currentValue)}</span>
          </div>
        )}

        {remaining !== null && remaining <= -2 && (
          <div style={{
            textAlign: 'center',
            padding: 16,
            color: 'var(--redis-red)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '1.1rem',
          }}>
            KEY EXPIRED
          </div>
        )}
      </div>

      <CommandLog commands={commands} onClear={() => setCommands([])} />

      {/* Soru-Cevap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Soru & Cevap</div>
        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Bir kampanya kodu 24 saat geçerli olacak. Bu süreyi nasıl yönetirsin?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Kampanya kodunu Redis&apos;e kaydederken TTL (yaşam süresi) olarak 86400 saniye (24 saat) verirsin.
            Süre dolduğunda Redis bu kodu otomatik olarak siler — uygulamanın ayrıca &quot;süre doldu mu?&quot; diye kontrol etmesine gerek kalmaz.
            Bu sayede süresi geçmiş kodlar sistemde kalmaz ve güvenlik riski oluşturmaz.
          </div>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Bir verinin süresi dolduğunda ne olur? Uygulama bundan haberdar olur mu?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Süre dolduğunda Redis o veriyi otomatik siler. Uygulama o veriyi okumaya çalıştığında &quot;yok&quot; yanıtı alır.
            Varsayılan olarak uygulama bilgilendirilmez — ama Redis&apos;in &quot;keyspace notification&quot; özelliği ile
            &quot;şu verinin süresi doldu&quot; bildirimi almak mümkündür. Çoğu senaryoda ise veri yoksa yeniden oluşturmak yeterlidir.
          </div>
        </details>
      </div>
    </div>
  );
}

export default TtlPage;
