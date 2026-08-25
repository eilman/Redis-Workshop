import { useState } from 'react';
import { TbSortAscending } from 'react-icons/tb';
import { sortedSetApi } from '../../api/redisApi';
import InputField from '../common/InputField';
import ActionButton from '../common/ActionButton';
import ResultDisplay from '../common/ResultDisplay';
import CommandLog from '../common/CommandLog';
import TheorySection from '../common/TheorySection';

function SortedSetPage() {
  const [key, setKey] = useState('leaderboard');
  const [member, setMember] = useState('player1');
  const [score, setScore] = useState('100');
  const [rankedItems, setRankedItems] = useState([]);
  const [singleResult, setSingleResult] = useState(null);
  const [singleResultTitle, setSingleResultTitle] = useState('');
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

  const handleZadd = async () => {
    if (!key.trim() || !member.trim()) return;
    try {
      const res = await sortedSetApi.add(key, member, Number(score));
      addCommand(res.data);
      await handleZrange();
    } catch (err) {
      handleError(err);
    }
  };

  const handleZrange = async () => {
    if (!key.trim()) return;
    try {
      const res = await sortedSetApi.range(key, 0, -1);
      addCommand(res.data);
      const result = res.data.result;
      if (Array.isArray(result)) {
        setRankedItems(result);
      } else if (result && typeof result === 'object') {
        // Handle object format { member: score, ... }
        const items = Object.entries(result).map(([m, s]) => ({ member: m, score: s }));
        items.sort((a, b) => b.score - a.score);
        setRankedItems(items);
      } else {
        setRankedItems([]);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleZrank = async () => {
    if (!key.trim() || !member.trim()) return;
    try {
      const res = await sortedSetApi.rank(key, member);
      addCommand(res.data);
      setSingleResultTitle(`Rank of "${member}"`);
      setSingleResult(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  const handleZscore = async () => {
    if (!key.trim() || !member.trim()) return;
    try {
      const res = await sortedSetApi.score(key, member);
      addCommand(res.data);
      setSingleResultTitle(`Score of "${member}"`);
      setSingleResult(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  const handleZrem = async () => {
    if (!key.trim() || !member.trim()) return;
    try {
      const res = await sortedSetApi.remove(key, member);
      addCommand(res.data);
      await handleZrange();
    } catch (err) {
      handleError(err);
    }
  };

  // Normalize and sort by score descending
  const displayItems = rankedItems
    .map((item) => {
      if (typeof item === 'object' && item !== null) {
        const member = item.member || item.value || String(item);
        return { member, score: item.score ?? null };
      }
      return { member: String(item), score: null };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .map((item, index) => ({ rank: index, ...item }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <TbSortAscending className="icon" />
          Sorted Sets
        </h1>
      </div>

      <TheorySection title="Redis Sorted Sets - Temel Kavramlar">
        <p>
          Sorted Set, her elemanın bir <strong>score (puan)</strong> ile ilişkilendirildiği ve score&apos;a göre
          {' '}<strong>otomatik sıralanan</strong> bir yapıdır. Set gibi elemanlar benzersizdir ama ek olarak sıralama özelliği vardır.
          Leaderboard (skor tablosu), sıralama sistemleri, zamana dayalı veriler (rate limiting)
          ve öncelik kuyrukları gibi senaryolarda kullanılır.
        </p>

        {/* Mini Leaderboard Görseli */}
        <h4>Leaderboard Örneği</h4>
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
          padding: 16, marginBottom: 16, maxWidth: 340,
        }}>
          {[
            { medal: '🥇', name: 'player3', score: 2500, color: '#FFD700' },
            { medal: '🥈', name: 'player1', score: 1800, color: '#C0C0C0' },
            { medal: '🥉', name: 'player2', score: 1200, color: '#CD7F32' },
          ].map((p, i) => (
            <div key={p.name} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px',
              borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none',
              fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
            }}>
              <span style={{ fontSize: '1.3rem' }}>{p.medal}</span>
              <span style={{ flex: 1, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
              <span style={{ fontWeight: 700, color: p.color }}>{p.score} pts</span>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            ZREVRANGE leaderboard 0 2 WITHSCORES
          </div>
        </div>

        <h4>Gerçek Hayat Örnekleri</h4>
        <div className="feature-grid" style={{ marginBottom: 16 }}>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🏆</div>
            <div className="feature-title">Oyun Skor Tablosu</div>
            <div className="feature-desc">
              <code>ZADD leaderboard 1500 &quot;alice&quot;</code> ile skor ekle.
              Aynı oyuncu tekrar eklenirse skor üzerine yazılır — çift kayıt olmaz.
              <code>ZREVRANGE leaderboard 0 9 WITHSCORES</code> ile en iyi 10 oyuncuyu skorlarıyla birlikte anlık getir.
              <code>ZRANK</code> ile oyuncuya &quot;Sen 1.453. sıradasın&quot; bilgisini göster.
              Milyonlarca oyuncuda bile anlık sonuç döner.
            </div>
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderLeft: '3px solid var(--accent-blue)' }}>
              <strong>Senaryo:</strong> Bir mobil oyunda 5 milyon oyuncu var. Ahmet oyun bitirdiğinde skoru 2.300 oluyor.
              Sorted Set sayesinde Ahmet&apos;in skoru anında güncellenir, sıralama tablosu otomatik yeniden düzenlenir
              ve Ahmet&apos;e &quot;Tebrikler, 12.847. sıraya yükseldin!&quot; mesajı gösterilir — tüm bunlar milisaniyeler içinde gerçekleşir.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🛒</div>
            <div className="feature-title">Trend Ürünler</div>
            <div className="feature-desc">
              Bir ürün her satıldığında <code>ZINCRBY trending:products 1 &quot;iphone&quot;</code> ile skorunu 1 artır.
              Her beğenide, her yorumda da aynı mantıkla artırılabilir — böylece popülerlik skoru oluşur.
              Gün sonunda <code>ZREVRANGE trending:products 0 9</code> ile en popüler 10 ürünü listele.
            </div>
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderLeft: '3px solid var(--accent-blue)' }}>
              <strong>Senaryo:</strong> Bir e-ticaret sitesinde bugün iPhone 340 kez, AirPods 210 kez, MacBook 185 kez satıldı.
              Her satışta ilgili ürünün skoru 1 artırılıyor. Kullanıcı anasayfayı açtığında &quot;Bugün En Çok Satanlar&quot;
              listesinde bu ürünler otomatik olarak sıralı şekilde görünüyor — hiçbir ekstra hesaplama gerekmeden.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>⏰</div>
            <div className="feature-title">Zamanlanmış Görevler</div>
            <div className="feature-desc">
              <code>ZADD scheduled:tasks 1719928800 &quot;rapor-gonder&quot;</code> — score olarak görevin çalışması gereken zamanın
              Unix timestamp&apos;ini ver. Bir worker periyodik olarak <code>ZRANGE</code> ile zamanı gelen görevleri çeker ve çalıştırır.
              İşlenen görev <code>ZREM</code> ile silinir. Cron job&apos;lara alternatif, dağıtık sistemlerde güvenilir bir yaklaşım.
            </div>
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderLeft: '3px solid var(--accent-blue)' }}>
              <strong>Senaryo:</strong> Bir bildirim sistemi düşün: &quot;Yarın saat 09:00&apos;da kullanıcıya hatırlatma gönder&quot;,
              &quot;3 gün sonra kampanya maili at&quot;, &quot;Her ayın 1&apos;inde fatura oluştur&quot;. Bu görevlerin hepsi score olarak
              çalışma zamanıyla kaydedilir. Her saniye bir worker &quot;şu anki zamandan küçük score&apos;lu görev var mı?&quot;
              diye bakar, varsa çalıştırır ve listeden siler.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🚦</div>
            <div className="feature-title">Rate Limiting</div>
            <div className="feature-desc">
              Her API isteğinde <code>ZADD ratelimit:user123 &lt;timestamp&gt; &lt;request-id&gt;</code> ile isteği kaydet.
              Score olarak timestamp kullanıldığı için zaman penceresi dışındakileri <code>ZREMRANGEBYSCORE</code> ile temizle,
              <code>ZCARD</code> ile penceredeki istek sayısını say. Limit aşılmışsa isteği reddet.
            </div>
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderLeft: '3px solid var(--accent-blue)' }}>
              <strong>Senaryo:</strong> Bir API&apos;ye &quot;dakikada en fazla 10 istek&quot; kuralı koydun. Kullanıcı 14:00:00&apos;dan itibaren
              istekler göndermeye başlıyor. Her istek zamanıyla birlikte kaydediliyor. 11. istek geldiğinde sistem
              &quot;son 60 saniyede 10 istek var&quot; deyip reddediyor. Ama 14:00:45&apos;te ilk istekler pencereden düşünce
              yeni isteklere tekrar izin veriliyor — sabit blok yerine kayan pencere ile adil bir kontrol sağlanıyor.
            </div>
          </div>
        </div>
        <h4>Temel Komutlar</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Açıklama</th></tr>
          </thead>
          <tbody>
            <tr><td><code>ZADD</code></td><td>Eleman ekle (score ile)</td></tr>
            <tr><td><code>ZRANGE</code></td><td>Sıraya göre elemanlar getir</td></tr>
            <tr><td><code>ZRANK</code></td><td>Elemanın sırasını öğren</td></tr>
            <tr><td><code>ZSCORE</code></td><td>Elemanın puanını öğren</td></tr>
            <tr><td><code>ZREM</code></td><td>Elemanı sil</td></tr>
          </tbody>
        </table>
      </TheorySection>

      <div className="two-columns" style={{ marginBottom: 16 }}>
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title">
              <TbSortAscending className="icon" />
              Sorted Set Operations
            </div>

            <div className="form-row">
              <InputField label="Key" value={key} onChange={setKey} placeholder="Sorted set key" />
            </div>

            <div className="form-row">
              <InputField label="Member" value={member} onChange={setMember} placeholder="Member name" />
              <InputField label="Score" value={score} onChange={setScore} placeholder="Score" type="number" />
            </div>

            <div className="button-group" style={{ marginBottom: 16 }}>
              <ActionButton variant="primary" onClick={handleZadd}>ZADD</ActionButton>
              <ActionButton variant="info" onClick={handleZrange}>ZRANGE</ActionButton>
              <ActionButton variant="success" onClick={handleZrank}>ZRANK</ActionButton>
              <ActionButton variant="success" onClick={handleZscore}>ZSCORE</ActionButton>
              <ActionButton variant="danger" onClick={handleZrem}>ZREM</ActionButton>
            </div>

            {error && <div className="error-message">{error}</div>}

            {singleResult !== null && (
              <ResultDisplay title={singleResultTitle} value={singleResult} />
            )}
          </div>

        </div>

        <div className="card">
          <div className="card-title">Ranked Members</div>
          {displayItems.length === 0 ? (
            <div className="empty-state">No members yet. Add members with ZADD.</div>
          ) : (
            <div className="ranked-list">
              {displayItems.map((item, index) => (
                <div key={index} className="ranked-item">
                  <span className="rank">#{item.rank}</span>
                  <span className="member">{item.member}</span>
                  {item.score !== null && (
                    <span className="score">{item.score}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CommandLog commands={commands} onClear={() => setCommands([])} />

      {/* Soru-Cevap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Soru & Cevap</div>
        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Bir leaderboard için neden Set değil de Sorted Set kullanırız?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Set&apos;te elemanlar sırasızdır — &quot;en yüksek skora sahip 10 oyuncu&quot; sorusunu cevaplayamaz.
            Sorted Set&apos;te her elemanın bir score&apos;u vardır ve otomatik sıralanır.
            <code>ZREVRANGE leaderboard 0 9</code> ile en iyi 10&apos;u anında getirirsin.
            Ayrıca <code>ZRANK</code> ile &quot;sen 1453. sıradasın&quot; bilgisini de verebilirsin.
          </div>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Rate limiting için Sorted Set kullanılıyor. Score olarak ne saklanıyor ve neden?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Score olarak isteğin <strong>timestamp</strong>&apos;i (zaman damgası) saklanır. Bu sayede
            <code>ZREMRANGEBYSCORE</code> ile zaman penceresi dışındaki eski istekleri silebilirsin.
            Örneğin &quot;son 60 saniyedeki istekler&quot; = score&apos;u (now - 60s) ile now arasında olan elemanlar.
            Timestamp doğal bir sıralama sağladığı için sliding window pattern&apos;i mümkün olur.
          </div>
        </details>
      </div>
    </div>
  );
}

export default SortedSetPage;
