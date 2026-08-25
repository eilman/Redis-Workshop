import { useState, useEffect } from 'react';
import { TbDatabase, TbStack2 } from 'react-icons/tb';
import { cacheApi, pipelineApi } from '../../api/redisApi';
import InputField from '../common/InputField';
import ActionButton from '../common/ActionButton';
import CommandLog from '../common/CommandLog';
import TheorySection from '../common/TheorySection';

function CachePage() {
  const [userId, setUserId] = useState('1');
  const [lastFetch, setLastFetch] = useState(null);
  const [stats, setStats] = useState(null);
  const [fetchHistory, setFetchHistory] = useState([]);
  const [pipelineCount, setPipelineCount] = useState('100');
  const [pipelineResult, setPipelineResult] = useState(null);
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

  const loadStats = async () => {
    try {
      const res = await cacheApi.stats();
      addCommand(res.data);
      setStats(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchUser = async () => {
    if (!userId.trim()) return;
    try {
      const startTime = performance.now();
      const res = await cacheApi.getUser(userId);
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      addCommand(res.data);

      // Determine if it was a cache hit or miss based on the command/explanation
      const explanation = (res.data.explanation || '').toLowerCase();
      const command = (res.data.command || '').toLowerCase();
      const isHit = explanation.includes('hit') || explanation.includes('cache') ||
        command.includes('get') || res.data.executionTimeMs <= 2;

      const fetchResult = {
        userId,
        data: res.data.result,
        isHit: explanation.includes('hit') ? true : explanation.includes('miss') ? false : isHit,
        responseTime,
        executionTimeMs: res.data.executionTimeMs,
        timestamp: new Date().toLocaleTimeString(),
      };

      setLastFetch(fetchResult);
      setFetchHistory((prev) => [fetchResult, ...prev].slice(0, 20));

      // Refresh stats after fetch
      try {
        const statsRes = await cacheApi.stats();
        setStats(statsRes.data.result);
      } catch {
        // ignore stats error
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleInvalidate = async () => {
    if (!userId.trim()) return;
    try {
      const res = await cacheApi.invalidateUser(userId);
      addCommand(res.data);
      setLastFetch(null);
      await loadStats();
    } catch (err) {
      handleError(err);
    }
  };

  const handleReset = async () => {
    try {
      const res = await cacheApi.reset();
      addCommand(res.data);
      setStats(null);
      setLastFetch(null);
      setFetchHistory([]);
      await loadStats();
    } catch (err) {
      handleError(err);
    }
  };

  // Parse stats
  const parseStats = () => {
    if (!stats) return { hits: 0, misses: 0, hitRate: '0%', total: 0 };
    if (typeof stats === 'object') {
      const hits = Number(stats.hits || stats.cacheHits || 0);
      const misses = Number(stats.misses || stats.cacheMisses || 0);
      const total = hits + misses;
      const hitRate = total > 0 ? ((hits / total) * 100).toFixed(1) + '%' : '0%';
      return { hits, misses, hitRate, total };
    }
    return { hits: 0, misses: 0, hitRate: '0%', total: 0 };
  };

  const currentStats = parseStats();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <TbDatabase className="icon" />
          Cache Pattern
        </h1>
      </div>

      <TheorySection title="Cache Pattern - Temel Kavramlar">
        <p>
          Cache (önbellek), sık erişilen verileri veritabanı yerine Redis&apos;te (RAM&apos;de) saklayarak
          uygulamanın çok daha hızlı yanıt vermesini sağlar. Veritabanı sorgusu ~10-100ms sürerken,
          Redis&apos;ten okuma ~0.1ms sürer. İlk istekte veri veritabanından çekilip Redis&apos;e yazılır,
          sonraki isteklerde doğrudan Redis&apos;ten okunur. Bu sayede veritabanı yükü azalır ve
          kullanıcı deneyimi iyileşir.
        </p>
        <h4>Cache Hit ve Cache Miss</h4>
        {/* Görsel: Hit vs Miss kutuları */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{
            flex: '1 1 200px', background: 'rgba(0,255,136,0.1)', border: '2px solid var(--accent-green)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: '1.4rem' }}>✅</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '1rem' }}>Cache Hit</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Veri Redis'te <strong>bulundu</strong>. Anında döndürülür.
            </div>
            <div style={{
              marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              color: 'var(--accent-green)', background: 'var(--bg-input)',
              padding: '4px 8px', borderRadius: 'var(--radius-sm)',
            }}>
              ~0.1ms
            </div>
          </div>
          <div style={{
            flex: '1 1 200px', background: 'rgba(231,76,60,0.1)', border: '2px solid var(--redis-red)',
            borderRadius: 'var(--radius-sm)', padding: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: '1.4rem' }}>❌</span>
              <span style={{ fontWeight: 700, color: 'var(--redis-red)', fontSize: '1rem' }}>Cache Miss</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Veri Redis'te <strong>bulunamadı</strong>. DB'den çekilir, Redis'e yazılır, döndürülür.
            </div>
            <div style={{
              marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              color: 'var(--redis-red)', background: 'var(--bg-input)',
              padding: '4px 8px', borderRadius: 'var(--radius-sm)',
            }}>
              ~5-50ms
            </div>
          </div>
        </div>
        <h4>Cache-Aside (Lazy Loading)</h4>
        <p>
          Uygulama önce Redis'i kontrol eder. <strong>Cache hit</strong> durumunda veri anında Redis'ten döner.
          <strong> Cache miss</strong> durumunda veri veritabanından çekilir, Redis'e yazılır ve döndürülür.
          Aynı kullanıcıyı iki kez çekerek farkı gözlemleyin!
        </p>
        <div className="step-flow">
          <div className="step-flow-item">
            <div className="step-flow-number">1</div>
            <div className="step-flow-content">
              <strong>Cache'i Kontrol Et</strong>
              <p><code>GET cache:user:{'{id}'}</code></p>
            </div>
          </div>
          <div className="step-flow-item success">
            <div className="step-flow-number">2</div>
            <div className="step-flow-content">
              <strong>Cache Hit → Veriyi Döndür</strong>
              <p>Veri Redis'te bulundu, anında döndürülür.</p>
            </div>
          </div>
          <div className="step-flow-item info">
            <div className="step-flow-number">3</div>
            <div className="step-flow-content">
              <strong>Cache Miss → DB'den oku, Redis'e yaz, döndür</strong>
              <p>Veri Redis'te bulunamadı. Veritabanından çekilir, Redis'e yazılır ve döndürülür.</p>
            </div>
          </div>
        </div>
        <h4>Cache Pattern&apos;leri</h4>
        <div className="feature-grid" style={{ marginBottom: 16 }}>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>📖</div>
            <div className="feature-title">Cache-Aside</div>
            <div className="feature-desc">
              Uygulama cache&apos;i yönetir. Okumada önce cache&apos;e bakılır, miss ise DB&apos;den çekilip cache&apos;e yazılır. <strong>En yaygın pattern.</strong>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>✍️</div>
            <div className="feature-title">Write-Through</div>
            <div className="feature-desc">
              Her yazma işleminde cache ve DB <strong>aynı anda</strong> güncellenir. Veri tutarlılığı yüksek, yazma yavaş.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>⏳</div>
            <div className="feature-title">Write-Behind</div>
            <div className="feature-desc">
              Önce cache&apos;e yazılır, DB&apos;ye <strong>asenkron</strong> yazılır. Yazma hızlı ama veri kaybı riski var.
            </div>
          </div>
        </div>

        <h4>Hangi Pattern Ne Zaman Seçilmeli?</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Senaryo</th><th>Önerilen Pattern</th><th>Neden?</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>E-ticaret ürün kataloğu, kullanıcı profili</td>
              <td><code>Cache-Aside</code></td>
              <td>Okuma ağırlıklı, veri seyrek değişir. Miss olunca DB&apos;den çekilip cache&apos;e yazılır.</td>
            </tr>
            <tr>
              <td>Finansal işlemler, ödeme sistemi, stok takibi</td>
              <td><code>Write-Through</code></td>
              <td>Tutarlılık kritik. Cache ve DB her zaman senkron kalmalı, eski veri göstermek kabul edilemez.</td>
            </tr>
            <tr>
              <td>Log toplama, analitik, IoT sensör verisi</td>
              <td><code>Write-Behind</code></td>
              <td>Yazma yoğun, anlık tutarlılık önemsiz. Yüksek throughput gerekli, küçük veri kaybı tolere edilebilir.</td>
            </tr>
            <tr>
              <td>Sosyal medya feed, haber akışı</td>
              <td><code>Cache-Aside</code></td>
              <td>Okuma çok yoğun, veri gecikmeli güncellenebilir. Popüler içerik doğal olarak cache&apos;te kalır.</td>
            </tr>
            <tr>
              <td>Kullanıcı oturumu (session), sepet bilgisi</td>
              <td><code>Write-Through</code></td>
              <td>Her güncelleme anında hem cache&apos;te hem DB&apos;de olmalı. Sepet kaybı kullanıcı deneyimini bozar.</td>
            </tr>
            <tr>
              <td>Gerçek zamanlı oyun skoru, leaderboard</td>
              <td><code>Write-Behind</code></td>
              <td>Saniyede binlerce skor güncellemesi gelir. Anlık DB yazımı darboğaz olur, asenkron yazım idealdir.</td>
            </tr>
          </tbody>
        </table>
        <div className="tip-box">
          <strong>Pratik kural:</strong> Emin değilseniz <code>Cache-Aside</code> ile başlayın — en basit, en güvenli ve en yaygın pattern&apos;dir. Yazma yoğunluğu arttıkça Write-Through veya Write-Behind&apos;a geçiş değerlendirin.
        </div>

        <h4>Cache Sorunları ve Çözümleri</h4>

        {/* ---- 1. Cache Stampede ---- */}
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
          padding: 16, marginBottom: 16, overflowX: 'auto',
        }}>
          <div style={{ textAlign: 'center', fontWeight: 700, color: 'var(--redis-red)', fontSize: '0.85rem', marginBottom: 12 }}>
            1. Cache Stampede (Thundering Herd)
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            Popüler bir key expire olduğunda, <strong>aynı anda yüzlerce/binlerce istek</strong> cache miss alır ve hepsi DB&apos;ye yönelir. DB bu ani yükü kaldıramaz ve çökebilir.
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, minWidth: 400, fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'center' }}>
              {['Req 1', 'Req 2', 'Req 3', 'Req N'].map((r) => (
                <div key={r} style={{
                  background: 'rgba(231,76,60,0.15)', border: '1px solid var(--redis-red)',
                  borderRadius: 'var(--radius-sm)', padding: '3px 10px', color: 'var(--redis-red)', fontWeight: 600, fontSize: '0.7rem',
                }}>
                  {r}
                </div>
              ))}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>&rarr;</div>
            <div style={{
              background: 'rgba(255,184,0,0.15)', border: '2px solid var(--accent-orange)',
              borderRadius: 'var(--radius-sm)', padding: '10px 14px', textAlign: 'center',
            }}>
              <div style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.8rem' }}>Cache MISS</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Key expired</div>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>&rarr;</div>
            <div style={{
              background: 'rgba(231,76,60,0.15)', border: '2px solid var(--redis-red)',
              borderRadius: 'var(--radius-sm)', padding: '10px 14px', textAlign: 'center',
            }}>
              <div style={{ color: 'var(--redis-red)', fontWeight: 700, fontSize: '0.8rem' }}>DB Overload!</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>N aynı sorgu</div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-green)', marginBottom: 6 }}>Çözümleri:</div>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 20 }}>
              <li><strong>Mutex Lock:</strong> İlk miss alan istek bir lock alır (<code>SET lock:key NX EX 5</code>), DB&apos;den çeker ve cache&apos;e yazar. Diğer istekler lock bitene kadar bekler, sonra cache&apos;ten okur.</li>
              <li><strong>Early Refresh:</strong> Key expire olmadan <strong>önce</strong> yenilenir. Örneğin TTL 60s ise, 50s&apos;de arka planda yeni veri çekilip cache güncellenir. Kullanıcı hiç miss görmez.</li>
              <li><strong>Stale-While-Revalidate:</strong> Eski veriyi hemen döndür, arka planda yenisini çek. Kullanıcı bekleme yapmaz ama kısa süre eski veri görebilir.</li>
            </ul>
          </div>
        </div>

        {/* ---- 2. Cache Penetration ---- */}
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
          padding: 16, marginBottom: 16, overflowX: 'auto',
        }}>
          <div style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-orange)', fontSize: '0.85rem', marginBottom: 12 }}>
            2. Cache Penetration
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            <strong>Var olmayan veri</strong> sürekli sorgulanır. Cache&apos;te bulunamaz (çünkü hiç yok), her seferinde DB&apos;ye gidilir. Kötü niyetli saldırılarda (ör. rastgele ID&apos;lerle) DB&apos;yi ezebilir.
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginBottom: 14,
          }}>
            <div style={{
              background: 'rgba(231,76,60,0.15)', border: '1px solid var(--redis-red)',
              borderRadius: 'var(--radius-sm)', padding: '6px 12px', color: 'var(--redis-red)', fontWeight: 600, fontSize: '0.7rem',
            }}>
              GET user:999999
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>&rarr;</div>
            <div style={{
              background: 'rgba(255,184,0,0.15)', border: '1px solid var(--accent-orange)',
              borderRadius: 'var(--radius-sm)', padding: '6px 12px', color: 'var(--accent-orange)', fontWeight: 600, fontSize: '0.7rem',
            }}>
              Cache: nil
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>&rarr;</div>
            <div style={{
              background: 'rgba(255,184,0,0.15)', border: '1px solid var(--accent-orange)',
              borderRadius: 'var(--radius-sm)', padding: '6px 12px', color: 'var(--accent-orange)', fontWeight: 600, fontSize: '0.7rem',
            }}>
              DB: nil
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>&rarr;</div>
            <div style={{
              background: 'rgba(231,76,60,0.15)', border: '1px solid var(--redis-red)',
              borderRadius: 'var(--radius-sm)', padding: '6px 12px', color: 'var(--redis-red)', fontWeight: 600, fontSize: '0.7rem',
            }}>
              Her seferinde DB&apos;ye!
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-green)', marginBottom: 6 }}>Çözümleri:</div>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 20 }}>
              <li><strong>Null Caching:</strong> DB&apos;den null dönen sonuçları da cache&apos;e yaz (<code>SET user:999999 &quot;NULL&quot; EX 60</code>). Kısa TTL ile aynı sorgu tekrar DB&apos;ye gitmez.</li>
              <li><strong>Bloom Filter:</strong> İstekten önce bir Bloom Filter ile key&apos;in var olup olmadığını kontrol et. Yoksa direkt reddedilir, DB&apos;ye hiç gidilmez. Bellek dostu, yanlış pozitif olabilir ama yanlış negatif vermez.</li>
              <li><strong>Input Validation:</strong> Geçersiz ID formatlarını (negatif sayılar, çok büyük değerler) uygulama katmanında reddet.</li>
            </ul>
          </div>
        </div>

        {/* ---- 3. Cache Avalanche ---- */}
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
          padding: 16, marginBottom: 16, overflowX: 'auto',
        }}>
          <div style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.85rem', marginBottom: 12 }}>
            3. Cache Avalanche (Çığ Etkisi)
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            <strong>Çok sayıda key aynı anda expire olur</strong> ve tüm istekler eş zamanlı olarak DB&apos;ye yönelir. Stampede tek bir key içindir, avalanche ise <strong>toplu expire</strong> durumudur. Redis sunucusu çökerse de tüm key&apos;ler aynı anda kaybolur.
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, fontFamily: 'var(--font-mono)', fontSize: '0.72rem', marginBottom: 14, flexWrap: 'wrap',
          }}>
            {['user:1', 'user:2', 'product:5', 'session:x', 'config:app'].map((k) => (
              <div key={k} style={{
                background: 'rgba(231,76,60,0.15)', border: '1px solid var(--redis-red)',
                borderRadius: 'var(--radius-sm)', padding: '4px 8px', color: 'var(--redis-red)', fontWeight: 600,
                textDecoration: 'line-through', opacity: 0.8,
              }}>
                {k}
              </div>
            ))}
            <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>&rarr;</div>
            <div style={{
              background: 'rgba(231,76,60,0.15)', border: '2px solid var(--redis-red)',
              borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: 'var(--redis-red)', fontWeight: 700, fontSize: '0.75rem',
            }}>
              Hepsi aynı anda expire!
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-green)', marginBottom: 6 }}>Çözümleri:</div>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 20 }}>
              <li><strong>TTL Jitter:</strong> Her key&apos;e sabit TTL yerine <strong>rastgele bir ek süre</strong> ekle. Örneğin <code>TTL = 3600 + random(0, 300)</code>. Key&apos;ler farklı zamanlarda expire olur, yük dağılır.</li>
              <li><strong>Multi-Layer Cache:</strong> Redis önüne bir L1 cache (uygulama içi, ör. Caffeine/Guava) koy. Redis çökse bile L1 kısa süre veri sunmaya devam eder.</li>
              <li><strong>Circuit Breaker:</strong> DB&apos;ye giden istek sayısı eşiği aşarsa, devre kesici devreye girer. Yeni istekler hemen fallback yanıt alır, DB korunur.</li>
              <li><strong>Redis HA (Sentinel/Cluster):</strong> Redis&apos;i yüksek erişilebilirlikle yapılandır. Tek node çökse bile replica devralır, tüm cache kaybolmaz.</li>
            </ul>
          </div>
        </div>

        {/* ---- 4. Cache Invalidation ---- */}
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
          padding: 16, marginBottom: 16, overflowX: 'auto',
        }}>
          <div style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.85rem', marginBottom: 12 }}>
            4. Cache Invalidation (Cache Geçersiz Kılma)
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            &quot;Bilgisayar bilimindeki en zor iki şey: cache invalidation ve isimlendirme.&quot; — Veri değiştiğinde cache&apos;teki eski kopyanın <strong>ne zaman ve nasıl</strong> güncelleneceği sorunu.
          </p>
          <div className="feature-grid" style={{ marginBottom: 14 }}>
            <div className="feature-card">
              <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🕐</div>
              <div className="feature-title">TTL-Based</div>
              <div className="feature-desc">
                Her key&apos;e bir <code>EXPIRE</code> süresi koy. Süre dolunca otomatik silinir. En basit yöntem ama veri değişse bile TTL dolana kadar <strong>eski veri</strong> sunulur.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ fontSize: '1.6rem' }}>📡</div>
              <div className="feature-title">Event-Based</div>
              <div className="feature-desc">
                Veri değiştiğinde bir event yayınla (Pub/Sub, Kafka, webhook). Dinleyen servisler ilgili cache key&apos;lerini anında siler. <strong>Gerçek zamanlı</strong> tutarlılık sağlar.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🗑️</div>
              <div className="feature-title">Manual (DEL)</div>
              <div className="feature-desc">
                Uygulama kodu veriyi güncellerken açıkça <code>DEL cache:key</code> çağırır. Basit ama uygulama genelinde <strong>her güncelleme noktası</strong> unutulmamalı.
              </div>
            </div>
          </div>
          <div className="tip-box">
            <strong>En iyi pratik:</strong> TTL-based + Event-based birlikte kullanın. TTL bir &quot;güvenlik ağı&quot; olarak kalır (event kaçırılsa bile veri sonunda yenilenir), event-based ise anlık tutarlılık sağlar.
          </div>
        </div>
        <h4>Eviction Policy (Tahliye Politikası)</h4>
        <p>
          <strong>RAM sınırsız değildir!</strong> Redis'te <code>maxmemory</code> limiti aşıldığında, hangi key'lerin silineceğini eviction policy belirler.
        </p>
        {/* Görsel: LRU vs LFU karşılaştırması */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{
            flex: '1 1 200px', background: 'rgba(0,212,255,0.1)', border: '2px solid var(--accent-blue)',
            borderRadius: 'var(--radius-sm)', padding: 14, textAlign: 'center',
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.95rem', marginBottom: 6 }}>LRU</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Least Recently Used</div>
            <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>🕐</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              En son <strong>ne zaman</strong> kullanıldığına bakar. Uzun süredir erişilmeyenler silinir.
            </div>
          </div>
          <div style={{
            flex: '1 1 200px', background: 'rgba(255,184,0,0.1)', border: '2px solid var(--accent-orange)',
            borderRadius: 'var(--radius-sm)', padding: 14, textAlign: 'center',
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-orange)', fontSize: '0.95rem', marginBottom: 6 }}>LFU</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Least Frequently Used</div>
            <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>📊</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Kaç kez</strong> kullanıldığına bakar. Az erişilenler silinir.
            </div>
          </div>
        </div>
        <table className="theory-table">
          <thead>
            <tr><th>Policy</th><th>Açıklama</th><th>Kullanım</th></tr>
          </thead>
          <tbody>
            <tr><td><code>noeviction</code></td><td>Yazma hatası verir, hiçbir şey silmez</td><td>Veri kaybının kabul edilemez olduğu durumlar</td></tr>
            <tr><td><code>allkeys-lru</code></td><td>En az kullanılan key silinir (tüm key'ler)</td><td>Genel amaçlı cache (en yaygın)</td></tr>
            <tr><td><code>allkeys-lfu</code></td><td>En az erişilen key silinir (frekans bazlı)</td><td>Erişim sıklığı önemli olan cache</td></tr>
            <tr><td><code>volatile-lru</code></td><td>TTL'li key'ler arasından LRU</td><td>Kalıcı + geçici verinin bir arada olduğu durumlar</td></tr>
            <tr><td><code>volatile-lfu</code></td><td>TTL'li key'ler arasından LFU</td><td>TTL'li veriler için frekans bazlı</td></tr>
            <tr><td><code>volatile-ttl</code></td><td>En yakın expire olan key silinir</td><td>TTL öncelikli temizlik</td></tr>
            <tr><td><code>allkeys-random</code></td><td>Rastgele key silinir</td><td>Tüm key'lerin eşit öneme sahip olduğu durumlar</td></tr>
            <tr><td><code>volatile-random</code></td><td>TTL'li key'lerden rastgele silinir</td><td>Basit geçici veri temizliği</td></tr>
          </tbody>
        </table>
        <div className="tip-box">
          <strong>İpucu:</strong> Çoğu cache senaryosunda <code>allkeys-lru</code> en iyi seçimdir. <code>maxmemory</code> ayarını sunucu RAM'inin %70-80'i olarak ayarlayın.
        </div>
      </TheorySection>

      <div className="two-columns" style={{ marginBottom: 16 }}>
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title">
              <TbDatabase className="icon" />
              Fetch User
            </div>

            <div className="form-row">
              <InputField label="User ID" value={userId} onChange={setUserId} placeholder="e.g. 1, 2, 3" />
            </div>

            <div className="button-group" style={{ marginBottom: 16 }}>
              <ActionButton variant="primary" onClick={handleFetchUser}>Fetch User</ActionButton>
              <ActionButton variant="danger" onClick={handleInvalidate}>Invalidate Cache</ActionButton>
              <ActionButton variant="warning" onClick={handleReset}>Reset All</ActionButton>
            </div>

            {error && <div className="error-message">{error}</div>}

            {lastFetch && (
              <div className="result-display fade-in">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <span className={lastFetch.isHit ? 'status-hit' : 'status-miss'}
                    style={{ fontSize: '1.2rem' }}>
                    {lastFetch.isHit ? 'CACHE HIT' : 'CACHE MISS'}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                  }}>
                    {lastFetch.executionTimeMs}ms (server) / {lastFetch.responseTime}ms (total)
                  </span>
                </div>
                <div className="result-display-title">User Data</div>
                <pre className="result-display-value" style={{ whiteSpace: 'pre-wrap' }}>
                  {typeof lastFetch.data === 'object'
                    ? JSON.stringify(lastFetch.data, null, 2)
                    : String(lastFetch.data)}
                </pre>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title">Fetch History</div>
            {fetchHistory.length === 0 ? (
              <div className="empty-state">No fetches yet. Try fetching a user.</div>
            ) : (
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {fetchHistory.map((entry, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 10px',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      user:{entry.userId}
                    </span>
                    <span className={entry.isHit ? 'status-hit' : 'status-miss'}>
                      {entry.isHit ? 'HIT' : 'MISS'}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {entry.executionTimeMs}ms
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
          <div className="card-title">Cache Statistics</div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
                {currentStats.hits}
              </div>
              <div className="stat-label">Cache Hits</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--redis-red)' }}>
                {currentStats.misses}
              </div>
              <div className="stat-label">Cache Misses</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {currentStats.hitRate}
              </div>
              <div className="stat-label">Hit Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--text-secondary)' }}>
                {currentStats.total}
              </div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>

          {currentStats.total > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 8,
              }}>
                Hit Rate Visualization
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${currentStats.total > 0
                      ? ((currentStats.hits / currentStats.total) * 100)
                      : 0}%`,
                    backgroundColor: 'var(--accent-green)',
                  }}
                >
                  {currentStats.hitRate}
                </div>
              </div>
            </div>
          )}

          {stats && typeof stats === 'object' && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 8,
              }}>
                Raw Stats
              </div>
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-input)',
                padding: 12,
                borderRadius: 'var(--radius-sm)',
                whiteSpace: 'pre-wrap',
              }}>
                {JSON.stringify(stats, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Pipelining Section */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">
          <TbStack2 className="icon" />
          Pipelining
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.7 }}>
            Pipelining, Redis&apos;e birden fazla komutu <strong>tek seferde toplu göndermeyi</strong> sağlayan bir performans tekniğidir.
            Normalde her komut için ayrı bir gidiş-dönüş (round-trip) gerekir — uygulama komutu gönderir, yanıtı bekler, sonra bir sonrakini gönderir.
            Pipeline ile tüm komutlar arka arkaya gönderilir ve yanıtlar toplu olarak alınır.
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.7 }}>
            Bunu şöyle düşünebiliriz: markette her ürün için ayrı ayrı kasaya gitmek yerine,
            tüm ürünleri sepete koyup <strong>tek seferde</strong> kasaya gitmek gibi. Özellikle ağ gecikmesinin (latency) yüksek olduğu
            durumlarda veya çok sayıda komut gönderilmesi gereken senaryolarda (toplu veri yükleme, cache ısıtma)
            dramatik performans artışı sağlar.
          </p>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: 8 }}>Normal vs Pipeline</h4>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            {/* Normal Mod */}
            <div style={{
              flex: '1 1 280px', background: 'rgba(231,76,60,0.08)', border: '2px solid var(--redis-red)',
              borderRadius: 'var(--radius-sm)', padding: 16,
            }}>
              <div style={{ fontWeight: 700, color: 'var(--redis-red)', fontSize: '0.95rem', marginBottom: 8 }}>Normal Mod</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.6 }}>
                Her komut tek tek gönderilir, yanıtı bekler, sonra sıradakine geçer.
              </p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
                Uygulama → SET key1 → Redis → OK<br />
                Uygulama → SET key2 → Redis → OK<br />
                Uygulama → SET key3 → Redis → OK
              </div>
              <div style={{ marginTop: 10, fontSize: '0.78rem', color: 'var(--redis-red)', fontWeight: 600 }}>
                3 komut = 3 gidiş-dönüş
              </div>
            </div>
            {/* Pipeline Mod */}
            <div style={{
              flex: '1 1 280px', background: 'rgba(0,255,136,0.08)', border: '2px solid var(--accent-green)',
              borderRadius: 'var(--radius-sm)', padding: 16,
            }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.95rem', marginBottom: 8 }}>Pipeline Mod</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.6 }}>
                Tüm komutlar yanıt beklemeden arka arkaya gönderilir, yanıtlar toplu döner.
              </p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
                Uygulama → SET key1<br />
                {'               '}→ SET key2<br />
                {'               '}→ SET key3 → Redis → OK, OK, OK
              </div>
              <div style={{ marginTop: 10, fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                3 komut = 1 gidiş-dönüş
              </div>
            </div>
          </div>
        </div>

        <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: 8 }}>Benchmark</h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.7 }}>
          Aşağıdaki test, belirlediğin sayıda SET+GET işlemini önce normal modda sonra pipeline modda çalıştırır
          ve süreleri karşılaştırır. İşlem sayısını artırdıkça pipeline&apos;ın farkı daha belirgin olur.
        </p>
        <div className="form-row">
          <InputField label="İşlem Sayısı (SET+GET)" value={pipelineCount} onChange={setPipelineCount} placeholder="100" type="number" />
        </div>
        <ActionButton variant="primary" onClick={async () => {
          try {
            const res = await pipelineApi.benchmark(Number(pipelineCount));
            addCommand(res.data);
            setPipelineResult(res.data.result);
          } catch (err) {
            handleError(err);
          }
        }}>Run Benchmark</ActionButton>

        {pipelineResult && (
          <div className="result-display fade-in" style={{ marginTop: 12 }}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--redis-red)' }}>
                  {pipelineResult.normalMs}ms
                </div>
                <div className="stat-label">Normal</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
                  {pipelineResult.pipelineMs}ms
                </div>
                <div className="stat-label">Pipeline</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>
                  {pipelineResult.speedup}
                </div>
                <div className="stat-label">Speedup</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--text-secondary)' }}>
                  {pipelineResult.operationsPerBatch}
                </div>
                <div className="stat-label">Toplam İşlem</div>
              </div>
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
            Bir restoranda garson her sipariş için mutfağa gitmek yerine masanın yanındaki servis arabasından veriyor. Bu ne kazandırır, ne risk taşır?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Servis arabası cache&apos;tir — hızlıca servis yapılır, mutfağa (veritabanına) her seferinde gitmek gerekmez.
            Ama risk şu: mutfakta menü değişti, fiyatlar güncellendi — arabadaki bilgi hâlâ eskiyse müşteriye yanlış fiyat söylersin.
            Cache&apos;te de aynı durum geçerlidir: hız kazanırsın ama verinin güncelliğini takip etmelisin.
          </div>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Bir haber sitesinde 1 milyon kişi aynı anda ana sayfayı açıyor. Her biri için veritabanına gidilse ne olur?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Veritabanı bu kadar isteği kaldıramaz ve çöker — site erişilemez hale gelir.
            Ama ana sayfa içeriği cache&apos;e alınırsa, 1 milyon kişinin hepsi cache&apos;ten okur, veritabanına sadece cache süresi dolduğunda bir kez gidilir.
            Bu yüzden yüksek trafikli sitelerde cache kullanmak tercih değil, zorunluluktur.
          </div>
        </details>
      </div>
    </div>
  );
}

export default CachePage;
