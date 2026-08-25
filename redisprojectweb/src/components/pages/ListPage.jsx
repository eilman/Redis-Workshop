import { useState } from 'react';
import { TbList } from 'react-icons/tb';
import { listApi } from '../../api/redisApi';
import InputField from '../common/InputField';
import ActionButton from '../common/ActionButton';
import CommandLog from '../common/CommandLog';
import TheorySection from '../common/TheorySection';

function ListPage() {
  const [key, setKey] = useState('mylist');
  const [value, setValue] = useState('');
  const [listItems, setListItems] = useState([]);
  const [listLength, setListLength] = useState(null);
  const [lastPopped, setLastPopped] = useState(null);
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

  const refreshList = async () => {
    try {
      const res = await listApi.lrange(key);
      addCommand(res.data);
      const result = res.data.result;
      if (Array.isArray(result)) {
        setListItems(result);
      } else if (result === null || result === undefined) {
        setListItems([]);
      } else {
        setListItems([]);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleLpush = async () => {
    if (!value.trim()) return;
    try {
      const res = await listApi.lpush(key, value);
      addCommand(res.data);
      setValue('');
      await refreshList();
    } catch (err) {
      handleError(err);
    }
  };

  const handleRpush = async () => {
    if (!value.trim()) return;
    try {
      const res = await listApi.rpush(key, value);
      addCommand(res.data);
      setValue('');
      await refreshList();
    } catch (err) {
      handleError(err);
    }
  };

  const handleLpop = async () => {
    try {
      const res = await listApi.lpop(key);
      addCommand(res.data);
      setLastPopped(res.data.result);
      await refreshList();
    } catch (err) {
      handleError(err);
    }
  };

  const handleRpop = async () => {
    try {
      const res = await listApi.rpop(key);
      addCommand(res.data);
      setLastPopped(res.data.result);
      await refreshList();
    } catch (err) {
      handleError(err);
    }
  };

  const handleLrange = async () => {
    await refreshList();
  };

  const handleLlen = async () => {
    try {
      const res = await listApi.llen(key);
      addCommand(res.data);
      setListLength(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <TbList className="icon" />
          Lists
        </h1>
      </div>

      <TheorySection title="Redis Lists - Temel Kavramlar">
        <p>
          List, Redis&apos;te sıralı elemanlar tutan bir veri yapısıdır. Yapı olarak <strong>doubly linked list</strong> (çift yönlü bağlı liste)&apos;dir
          ve maksimum <strong>~4 milyar</strong> eleman saklayabilir.
          Baştan veya sondan eleman ekleme/çıkarma çok hızlıdır.
          Kuyruk (queue) sistemleri, son aktiviteler listesi, bildirim geçmişi ve
          iş kuyruğu (job queue) gibi senaryolarda kullanılır.
        </p>
        {/* Görsel: Linked List diyagramı */}
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
          padding: '16px 12px', marginBottom: 16, overflowX: 'auto',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 0, minWidth: 420, fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
          }}>
            <div style={{ textAlign: 'center', color: 'var(--accent-green)', fontWeight: 700, marginRight: 8 }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LPUSH</div>
              <div>&rarr;</div>
            </div>
            <div style={{ textAlign: 'center', color: 'var(--accent-orange)', fontWeight: 700, marginRight: 8 }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LPOP</div>
              <div>&larr;</div>
            </div>
            {['A', 'B', 'C', 'D'].map((item, i, arr) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === 0 ? 'rgba(0,212,255,0.15)' : i === arr.length - 1 ? 'rgba(0,255,136,0.15)' : 'var(--bg-secondary)',
                  border: `2px solid ${i === 0 ? 'var(--accent-blue)' : i === arr.length - 1 ? 'var(--accent-green)' : 'var(--border-color-light)'}`,
                  borderRadius: 'var(--radius-sm)', fontWeight: 700, color: 'var(--text-primary)',
                }}>
                  {item}
                </div>
                {i < arr.length - 1 && (
                  <div style={{ color: 'var(--text-muted)', margin: '0 4px', fontSize: '1rem' }}>&harr;</div>
                )}
              </div>
            ))}
            <div style={{ textAlign: 'center', color: 'var(--accent-green)', fontWeight: 700, marginLeft: 8 }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RPUSH</div>
              <div>&larr;</div>
            </div>
            <div style={{ textAlign: 'center', color: 'var(--accent-orange)', fontWeight: 700, marginLeft: 8 }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RPOP</div>
              <div>&rarr;</div>
            </div>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 8,
            fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
            paddingLeft: 60, paddingRight: 60,
          }}>
            <span>HEAD (index 0)</span>
            <span>TAIL</span>
          </div>
        </div>

        <h4>Performans Özellikleri</h4>
        <ul>
          <li><strong>O(1)</strong> push/pop işlemleri (baştan veya sondan)</li>
          <li><strong>O(N)</strong> index ile erişim (orta elemanlara erişim yavaş)</li>
        </ul>
        <h4>Temel Komutlar</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Açıklama</th><th>Örnek</th></tr>
          </thead>
          <tbody>
            <tr><td><code>LPUSH</code></td><td>Listenin başına (sol) eleman ekler</td><td><code>LPUSH mylist "a"</code></td></tr>
            <tr><td><code>RPUSH</code></td><td>Listenin sonuna (sağ) eleman ekler</td><td><code>RPUSH mylist "b"</code></td></tr>
            <tr><td><code>LPOP</code></td><td>Listenin başından eleman çıkarır</td><td><code>LPOP mylist</code></td></tr>
            <tr><td><code>RPOP</code></td><td>Listenin sonundan eleman çıkarır</td><td><code>RPOP mylist</code></td></tr>
            <tr><td><code>LRANGE</code></td><td>Belirtilen aralıktaki elemanları getirir</td><td><code>LRANGE mylist 0 -1</code></td></tr>
            <tr><td><code>LLEN</code></td><td>Listenin uzunluğunu döndürür</td><td><code>LLEN mylist</code></td></tr>
          </tbody>
        </table>
        <div className="tip-box" style={{ marginBottom: 12 }}>
          <strong>Not:</strong> Her iki uçtan da ekleme ve çıkarma yapılabilir. Bu özellik sayesinde List, hem <strong>Queue (kuyruk)</strong> hem de <strong>Stack (yığın)</strong> olarak kullanılabilir.
        </div>
        <h4>Kullanım Kalıpları</h4>
        {/* Queue vs Stack Karşılaştırma Kartları */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{
            flex: '1 1 220px', background: 'rgba(0,212,255,0.1)', border: '2px solid var(--accent-blue)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.95rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.2rem' }}>📥</span> Queue (FIFO)
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginBottom: 8,
              background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', padding: '8px 10px',
            }}>
              <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>LPUSH &rarr;</span>
              <span style={{ color: 'var(--text-muted)' }}>[A, B, C]</span>
              <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>&rarr; RPOP</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              İlk giren ilk çıkar. <strong>Mesaj kuyrukları</strong> ve task queue için ideal.
            </div>
          </div>
          <div style={{
            flex: '1 1 220px', background: 'rgba(0,255,136,0.1)', border: '2px solid var(--accent-green)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.95rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.2rem' }}>📚</span> Stack (LIFO)
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginBottom: 8,
              background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', padding: '8px 10px',
            }}>
              <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>LPUSH &rarr;</span>
              <span style={{ color: 'var(--text-muted)' }}>[A, B, C]</span>
              <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>&larr; LPOP</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Son giren ilk çıkar. <strong>Undo/redo</strong> ve son işlem geri alma için ideal.
            </div>
          </div>
        </div>
        <h4>Gerçek Hayat Örnekleri</h4>
        <div className="feature-grid" style={{ marginBottom: 16 }}>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>📧</div>
            <div className="feature-title">E-posta Kuyruğu</div>
            <div className="feature-desc">Kullanıcı kayıt olunca <code>LPUSH email:queue &quot;hoşgeldin maili&quot;</code> ile kuyruğa ekle. Arka plan worker&apos;ı <code>RPOP</code> ile sırayla işler.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🔔</div>
            <div className="feature-title">Son Bildirimler</div>
            <div className="feature-desc">Instagram gibi — <code>LPUSH notif:user:1001 &quot;Ahmet seni takip etti&quot;</code> ve <code>LTRIM notif:user:1001 0 49</code> ile son 50 bildirimi tut.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🖨️</div>
            <div className="feature-title">İş Kuyruğu</div>
            <div className="feature-desc">PDF oluşturma, resim boyutlandırma gibi ağır işleri <code>LPUSH</code> ile kuyruğa at, worker&apos;lar <code>RPOP</code> ile sırayla alsın.</div>
          </div>
        </div>
        <div className="tip-box">
          <strong>İpucu:</strong> Listenin boyutu büyürse, <code>LTRIM</code> ile sınırlı tutabilirsiniz. Örneğin son 100 kaydı saklamak için: <code>LTRIM mylist 0 99</code>
        </div>
      </TheorySection>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">
          <TbList className="icon" />
          List Operations
        </div>

        <div className="form-row">
          <InputField label="Key" value={key} onChange={setKey} placeholder="Enter list key" />
          <InputField label="Value" value={value} onChange={setValue} placeholder="Enter value to push" />
        </div>

        <div className="button-group" style={{ marginBottom: 16 }}>
          <ActionButton variant="primary" onClick={handleLpush}>LPUSH</ActionButton>
          <ActionButton variant="primary" onClick={handleRpush}>RPUSH</ActionButton>
          <ActionButton variant="warning" onClick={handleLpop}>LPOP</ActionButton>
          <ActionButton variant="warning" onClick={handleRpop}>RPOP</ActionButton>
          <ActionButton variant="info" onClick={handleLrange}>LRANGE</ActionButton>
          <ActionButton variant="success" onClick={handleLlen}>LLEN</ActionButton>
        </div>

        {error && <div className="error-message">{error}</div>}

        {lastPopped !== null && lastPopped !== undefined && (
          <div className="result-display fade-in" style={{ marginBottom: 12 }}>
            <div className="result-display-title">Last Popped Value</div>
            <span className="result-display-value">{String(lastPopped)}</span>
          </div>
        )}

        {listLength !== null && (
          <div className="result-display fade-in" style={{ marginBottom: 12 }}>
            <div className="result-display-title">List Length</div>
            <span className="result-display-value">{listLength}</span>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">List Visualization</div>
        {listItems.length === 0 ? (
          <div className="empty-state">List is empty. Push some values to see them here.</div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                HEAD (index 0)
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                TAIL (index {listItems.length - 1})
              </span>
            </div>
            <div className="visual-list">
              {listItems.map((item, index) => (
                <div key={index} className="visual-list-item">
                  <span className="index">{index}</span>
                  {String(item)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CommandLog commands={commands} onClear={() => setCommands([])} />

      {/* Soru-Cevap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Soru & Cevap</div>
        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Bir bildirim sistemi tasarlıyorsun ve son 50 bildirimi tutmak istiyorsun. Neden LPUSH + LTRIM kullanırsın, sadece LPUSH yetmez mi?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Sadece LPUSH kullanırsan liste sonsuza kadar büyür ve bellek tükenir.
            <code>LTRIM notif:user:1001 0 49</code> ile her ekleme sonrası listeyi 50 elemanla sınırlarsın.
            Eski bildirimler otomatik silinir, bellek kontrol altında kalır.
          </div>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Queue (FIFO) ve Stack (LIFO) arasındaki fark nedir? List ile ikisini de nasıl yaparsın?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            <strong>Queue (FIFO):</strong> İlk giren ilk çıkar. <code>LPUSH</code> ile ekle, <code>RPOP</code> ile çıkar. E-posta kuyruğu gibi — ilk gelen mail ilk gönderilir.
            <br /><strong>Stack (LIFO):</strong> Son giren ilk çıkar. <code>LPUSH</code> ile ekle, <code>LPOP</code> ile çıkar. Undo/geri al gibi — son yapılan işlem ilk geri alınır.
          </div>
        </details>
      </div>
    </div>
  );
}

export default ListPage;
