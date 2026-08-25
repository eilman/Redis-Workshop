import { useState } from 'react';
import { TbArrowsExchange } from 'react-icons/tb';
import { transactionApi } from '../../api/redisApi';
import InputField from '../common/InputField';
import ActionButton from '../common/ActionButton';
import CommandLog from '../common/CommandLog';
import TheorySection from '../common/TheorySection';

function TransactionPage() {
  // Transfer demo
  const [fromKey, setFromKey] = useState('account:alice');
  const [toKey, setToKey] = useState('account:bob');
  const [amount, setAmount] = useState('25');
  const [transferResult, setTransferResult] = useState(null);

  // Multi-exec demo
  const [multiCommands, setMultiCommands] = useState([
    { key: 'config:theme', value: 'dark' },
    { key: 'config:lang', value: 'tr' },
    { key: 'config:timezone', value: 'UTC+3' },
  ]);
  const [multiResult, setMultiResult] = useState(null);

  // Watch demo
  const [watchKey, setWatchKey] = useState('watched:counter');
  const [watchResult, setWatchResult] = useState(null);

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

  const handleTransfer = async () => {
    try {
      const res = await transactionApi.transfer(fromKey, toKey, Number(amount));
      addCommand(res.data);
      setTransferResult(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  const handleMultiExec = async () => {
    try {
      const res = await transactionApi.multiExec(multiCommands);
      addCommand(res.data);
      setMultiResult(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  const handleWatchDemo = async () => {
    try {
      const res = await transactionApi.watchDemo(watchKey);
      addCommand(res.data);
      setWatchResult(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  const addMultiCommand = () => {
    setMultiCommands((prev) => [...prev, { key: '', value: '' }]);
  };

  const updateMultiCommand = (index, field, value) => {
    setMultiCommands((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeMultiCommand = (index) => {
    setMultiCommands((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <TbArrowsExchange className="icon" />
          Transactions
        </h1>
      </div>

      <TheorySection title="Redis Transactions - Temel Kavramlar">
        <h4>Neden Transaction?</h4>
        <p>
          Transaction, birden fazla Redis komutunu <strong>tek bir atomik blok</strong> olarak çalıştırmanı sağlar.
          Normalde Redis komutları tek tek çalışır ve araya başka client&apos;ların komutları girebilir.
          Ama bazı işlemler birden fazla komutu <strong>birlikte</strong> çalıştırmayı gerektirir —
          örneğin bir hesaptan para çekip diğerine yatırma. İlk komut çalışıp ikincisi çalışmazsa
          para havada kalır. Transaction ile komutlar kuyruğa alınır ve hepsi birden çalıştırılır —
          araya kimse giremez. Banka transferi, stok güncelleme veya birden fazla ayarı aynı anda
          değiştirme gibi &quot;ya hep ya hiç&quot; gerektiren işlemlerde kullanılır.
        </p>

        <h4>MULTI / EXEC / DISCARD / WATCH</h4>
        <ul>
          <li><strong>MULTI:</strong> Transaction&apos;ı başlatır. Bu komuttan sonra yazılan tüm komutlar hemen çalışmaz, bir kuyruğa eklenir</li>
          <li><strong>EXEC:</strong> Kuyruktaki tüm komutları tek seferde atomik olarak çalıştırır. Araya başka client&apos;ın komutu giremez</li>
          <li><strong>DISCARD:</strong> Kuyruktaki tüm komutları iptal eder ve transaction&apos;dan çıkar. Hiçbir komut çalışmaz</li>
          <li><strong>WATCH:</strong> Bir key&apos;i izlemeye alır. WATCH ile EXEC arasında o key başka biri tarafından değiştirilirse, EXEC iptal edilir (optimistic locking)</li>
        </ul>

        <h4>MULTI/EXEC Akışı</h4>
        <div className="step-flow">
          <div className="step-flow-item">
            <div className="step-flow-number">1</div>
            <div className="step-flow-content">
              <strong>MULTI</strong>
              <p>Transaction başlat. Bundan sonraki komutlar kuyruğa alınır.</p>
            </div>
          </div>
          <div className="step-flow-item info">
            <div className="step-flow-number">2</div>
            <div className="step-flow-content">
              <strong>Komutlar (QUEUED)</strong>
              <p>SET, INCR, LPUSH vb. komutlar hemen çalışmaz, kuyruğa eklenir.</p>
            </div>
          </div>
          <div className="step-flow-item success">
            <div className="step-flow-number">3</div>
            <div className="step-flow-content">
              <strong>EXEC</strong>
              <p>Tüm kuyruklanmış komutlar <strong>atomik</strong> olarak çalıştırılır. Araya başka komut giremez.</p>
            </div>
          </div>
        </div>

        <h4>WATCH — Optimistic Locking</h4>
        <p>
          <strong>WATCH</strong> bir key&apos;i izlemeye alır. WATCH ile EXEC arasında o key başka bir client tarafından
          değiştirilirse, EXEC <strong>null</strong> döner ve transaction iptal edilir. Bu pattern <strong>optimistic locking</strong> olarak bilinir.
        </p>

        {/* WATCH Diyagramı */}
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
          padding: 16, marginBottom: 16, overflowX: 'auto',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, minWidth: 400, fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
          }}>
            <div style={{
              background: 'rgba(0,212,255,0.15)', border: '1px solid var(--accent-blue)',
              borderRadius: 'var(--radius-sm)', padding: '8px 12px', textAlign: 'center',
            }}>
              <div style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>WATCH key</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>İzlemeye al</div>
            </div>
            <div style={{ color: 'var(--text-muted)' }}>&rarr;</div>
            <div style={{
              background: 'rgba(0,255,136,0.15)', border: '1px solid var(--accent-green)',
              borderRadius: 'var(--radius-sm)', padding: '8px 12px', textAlign: 'center',
            }}>
              <div style={{ color: 'var(--accent-green)', fontWeight: 700 }}>MULTI + Komutlar</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Kuyruğa al</div>
            </div>
            <div style={{ color: 'var(--text-muted)' }}>&rarr;</div>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{
                background: 'rgba(231,76,60,0.15)', border: '1px solid var(--redis-red)',
                borderRadius: 'var(--radius-sm)', padding: '6px 12px', textAlign: 'center',
              }}>
                <div style={{ color: 'var(--redis-red)', fontWeight: 700, fontSize: '0.75rem' }}>Key değişti &rarr; EXEC = null</div>
              </div>
              <div style={{
                background: 'rgba(0,255,136,0.15)', border: '1px solid var(--accent-green)',
                borderRadius: 'var(--radius-sm)', padding: '6px 12px', textAlign: 'center',
              }}>
                <div style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.75rem' }}>Key değişmedi &rarr; EXEC OK</div>
              </div>
            </div>
          </div>
        </div>

        <h4>Atomik vs Non-Atomik</h4>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{
            flex: '1 1 200px', background: 'rgba(0,255,136,0.1)', border: '2px solid var(--accent-green)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.95rem', marginBottom: 8 }}>
              Atomik (MULTI/EXEC)
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Tüm komutlar <strong>tek blok</strong> olarak çalışır. Araya başka komut giremez. Ya hepsi olur ya hiçbiri.
            </div>
          </div>
          <div style={{
            flex: '1 1 200px', background: 'rgba(231,76,60,0.1)', border: '2px solid var(--redis-red)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--redis-red)', fontSize: '0.95rem', marginBottom: 8 }}>
              Non-Atomik (Tek tek komut)
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Her komut ayrı çalışır. Araya başka client&apos;ın komutu girebilir. Race condition riski var.
            </div>
          </div>
        </div>

        <div className="tip-box">
          <strong>İpucu:</strong> Redis transaction&apos;ları SQL transaction&apos;larından farklıdır — rollback yoktur.
          Bir komut hata verirse diğer komutlar yine çalışır. WATCH ile retry pattern kullanın.
        </div>

        <h4>Bu Örnekler Ne Gösteriyor?</h4>
        <ul>
          <li><strong>Atomik Transfer:</strong> Alice&apos;ten Bob&apos;a para transferi. MULTI/EXEC ile bir hesaptan düşüp diğerine ekleme
            tek blokta yapılır — araya başka işlem giremez, para havada kalmaz</li>
          <li><strong>Multi-Exec (Toplu SET):</strong> Birden fazla SET komutunu tek seferde atomik çalıştırır.
            Örneğin bir uygulamanın config ayarlarını (tema, dil, timezone) aynı anda güncellemek istersen,
            yarısı eski yarısı yeni kalma riski olmaz</li>
          <li><strong>WATCH Demo:</strong> Optimistic locking&apos;i gösterir. Bir key&apos;i WATCH ile izlersin,
            başka biri o key&apos;i değiştirirse senin transaction&apos;ın iptal edilir.
            Demo bunu kasıtlı olarak simüle eder — araya başka bir client sokar ve transaction&apos;ın
            nasıl iptal edildiğini gösterir</li>
        </ul>
      </TheorySection>

      {error && <div className="error-message">{error}</div>}

      {/* Transfer Demo */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">
          <TbArrowsExchange className="icon" />
          Atomik Transfer (MULTI/EXEC)
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          İki hesap arasında atomik bakiye transferi. İlk çalıştırmada her hesap 100 bakiye ile başlar.
        </p>
        <div className="form-row">
          <InputField label="From Key" value={fromKey} onChange={setFromKey} placeholder="account:alice" />
          <InputField label="To Key" value={toKey} onChange={setToKey} placeholder="account:bob" />
          <InputField label="Amount" value={amount} onChange={setAmount} placeholder="25" type="number" />
        </div>
        <ActionButton variant="primary" onClick={handleTransfer}>Transfer</ActionButton>

        {transferResult && (
          <div className="result-display fade-in" style={{ marginTop: 12 }}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value" style={{ fontSize: '1rem' }}>{transferResult.from?.key}</div>
                <div className="stat-label">Bakiye: {transferResult.from?.balance}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--accent-green)' }}>&rarr; {transferResult.amount} &rarr;</div>
                <div className="stat-label">Transfer</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ fontSize: '1rem' }}>{transferResult.to?.key}</div>
                <div className="stat-label">Bakiye: {transferResult.to?.balance}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Exec Demo */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Multi-Exec (Toplu SET)</div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Birden fazla SET komutunu tek bir MULTI/EXEC bloğunda atomik çalıştırın.
        </p>
        {multiCommands.map((cmd, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 8 }}>
            <InputField
              label={index === 0 ? 'Key' : ''}
              value={cmd.key}
              onChange={(v) => updateMultiCommand(index, 'key', v)}
              placeholder="key"
            />
            <InputField
              label={index === 0 ? 'Value' : ''}
              value={cmd.value}
              onChange={(v) => updateMultiCommand(index, 'value', v)}
              placeholder="value"
            />
            <ActionButton variant="danger" onClick={() => removeMultiCommand(index)}>X</ActionButton>
          </div>
        ))}
        <div className="button-group" style={{ marginTop: 8 }}>
          <ActionButton variant="info" onClick={addMultiCommand}>+ Add Command</ActionButton>
          <ActionButton variant="primary" onClick={handleMultiExec}>Execute MULTI/EXEC</ActionButton>
        </div>

        {multiResult && (
          <div className="result-display fade-in" style={{ marginTop: 12 }}>
            <div className="result-display-title">Transaction Result</div>
            <pre className="result-display-value" style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(multiResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Watch Demo */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">WATCH Demo (Optimistic Locking)</div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Bu demo, WATCH mekanizmasını test etmek için <strong>kasıtlı olarak araya başka bir client sokar</strong>.
          Backend tarafında ayrı bir thread key&apos;i değiştirir ve transaction&apos;ın iptal edilmesini tetikler.
        </p>
        <div className="form-row">
          <InputField label="Watch Key" value={watchKey} onChange={setWatchKey} placeholder="watched:counter" />
        </div>
        <ActionButton variant="warning" onClick={handleWatchDemo}>Run WATCH Demo</ActionButton>

        {watchResult && (
          <div className="result-display fade-in" style={{ marginTop: 12 }}>
            {/* Adım adım görsel akış */}
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Demo&apos;da olan biten:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,212,255,0.15)', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)',
                  fontWeight: 700, fontSize: '0.72rem', flexShrink: 0,
                }}>1</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Key&apos;e başlangıç değeri yazıldı: <code style={{ color: 'var(--accent-blue)' }}>SET {watchResult.watchedKey} &quot;initial-value&quot;</code>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,212,255,0.15)', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)',
                  fontWeight: 700, fontSize: '0.72rem', flexShrink: 0,
                }}>2</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Key izlemeye alındı: <code style={{ color: 'var(--accent-blue)' }}>WATCH {watchResult.watchedKey}</code>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,184,0,0.2)', border: '1px solid var(--accent-orange)', color: 'var(--accent-orange)',
                  fontWeight: 700, fontSize: '0.72rem', flexShrink: 0,
                }}>3</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-orange)', fontWeight: 600 }}>
                  Araya başka bir client girdi! Backend ayrı bir thread&apos;den key&apos;i değiştirdi: <code style={{ color: 'var(--accent-orange)' }}>SET {watchResult.watchedKey} &quot;modified-by-another-client&quot;</code>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,212,255,0.15)', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)',
                  fontWeight: 700, fontSize: '0.72rem', flexShrink: 0,
                }}>4</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Transaction başlatıldı: <code style={{ color: 'var(--accent-blue)' }}>MULTI → SET {watchResult.watchedKey} &quot;transaction-value&quot; → EXEC</code>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: watchResult.transactionSuccess ? 'rgba(0,255,136,0.2)' : 'rgba(231,76,60,0.2)',
                  border: `1px solid ${watchResult.transactionSuccess ? 'var(--accent-green)' : 'var(--redis-red)'}`,
                  color: watchResult.transactionSuccess ? 'var(--accent-green)' : 'var(--redis-red)',
                  fontWeight: 700, fontSize: '0.72rem', flexShrink: 0,
                }}>5</span>
                <span style={{
                  fontSize: '0.82rem', fontWeight: 700,
                  color: watchResult.transactionSuccess ? 'var(--accent-green)' : 'var(--redis-red)',
                }}>
                  {watchResult.transactionSuccess
                    ? 'EXEC başarılı — key değişmemişti, transaction uygulandı.'
                    : 'EXEC null döndü — Redis key\'in değiştiğini tespit etti, transaction iptal edildi!'}
                </span>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', padding: 12, marginBottom: 12,
              fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7,
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Sonuç:</strong> Key&apos;in son değeri <code style={{ color: 'var(--accent-orange)' }}>&quot;{watchResult.finalValue}&quot;</code> —
              {watchResult.transactionSuccess
                ? ' transaction\'ın yazdığı değer.'
                : ' araya giren client\'ın yazdığı değer. Transaction\'ın yazmak istediği "transaction-value" uygulanmadı. Optimistic locking veri tutarsızlığını önledi.'}
            </div>

            <div className="result-display-title">Raw Response</div>
            <pre className="result-display-value" style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(watchResult, null, 2)}
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
            Bir havale işleminde gönderenin bakiyesi düştü ama alıcıya para ulaşmadı. Kullanıcı &quot;param kayboldu&quot; diyor. Bu nasıl olabilir ve nasıl önlenir?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            İki ayrı işlem var: &quot;göndericiden düş&quot; ve &quot;alıcıya ekle&quot;. Birincisi başarılı oldu ama ikincisi sırasında sistem çöktüyse
            para havada kalır. Transaction bu iki işlemi tek bir bütün yapar — ya ikisi birden gerçekleşir ya da hiçbiri gerçekleşmez.
            İlk işlem başarılı olsa bile ikincisi başarısız olursa her şey geri alınır. Buna &quot;atomiklik&quot; denir: yarım kalmış işlem olmaz.
          </div>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            İki kişi aynı anda son ürünü satın almaya çalışırsa ne olur?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Transaction olmadan ikisi de &quot;1 adet var&quot; görür ve ikisi de satın alır — stok eksi&apos;ye düşer.
            WATCH komutu ile stok değerini izleyebilirsin: ilk kişi satın aldığında stok değişir,
            ikinci kişinin işlemi otomatik olarak iptal edilir ve &quot;stok tükendi&quot; mesajı gösterilir.
            Bu sayede stok hiçbir zaman eksi&apos;ye düşmez.
          </div>
        </details>
      </div>
    </div>
  );
}

export default TransactionPage;
