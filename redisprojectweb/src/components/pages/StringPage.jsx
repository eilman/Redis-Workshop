import { useState } from 'react';
import { VscSymbolString } from 'react-icons/vsc';
import { stringApi } from '../../api/redisApi';
import InputField from '../common/InputField';
import ActionButton from '../common/ActionButton';
import ResultDisplay from '../common/ResultDisplay';
import CommandLog from '../common/CommandLog';
import TheorySection from '../common/TheorySection';

function StringPage() {
  const [key, setKey] = useState('mykey');
  const [value, setValue] = useState('hello');
  const [appendValue, setAppendValue] = useState(' world');
  const [currentValue, setCurrentValue] = useState(null);
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

  const handleSet = async () => {
    try {
      const res = await stringApi.set(key, value);
      addCommand(res.data);
      setCurrentValue(value);
    } catch (err) {
      handleError(err);
    }
  };

  const handleGet = async () => {
    try {
      const res = await stringApi.get(key);
      addCommand(res.data);
      setCurrentValue(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  const handleDel = async () => {
    try {
      const res = await stringApi.del(key);
      addCommand(res.data);
      setCurrentValue(null);
    } catch (err) {
      handleError(err);
    }
  };

  const handleIncr = async () => {
    try {
      const res = await stringApi.increment(key);
      addCommand(res.data);
      setCurrentValue(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  const handleAppend = async () => {
    try {
      const res = await stringApi.append(key, appendValue);
      addCommand(res.data);
      // Fetch the current value after append
      try {
        const getRes = await stringApi.get(key);
        setCurrentValue(getRes.data.result);
      } catch {
        // ignore secondary fetch error
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <VscSymbolString className="icon" />
          Strings
        </h1>
      </div>

      <TheorySection title="Redis Strings - Temel Kavramlar">
        <p>
          String, Redis&apos;in <strong>en temel veri yapısı</strong>dır. Metin, sayı, JSON ve hatta binary veri saklayabilir (max 512MB).
          Redis&apos;teki her key aslında bir string&apos;tir. En sık kullanım alanları: cache&apos;leme,
          sayaçlar (INCR ile sayfa görüntülenme, beğeni sayısı), session token&apos;ları ve geçici veri saklama.
        </p>
        <h4>String'in Saklayabildiği Tipler</h4>
        {/* Görsel: Tip kutuları */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16,
        }}>
          {[
            { label: 'String', color: 'var(--accent-blue)', ex: '"Portal"' },
            { label: 'Integer', color: 'var(--accent-green)', ex: '42' },
            { label: 'Float', color: 'var(--accent-orange)', ex: '9.99' },
            { label: 'JSON', color: '#9B59B6', ex: '{"k":"v"}' },
            { label: 'Binary', color: 'var(--redis-red)', ex: '0xFF..' },
          ].map((t) => (
            <div key={t.label} style={{
              flex: '1 1 100px', minWidth: 100, textAlign: 'center',
              background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
              border: `2px solid ${t.color}`, padding: '10px 6px',
            }}>
              <div style={{ fontWeight: 700, color: t.color, fontSize: '0.85rem' }}>{t.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{t.ex}</div>
            </div>
          ))}
        </div>
        <h4>Özellikler</h4>
        <ul>
          <li><strong>Binary-safe:</strong> JPEG görsel, serialized object, plain text gibi her türlü veri saklanabilir</li>
          <li><strong>Atomik operasyonlar:</strong> <code>INCR</code> / <code>DECR</code> komutlari atomiktir, race condition oluşturmaz</li>
          <li>Counter, cache, session token gibi senaryolarda yaygın kullanılır</li>
        </ul>

        {/* INCR Atomik Sayaç Diyagramı */}
        <h4>INCR Atomikliği — Race Condition Yok</h4>
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
          padding: 16, marginBottom: 16, overflowX: 'auto',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 12, minWidth: 420, fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
          }}>
            {/* Client A */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Client A</div>
              <div style={{
                background: 'rgba(0,212,255,0.15)', border: '2px solid var(--accent-blue)',
                borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontWeight: 700, color: 'var(--accent-blue)',
              }}>
                INCR counter
              </div>
            </div>
            {/* Client B */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Client B</div>
              <div style={{
                background: 'rgba(155,89,182,0.15)', border: '2px solid #9B59B6',
                borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontWeight: 700, color: '#9B59B6',
              }}>
                INCR counter
              </div>
            </div>
            {/* Ok */}
            <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>&rarr;</div>
            {/* Redis */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Redis (Sıralı)</div>
              <div style={{
                background: 'rgba(231,76,60,0.15)', border: '2px solid var(--redis-red)',
                borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontWeight: 700, color: 'var(--redis-red)',
              }}>
                10 &rarr; 11 &rarr; 12
              </div>
            </div>
            {/* Ok */}
            <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>&rarr;</div>
            {/* Sonuç */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Sonuç</div>
              <div style={{
                background: 'rgba(0,255,136,0.15)', border: '2px solid var(--accent-green)',
                borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontWeight: 700, color: 'var(--accent-green)',
              }}>
                12 ✓
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Her iki istemci aynı anda INCR çağırsa bile Redis sırayla işler — race condition oluşmaz
          </div>
        </div>
        <h4>Temel Komutlar</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Açıklama</th><th>Örnek</th></tr>
          </thead>
          <tbody>
            <tr><td><code>SET</code></td><td>Değer ata</td><td><code>SET mykey "hello"</code></td></tr>
            <tr><td><code>GET</code></td><td>Değer oku</td><td><code>GET mykey</code></td></tr>
            <tr><td><code>DEL</code></td><td>Key sil</td><td><code>DEL mykey</code></td></tr>
            <tr><td><code>INCR</code></td><td>Değeri 1 artır (atomik)</td><td><code>INCR counter</code></td></tr>
            <tr><td><code>APPEND</code></td><td>Mevcut değere ekle</td><td><code>APPEND mykey " world"</code></td></tr>
          </tbody>
        </table>
        <h4>Gerçek Hayat Örnekleri</h4>
        <div className="feature-grid" style={{ marginBottom: 16 }}>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>👁️</div>
            <div className="feature-title">Sayfa Görüntülenme</div>
            <div className="feature-desc">Her sayfa ziyaretinde <code>INCR page:views:anasayfa</code> ile sayaç artırılır. Milyonlarca eşzamanlı kullanıcıda bile doğru sayar.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🔑</div>
            <div className="feature-title">SMS Doğrulama Kodu</div>
            <div className="feature-desc"><code>SET verify:5551234 &quot;482910&quot; EX 120</code> — kod 2 dakika sonra otomatik silinir, kullanıcı süreyi geçirirse yeni kod ister.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>📦</div>
            <div className="feature-title">API Yanıt Cache</div>
            <div className="feature-desc">Dış API&apos;den gelen hava durumu verisini <code>SET weather:istanbul &quot;json&quot; EX 600</code> ile 10 dk cache&apos;le. Her istekte API&apos;ye gitmek yerine Redis&apos;ten oku.</div>
          </div>
        </div>
        <div className="tip-box">
          <strong>İpucu:</strong> INCR komutu atomik olduğu için, birden fazla istemci aynı anda sayacı artırsa bile doğru sonuç alınır. Ayrı bir lock mekanizmasına gerek yoktur.
        </div>
      </TheorySection>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">
          <VscSymbolString className="icon" />
          String Operations
        </div>

        <div className="form-row">
          <InputField label="Key" value={key} onChange={setKey} placeholder="Enter key name" />
          <InputField label="Value" value={value} onChange={setValue} placeholder="Enter value" />
        </div>

        <div className="button-group" style={{ marginBottom: 16 }}>
          <ActionButton variant="primary" onClick={handleSet}>SET</ActionButton>
          <ActionButton variant="info" onClick={handleGet}>GET</ActionButton>
          <ActionButton variant="danger" onClick={handleDel}>DEL</ActionButton>
          <ActionButton variant="warning" onClick={handleIncr}>INCR</ActionButton>
        </div>

        <div className="form-row">
          <InputField label="Append Value" value={appendValue} onChange={setAppendValue} placeholder="Value to append" />
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <ActionButton variant="success" onClick={handleAppend}>APPEND</ActionButton>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {currentValue !== null && (
          <ResultDisplay title="Current Value" value={currentValue} />
        )}
      </div>

      <CommandLog commands={commands} onClear={() => setCommands([])} />

      {/* Soru-Cevap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Soru & Cevap</div>
        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Bir e-ticaret sitesinde ürün beğeni sayısını tutmak istiyorsun. Neden veritabanı yerine Redis String (INCR) tercih edersin?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Beğeni butonu saniyede yüzlerce kez tıklanabilir. Veritabanında her tıklamada <code>UPDATE products SET likes = likes + 1</code> yapmak
            disk I/O gerektirir ve yavaştır. Redis&apos;te <code>INCR</code> RAM üzerinde çalışır, atomiktir ve mikrosaniye sürer.
            Ayrıca race condition riski yoktur — iki kullanıcı aynı anda beğense bile sayaç doğru artar.
          </div>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            SET key value EX 120 ile saklanan bir SMS doğrulama kodu, 120 saniye dolmadan kullanıcı doğru kodu girerse ne yapmalısın?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Doğrulama başarılı olduktan sonra <code>DEL verify:5551234</code> ile kodu hemen silmelisin.
            Aksi halde aynı kod 120 saniye boyunca geçerli kalır ve başka biri ele geçirirse kullanabilir.
            Tek kullanımlık (one-time) kodlarda doğrulama sonrası silmek güvenlik açısından kritiktir.
          </div>
        </details>
      </div>
    </div>
  );
}

export default StringPage;
