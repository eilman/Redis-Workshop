import React, { useState } from 'react';
import { TbKey } from 'react-icons/tb';
import { keyDesignApi } from '../../api/redisApi';
import InputField from '../common/InputField';
import ActionButton from '../common/ActionButton';
import ResultDisplay from '../common/ResultDisplay';
import CommandLog from '../common/CommandLog';
import TheorySection from '../common/TheorySection';

function KeyDesignPage() {
  // Good key design inputs
  const [entity, setEntity] = useState('user');
  const [entityId, setEntityId] = useState('1001');
  const [fieldName, setFieldName] = useState('email');

  // Bad key design inputs
  const [badKeyName, setBadKeyName] = useState('mydata');

  // Scan inputs
  const [scanPattern, setScanPattern] = useState('user:*');
  const [scanResults, setScanResults] = useState([]);

  // Key info inputs
  const [infoKey, setInfoKey] = useState('user:1001:email');
  const [keyInfo, setKeyInfo] = useState(null);

  const [commands, setCommands] = useState([]);
  const [error, setError] = useState(null);
  const [goodResult, setGoodResult] = useState(null);
  const [badResult, setBadResult] = useState(null);

  const addCommand = (data) => {
    setCommands((prev) => [...prev, data]);
    setError(null);
  };

  const handleError = (err) => {
    const msg = err.response?.data?.result || err.message;
    setError(msg);
  };

  const handleGoodDemo = async () => {
    try {
      const res = await keyDesignApi.demoGood({ entity, id: entityId, field: fieldName });
      addCommand(res.data);
      setGoodResult(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  const handleBadDemo = async () => {
    try {
      const res = await keyDesignApi.demoBad({ name: badKeyName });
      addCommand(res.data);
      setBadResult(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  const handleScan = async () => {
    if (!scanPattern.trim()) return;
    try {
      const res = await keyDesignApi.scan(scanPattern);
      addCommand(res.data);
      const result = res.data.result;
      if (Array.isArray(result)) {
        setScanResults(result);
      } else if (typeof result === 'string') {
        setScanResults(result.split(',').map((s) => s.trim()).filter(Boolean));
      } else {
        setScanResults([]);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleKeyInfo = async () => {
    if (!infoKey.trim()) return;
    try {
      const res = await keyDesignApi.info(infoKey);
      addCommand(res.data);
      setKeyInfo(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <TbKey className="icon" />
          Key Design
        </h1>
      </div>

      <TheorySection title="Key Design - Temel Kavramlar">
        <p>
          Redis&apos;te veri key-value olarak saklanır ve doğru key isimlendirmesi çok önemlidir.
          İyi tasarlanmış key&apos;ler okunabilir, tutarlı ve organize olur — Redis&apos;in <strong>bakımını ve performansını</strong> doğrudan etkiler.
          Genel kural <code>nesne:id:alan</code> formatıdır — örneğin <code>user:1001:email</code>.
          Kötü key tasarımı ise karmaşaya, performans sorunlarına ve bakım zorluğuna yol açar.
        </p>
        <h4>Namespace Kuralları</h4>
        {/* Namespace Pattern Görseli */}
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
          padding: 16, marginBottom: 16, textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
            Key Namespace Format
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 0,
            fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700,
          }}>
            <span style={{
              background: 'rgba(0,212,255,0.2)', border: '2px solid var(--accent-blue)',
              borderRadius: '6px 0 0 6px', padding: '8px 14px', color: 'var(--accent-blue)',
            }}>entity</span>
            <span style={{ color: 'var(--text-muted)', padding: '8px 2px', fontSize: '1.2rem' }}>:</span>
            <span style={{
              background: 'rgba(0,255,136,0.2)', border: '2px solid var(--accent-green)',
              borderTop: '2px solid var(--accent-green)', borderBottom: '2px solid var(--accent-green)',
              padding: '8px 14px', color: 'var(--accent-green)',
            }}>id</span>
            <span style={{ color: 'var(--text-muted)', padding: '8px 2px', fontSize: '1.2rem' }}>:</span>
            <span style={{
              background: 'rgba(255,184,0,0.2)', border: '2px solid var(--accent-orange)',
              borderRadius: '0 6px 6px 0', padding: '8px 14px', color: 'var(--accent-orange)',
            }}>field</span>
          </div>
          <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent-blue)' }}>user</span>
            <span style={{ color: 'var(--text-muted)' }}>:</span>
            <span style={{ color: 'var(--accent-green)' }}>1001</span>
            <span style={{ color: 'var(--text-muted)' }}>:</span>
            <span style={{ color: 'var(--accent-orange)' }}>email</span>
          </div>
        </div>
        <div className="feature-grid" style={{ marginBottom: 16 }}>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>📂</div>
            <div className="feature-title">entity:id:field</div>
            <div className="feature-desc">
              Temel format. Örnek: <code>user:1001:email</code> — entity, id ve field ile yapılandırılmış key.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🔖</div>
            <div className="feature-title">Versiyon Prefix</div>
            <div className="feature-desc">
              <code>v2:user:1001:email</code> — Schema değişikliklerinde eski ve yeni veriyi ayır.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🌍</div>
            <div className="feature-title">Ortam Prefix</div>
            <div className="feature-desc">
              <code>prod:user:1001:email</code> — Aynı Redis&apos;te farklı ortamları (dev/staging/prod) ayır.
            </div>
          </div>
        </div>
        <h4>Key Boyutu</h4>
        <ul>
          <li>Key'ler kısa ama anlamlı olmalı. Çok uzun key'ler bellek ve network bant genişliği harcar</li>
          <li>Örnek: <code>u:1001:e</code> (çok kısa, anlaşılmaz) vs <code>user:1001:email</code> (ideal)</li>
        </ul>
        <h4>SCAN vs KEYS</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Özellik</th><th>Production'da</th></tr>
          </thead>
          <tbody>
            <tr><td><code>KEYS *</code></td><td>Tüm key'leri döndürür, Redis'i BLOKE EDER</td><td style={{ color: 'var(--redis-red)' }}>KULLANMAYIN</td></tr>
            <tr><td><code>SCAN 0 MATCH user:*</code></td><td>Cursor bazlı, bloklama yapmaz</td><td style={{ color: 'var(--accent-green)' }}>GÜVENLİ</td></tr>
          </tbody>
        </table>
        <div className="warning-box">
          <strong>Dikkat:</strong> Production ortamında <code>KEYS</code> komutu kesinlikle kullanılmamalıdır! Büyük veri setlerinde Redis'i saniyelerce bloke edebilir.
        </div>
      </TheorySection>

      <div className="two-columns" style={{ marginBottom: 16 }}>
        <div className="card" style={{ borderLeft: '3px solid var(--accent-green)' }}>
          <div className="card-title" style={{ color: 'var(--accent-green)' }}>
            Good Key Design
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 12 }}>
            Pattern: <code>entity:id:field</code>
          </p>

          <div className="form-row">
            <InputField label="Entity" value={entity} onChange={setEntity} placeholder="user" />
            <InputField label="ID" value={entityId} onChange={setEntityId} placeholder="1001" />
            <InputField label="Field" value={fieldName} onChange={setFieldName} placeholder="email" />
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--accent-green)',
            backgroundColor: 'var(--bg-input)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 12,
          }}>
            Key: {entity}:{entityId}:{fieldName}
          </div>

          <ActionButton variant="success" onClick={handleGoodDemo}>Create Good Keys</ActionButton>

          {goodResult !== null && (
            <div className="result-display fade-in" style={{ marginTop: 12 }}>
              <div className="result-display-title">Oluşturulan Key&apos;ler</div>
              {goodResult.createdKeys && goodResult.createdKeys.map((k, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', padding: '2px 0', color: 'var(--accent-green)' }}>{k}</div>
              ))}
              {goodResult.scanHint && (
                <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  SCAN ile <code>{goodResult.scanPattern}</code> deneyin — tüm alanları tek seferde bulabilirsiniz.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--redis-red)' }}>
          <div className="card-title" style={{ color: 'var(--redis-red)' }}>
            Bad Key Design
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 12 }}>
            Pattern: flat, no structure
          </p>

          <div className="form-row">
            <InputField label="Key Name" value={badKeyName} onChange={setBadKeyName} placeholder="mydata" />
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--redis-red)',
            backgroundColor: 'var(--bg-input)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 12,
          }}>
            Key: {badKeyName}
          </div>

          <ActionButton variant="danger" onClick={handleBadDemo}>Create Bad Keys</ActionButton>

          {badResult !== null && (
            <div className="result-display fade-in" style={{ marginTop: 12 }}>
              <div className="result-display-title">Oluşturulan Key&apos;ler</div>
              {badResult.createdKeys && badResult.createdKeys.map((k, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', padding: '2px 0', color: 'var(--redis-red)' }}>{k}</div>
              ))}
              {badResult.problem && (
                <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {badResult.problem}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="two-columns" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">SCAN Keys</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 12 }}>
            Use <code>SCAN</code> to find keys matching a pattern. Never use <code>KEYS</code> in production.
          </p>

          <div className="form-row">
            <InputField label="Pattern" value={scanPattern} onChange={setScanPattern} placeholder="user:*" />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <ActionButton variant="info" onClick={handleScan}>SCAN</ActionButton>
            </div>
          </div>

          {scanResults.length > 0 ? (
            <div style={{ marginTop: 8 }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: 8,
              }}>
                Found {scanResults.length} key(s):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {scanResults.map((key, index) => (
                  <span
                    key={index}
                    className="chip"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setInfoKey(String(key));
                    }}
                  >
                    {String(key)}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">No keys found. Try creating some keys first.</div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Key Info</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 12 }}>
            Inspect a specific key to see its type, TTL, encoding, and more.
          </p>

          <div className="form-row">
            <InputField label="Key" value={infoKey} onChange={setInfoKey} placeholder="user:1001:email" />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <ActionButton variant="info" onClick={handleKeyInfo}>Inspect</ActionButton>
            </div>
          </div>

          {keyInfo !== null && (
            <div style={{ marginTop: 8 }}>
              {typeof keyInfo === 'object' ? (
                <div className="key-info-grid">
                  {Object.entries(keyInfo).map(([k, v]) => (
                    <React.Fragment key={k}>
                      <div className="key-info-label">{k}</div>
                      <div className="key-info-value">{String(v)}</div>
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <ResultDisplay title="Key Info" value={keyInfo} />
              )}
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <CommandLog commands={commands} onClear={() => setCommands([])} />

      {/* Soru-Cevap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Soru & Cevap</div>
        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Bir kullanıcı KVKK/GDPR kapsamında &quot;tüm verilerimi silin&quot; dedi. Sistemde o kullanıcıya ait tüm verileri nasıl bulursun?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Key&apos;ler <code>user:1001:profile</code>, <code>user:1001:orders</code>, <code>user:1001:sessions</code> gibi standart bir yapıdaysa
            <code>SCAN user:1001:*</code> ile o kullanıcıya ait tüm verileri anında bulup silebilirsin.
            Ama key&apos;ler &quot;data_ahmet&quot;, &quot;siparis_99&quot;, &quot;oturum_xyz&quot; gibi düzensizse hangi verinin kime ait olduğunu bulmak neredeyse imkânsızdır.
            İyi key tasarımı sadece teknik değil, yasal bir gereklilik olarak da karşına çıkabilir.
          </div>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            E-ticaret uygulaması büyüdü, Redis&apos;te 5 milyon key var. Sipariş verileri ile kullanıcı verileri karışmış durumda. Bu durumda ne olur?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Bir hata olduğunda &quot;bu key ne işe yarıyor?&quot; sorusuna kimse cevap veremez, debug saatler sürer.
            Yanlış key silinir, yanlış veri güncellenir. Oysa baştan <code>order:5001:items</code> ve <code>user:1001:profile</code>
            gibi bir yapı kurulmuş olsaydı, 5 milyon key olsa bile her birinin ne olduğu isminden anlaşılır,
            pattern ile filtreleme yapılabilir ve ekip rahatça çalışabilirdi.
          </div>
        </details>
      </div>
    </div>
  );
}

export default KeyDesignPage;
