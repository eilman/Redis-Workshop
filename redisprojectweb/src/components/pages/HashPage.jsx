import { useState } from 'react';
import { TbHash } from 'react-icons/tb';
import { hashApi } from '../../api/redisApi';
import InputField from '../common/InputField';
import ActionButton from '../common/ActionButton';
import CommandLog from '../common/CommandLog';
import TheorySection from '../common/TheorySection';

function HashPage() {
  const [key, setKey] = useState('user:1001');
  const [field, setField] = useState('name');
  const [value, setValue] = useState('Alice');
  const [incrValue, setIncrValue] = useState('1');
  const [hashData, setHashData] = useState({});
  const [singleValue, setSingleValue] = useState(null);
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

  const handleHset = async () => {
    if (!key.trim() || !field.trim()) return;
    try {
      const res = await hashApi.set(key, field, value);
      addCommand(res.data);
      // Refresh hash data
      await handleHgetAll();
    } catch (err) {
      handleError(err);
    }
  };

  const handleHget = async () => {
    if (!key.trim() || !field.trim()) return;
    try {
      const res = await hashApi.get(key, field);
      addCommand(res.data);
      setSingleValue({ field, value: res.data.result });
    } catch (err) {
      handleError(err);
    }
  };

  const handleHgetAll = async () => {
    if (!key.trim()) return;
    try {
      const res = await hashApi.getAll(key);
      addCommand(res.data);
      const result = res.data.result;
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        setHashData(result);
      } else {
        setHashData({});
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleHdel = async () => {
    if (!key.trim() || !field.trim()) return;
    try {
      const res = await hashApi.del(key, field);
      addCommand(res.data);
      await handleHgetAll();
    } catch (err) {
      handleError(err);
    }
  };

  const handleHincrby = async () => {
    if (!key.trim() || !field.trim()) return;
    try {
      const res = await hashApi.increment(key, field, Number(incrValue) || 1);
      addCommand(res.data);
      await handleHgetAll();
    } catch (err) {
      handleError(err);
    }
  };

  const hashEntries = Object.entries(hashData);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <TbHash className="icon" />
          Hashes
        </h1>
      </div>

      <TheorySection title="Redis Hashes - Temel Kavramlar">
        <p>
          Hash, field-value çiftlerinden oluşan bir yapıdır — <strong>bir nesneyi (object) saklamak için ideal</strong>dir.
          Tıpkı JavaScript&apos;teki obje veya Java&apos;daki Map gibi düşünebilirsin.
          Örneğin bir kullanıcının adı, e-postası ve yaşı tek bir key altında ayrı field&apos;lar olarak tutulabilir.
          Tek bir field&apos;ı okumak veya güncellemek için tüm veriyi çekmeye gerek yoktur.
          Kullanıcı profilleri, ürün bilgileri ve konfigürasyon ayarları gibi yapılandırılmış veriler için kullanılır.
        </p>
        {/* Görsel: Hash nesne diyagramı */}
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
          padding: 16, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Key kutusu */}
            <div style={{
              textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Redis Key</div>
              <div style={{
                background: 'rgba(0,212,255,0.15)', border: '2px solid var(--accent-blue)',
                borderRadius: 'var(--radius-sm)', padding: '10px 16px',
                fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-blue)',
              }}>
                user:1001
              </div>
            </div>
            {/* Ok */}
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '1.4rem', paddingTop: 18 }}>&rarr;</div>
            {/* Field-Value tablosu */}
            <div style={{
              border: '2px solid var(--accent-green)', borderRadius: 'var(--radius-sm)',
              overflow: 'hidden', minWidth: 200,
            }}>
              <div style={{
                background: 'rgba(0,255,136,0.15)', padding: '6px 12px',
                fontWeight: 700, fontSize: '0.75rem', color: 'var(--accent-green)',
                textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center',
              }}>
                Hash Fields
              </div>
              {[
                { f: 'name', v: 'Portal' },
                { f: 'email', v: 'ekin@mail.com' },
                { f: 'age', v: '25' },
              ].map((row, i) => (
                <div key={row.f} style={{
                  display: 'flex', borderTop: i > 0 ? '1px solid var(--border-color)' : 'none',
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                }}>
                  <div style={{ padding: '6px 10px', color: 'var(--accent-blue)', fontWeight: 600, width: 70, borderRight: '1px solid var(--border-color)' }}>{row.f}</div>
                  <div style={{ padding: '6px 10px', color: 'var(--text-primary)' }}>{row.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h4>Hash Yapısı: Key / Field / Value</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Kavram</th><th>Açıklama</th><th>Örnek</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Key</strong></td><td>Hash'in adı (Redis key)</td><td><code>user:1001</code></td></tr>
            <tr><td><strong>Field</strong></td><td>Hash içindeki alan adı</td><td><code>name</code>, <code>email</code>, <code>age</code></td></tr>
            <tr><td><strong>Value</strong></td><td>Field'a karşılık gelen değer</td><td><code>"Portal"</code>, <code>"ekin@mail.com"</code></td></tr>
          </tbody>
        </table>
        <h4>Örnek: user:1001</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Field</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr><td><code>name</code></td><td>Portal</td></tr>
            <tr><td><code>email</code></td><td>ekin@mail.com</td></tr>
            <tr><td><code>age</code></td><td>25</td></tr>
          </tbody>
        </table>
        <h4>Bellek Optimizasyonu</h4>
        <ul>
          <li>Küçük hash'ler otomatik olarak <strong>ziplist encoding</strong> kullanır (daha az bellek)</li>
          <li>Büyük hash'lerde <code>HGETALL</code> yerine tekil <code>HGET</code> tercih edilmelidir</li>
          <li><strong>Hem daha az bellek harcar hem de ilgili verileri mantıksal olarak gruplar</strong> — ayrı key'lerde saklamaktansa Hash kullanmak çok daha verimlidir</li>
        </ul>
        <h4>Kullanım Alanları</h4>
        <div className="feature-grid" style={{ marginBottom: 16 }}>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>👤</div>
            <div className="feature-title">Kullanıcı Profili</div>
            <div className="feature-desc">
              <code>user:1001</code> &rarr; name, email, age gibi field-value çiftleri ile profil bilgisi sakla.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>📦</div>
            <div className="feature-title">Ürün Detayı</div>
            <div className="feature-desc">
              <code>product:5001</code> &rarr; title, price, stock gibi ürün bilgilerini tek hash'te tut.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>⚙️</div>
            <div className="feature-title">Konfigürasyon</div>
            <div className="feature-desc">
              Uygulama ayarlarını hash olarak saklayarak kolay güncelleme ve okuma sağla.
            </div>
          </div>
        </div>
        <h4>Temel Komutlar</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Açıklama</th></tr>
          </thead>
          <tbody>
            <tr><td><code>HSET</code></td><td>Bir field'a değer ata</td></tr>
            <tr><td><code>HGET</code></td><td>Tek bir field'in değerini oku</td></tr>
            <tr><td><code>HGETALL</code></td><td>Tüm field-value çiftlerini getir</td></tr>
            <tr><td><code>HDEL</code></td><td>Bir field'i sil</td></tr>
            <tr><td><code>HINCRBY</code></td><td>Sayısal field'i atomik artır</td></tr>
          </tbody>
        </table>
        <div className="warning-box">
          <strong>Dikkat:</strong> Çok büyük hash'lerde <code>HGETALL</code> kullanmak Redis'i yavaşlatabilir. Sadece ihtiyacınız olan field'ları <code>HGET</code> veya <code>HMGET</code> ile çekin.
        </div>
      </TheorySection>

      <div className="two-columns" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">
            <TbHash className="icon" />
            Hash Operations
          </div>

          <div className="form-row">
            <InputField label="Key" value={key} onChange={setKey} placeholder="Hash key" />
          </div>

          <div className="form-row">
            <InputField label="Field" value={field} onChange={setField} placeholder="Field name" />
            <InputField label="Value" value={value} onChange={setValue} placeholder="Field value" />
          </div>

          <div className="button-group" style={{ marginBottom: 16 }}>
            <ActionButton variant="primary" onClick={handleHset}>HSET</ActionButton>
            <ActionButton variant="info" onClick={handleHget}>HGET</ActionButton>
            <ActionButton variant="success" onClick={handleHgetAll}>HGETALL</ActionButton>
            <ActionButton variant="danger" onClick={handleHdel}>HDEL</ActionButton>
          </div>

          <div className="form-row">
            <InputField label="Increment By" value={incrValue} onChange={setIncrValue} placeholder="Amount" type="number" />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <ActionButton variant="warning" onClick={handleHincrby}>HINCRBY</ActionButton>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {singleValue && (
            <div className="result-display fade-in">
              <div className="result-display-title">HGET Result: {singleValue.field}</div>
              <span className="result-display-value">
                {singleValue.value !== null && singleValue.value !== undefined
                  ? String(singleValue.value)
                  : '(nil)'}
              </span>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Hash Contents</div>
          {hashEntries.length === 0 ? (
            <div className="empty-state">Hash is empty. Set some fields to see them here.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {hashEntries.map(([f, v]) => (
                  <tr key={f}>
                    <td style={{ color: 'var(--accent-blue)' }}>{f}</td>
                    <td>{String(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <CommandLog commands={commands} onClear={() => setCommands([])} />

      {/* Soru-Cevap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Soru & Cevap</div>
        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Bir kullanıcının profil bilgilerini (ad, e-posta, yaş) saklamak istiyorsun. Her bilgiyi ayrı bir yerde mi tutarsın, yoksa hepsini tek bir Hash&apos;te mi? Neden?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Hepsini tek bir Hash&apos;te tutmak çok daha mantıklı. Çünkü bu bilgiler aynı kullanıcıya ait — birlikte okunur, birlikte güncellenir.
            Her bilgiyi ayrı yerde tutarsan, profil sayfasını açmak için 3 ayrı sorgu yapman gerekir.
            Hash ile tek sorguda tüm bilgileri alabilirsin. Ayrıca sadece bir alanı güncellemek de mümkün — her seferinde her şeyi yazmana gerek yok.
          </div>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            E-ticaret sepetini Redis Hash ile tutmanın avantajı nedir?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Sepetteki her ürün bir alan (field) olur, miktarı da değeri olur. Kullanıcı ürün eklediğinde veya çıkardığında
            sadece o alanı güncellersin — tüm sepeti yeniden yazmana gerek kalmaz. Ayrıca sepet içeriğini tek sorguda
            görebilirsin. Veritabanına göre çok daha hızlıdır çünkü RAM üzerinde çalışır.
          </div>
        </details>
      </div>
    </div>
  );
}

export default HashPage;
