import { Link } from 'react-router-dom';
import { VscSymbolString } from 'react-icons/vsc';
import {
  TbPresentation,
  TbList,
  TbCirclesRelation,
  TbHash,
  TbSortAscending,
  TbClock,
  TbDatabase,
  TbKey,
  TbBroadcast,
  TbUser,
  TbDeviceDesktop,
  TbServer,
  TbRocket,
  TbLayoutGrid,
  TbShieldCheck,
  TbBrowser,
  TbDeviceMobile,
  TbTerminal2,
  TbCpu,
  TbCommand,
  TbStack2,
  TbArrowsExchange,
  TbShieldLock,
  TbBolt,
  TbChartBar,
  TbLock,
  TbMessageCircle,
} from 'react-icons/tb';

const modules = [
  { num: 1, path: '/strings', label: 'Strings', icon: VscSymbolString, desc: 'Temel veri yapısı, counter, cache' },
  { num: 2, path: '/lists', label: 'Lists', icon: TbList, desc: 'Linked list, kuyruk, yığın' },
  { num: 3, path: '/sets', label: 'Sets', icon: TbCirclesRelation, desc: 'Benzersiz elemanlar, küme operasyonları' },
  { num: 4, path: '/hashes', label: 'Hashes', icon: TbHash, desc: 'Nesne saklama, field-value çiftleri' },
  { num: 5, path: '/sorted-sets', label: 'Sorted Sets', icon: TbSortAscending, desc: 'Skorlu sıralama, leaderboard' },
  { num: 6, path: '/ttl', label: 'TTL / Expiry', icon: TbClock, desc: 'Zaman aşımı, otomatik silme' },
  { num: 7, path: '/cache', label: 'Cache Pattern', icon: TbDatabase, desc: 'Cache-Aside, eviction policy' },
  { num: 8, path: '/key-design', label: 'Key Design', icon: TbKey, desc: 'Namespace, SCAN, best practice' },
  { num: 9, path: '/pubsub', label: 'Pub/Sub', icon: TbBroadcast, desc: 'Mesajlaşma, gerçek zamanlı iletişim' },
  { num: 10, path: '/sessions', label: 'Sessions', icon: TbUser, desc: 'Distributed session yönetimi' },
  { num: 11, path: '/transactions', label: 'Transactions', icon: TbArrowsExchange, desc: 'MULTI/EXEC, atomik işlemler' },
  { num: 12, path: '/rate-limiting', label: 'Rate Limiting', icon: TbShieldLock, desc: 'Sliding window, istek sınırlandırma' },
];

const dataStructures = [
  { icon: VscSymbolString, title: 'String', example: 'SET user:1 "Portal"', desc: 'Metin, sayı, JSON. Max 512MB.', color: 'var(--accent-blue)' },
  { icon: TbList, title: 'List', example: 'LPUSH queue "job1"', desc: 'Doubly linked list. ~4 milyar eleman.', color: 'var(--accent-green)' },
  { icon: TbCirclesRelation, title: 'Set', example: 'SADD tags "redis"', desc: 'Benzersiz elemanlar. Küme operasyonları.', color: 'var(--accent-orange)' },
  { icon: TbHash, title: 'Hash', example: 'HSET user:1 name "Portal"', desc: 'Field-value çiftleri. Nesne saklama.', color: 'var(--redis-red)' },
  { icon: TbSortAscending, title: 'Sorted Set', example: 'ZADD board 100 "p1"', desc: 'Skorlu sıralama. Leaderboard.', color: '#A78BFA' },
];

const useCases = [
  { icon: TbRocket, title: 'Caching', desc: 'DB sorgularını RAM\'de sakla, tekrar eden istekleri ~0.1ms\'de yanıtla', color: 'var(--accent-green)' },
  { icon: TbUser, title: 'Session Store', desc: 'Distributed oturum verilerini merkezi olarak yönet, sticky session\'a gerek yok', color: 'var(--accent-blue)' },
  { icon: TbMessageCircle, title: 'Pub/Sub', desc: 'Gerçek zamanlı bildirim, chat, canlı skor yayını — mikrosaniye gecikme', color: 'var(--accent-orange)' },
  { icon: TbChartBar, title: 'Leaderboard', desc: 'Sorted Set ile anlık sıralama — milyonlarca kayıtta bile hızlı', color: '#A78BFA' },
  { icon: TbShieldLock, title: 'Rate Limiting', desc: 'Sliding window ile API koruması — brute-force ve DDoS önleme', color: 'var(--redis-red)' },
  { icon: TbLock, title: 'Distributed Lock', desc: 'SET NX EX ile kaynak kilitleme — race condition önleme', color: 'var(--accent-green)' },
];

function HomePage() {
  return (
    <div className="page-container home-page">
      <div className="home-hero">
        <div className="home-hero-icon">
          <svg width="72" height="62" viewBox="0 0 256 220" xmlns="http://www.w3.org/2000/svg">
            <path d="M245.97 168.943c-13.662 7.121-84.434 36.22-99.501 44.075-15.067 7.856-23.437 7.78-35.34 2.09-11.902-5.69-87.216-36.112-100.783-42.597C3.566 169.271 0 166.535 0 163.951v-25.876s98.05-21.345 113.879-27.024c15.828-5.679 21.32-5.884 34.79-.95 13.472 4.936 94.018 19.468 107.331 24.344l-.006 25.51c.002 2.558-3.07 5.364-10.024 8.988" fill="#912626"/>
            <path d="M245.965 143.22c-13.661 7.118-84.431 36.218-99.498 44.072-15.066 7.857-23.436 7.78-35.338 2.09-11.903-5.686-87.214-36.113-100.78-42.594-13.566-6.485-13.85-10.948-.524-16.166 13.326-5.22 88.224-34.605 104.055-40.284 15.828-5.677 21.319-5.884 34.789-.948 13.471 4.934 83.819 32.935 97.13 37.81 13.316 4.881 13.827 8.9.166 16.02" fill="#C6302B"/>
            <path d="M245.97 127.074c-13.662 7.122-84.434 36.22-99.501 44.078-15.067 7.853-23.437 7.777-35.34 2.087-11.903-5.687-87.216-36.112-100.783-42.597C3.566 127.402 0 124.67 0 122.085V96.206s98.05-21.344 113.879-27.023c15.828-5.679 21.32-5.885 34.79-.95C162.142 73.168 242.688 87.697 256 92.574l-.006 25.513c.002 2.557-3.07 5.363-10.024 8.987" fill="#912626"/>
            <path d="M245.965 101.351c-13.661 7.12-84.431 36.218-99.498 44.075-15.066 7.854-23.436 7.777-35.338 2.087-11.903-5.686-87.214-36.112-100.78-42.594-13.566-6.483-13.85-10.947-.524-16.167C23.151 83.535 98.05 54.148 113.88 48.47c15.828-5.678 21.319-5.884 34.789-.949 13.471 4.934 83.819 32.933 97.13 37.81 13.316 4.88 13.827 8.9.166 16.02" fill="#C6302B"/>
            <path d="M245.97 83.653c-13.662 7.12-84.434 36.22-99.501 44.078-15.067 7.854-23.437 7.777-35.34 2.087-11.903-5.687-87.216-36.113-100.783-42.595C3.566 83.98 0 81.247 0 78.665v-25.88s98.05-21.343 113.879-27.021c15.828-5.68 21.32-5.884 34.79-.95C162.142 29.749 242.688 44.278 256 49.155l-.006 25.512c.002 2.555-3.07 5.361-10.024 8.986" fill="#912626"/>
            <path d="M245.965 57.93c-13.661 7.12-84.431 36.22-99.498 44.074-15.066 7.854-23.436 7.777-35.338 2.09C99.227 98.404 23.915 67.98 10.35 61.497-3.217 55.015-3.5 50.55 9.825 45.331 23.151 40.113 98.05 10.73 113.88 5.05c15.828-5.679 21.319-5.883 34.789-.948 13.471 4.935 83.819 32.934 97.13 37.811 13.316 4.876 13.827 8.897.166 16.017" fill="#C6302B"/>
            <path d="M159.283 32.757l-22.01 2.285-4.927 11.856-7.958-13.23-25.415-2.284 18.964-6.839-5.69-10.498 17.755 6.944 16.738-5.48-4.524 10.855 17.067 6.391M131.032 90.275L89.955 73.238l58.86-9.035-17.783 26.072M74.082 39.347c17.375 0 31.46 5.46 31.46 12.194 0 6.736-14.085 12.195-31.46 12.195s-31.46-5.46-31.46-12.195c0-6.734 14.085-12.194 31.46-12.194" fill="#FFF"/>
            <path d="M185.295 35.998l34.836 13.766-34.806 13.753-.03-27.52" fill="#621B1C"/>
            <path d="M146.755 51.243l38.54-15.245.03 27.519-3.779 1.478-34.791-13.752" fill="#9A2928"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '2.8rem', letterSpacing: '-0.02em' }}>Redis</h1>
        <p>
          Redis, verileri diske değil <strong>doğrudan belleğe (RAM)</strong> yazan,
          açık kaynaklı bir <strong>NoSQL</strong> veritabanıdır.
          Anahtar-değer (key-value) mantığıyla çalışır ve klasik veritabanlarından <strong>çok daha hızlı</strong>dır.
          Genelde ana veritabanının önünde <strong>cache, session, kuyruk ve
          gerçek zamanlı mesajlaşma</strong> gibi görevler için kullanılır.
        </p>
      </div>

      {/* Stat Kartları */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>Hızlı</div>
          <div className="stat-label">Veri bellekte, ~0.1ms yanıt</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>Basit</div>
          <div className="stat-label">Key-Value, SQL yok</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>Esnek</div>
          <div className="stat-label">5+ veri yapısı desteği</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#A78BFA' }}>Güvenilir</div>
          <div className="stat-label">Diske yazar, yedek sunucu devralır</div>
        </div>
      </div>

      {/* Redis Mimarisi — Cache-Aside Akışı */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">Redis Mimarisi</div>
        <div className="arch-diagram">
          {/* Katman 1 — İstemci */}
          <div className="arch-layer">
            <div className="arch-node">
              <div className="arch-icon"><TbDeviceDesktop /></div>
              <div className="arch-title">Client</div>
              <div className="arch-desc">Web, Mobile, API vb.</div>
            </div>
          </div>

          {/* Bağlantı: HTTP Request / Response */}
          <div className="arch-connector arch-connector--dual">
            <div className="arch-connector-line" />
            <div className="arch-connector-labels">
              <span className="arch-connector-label arch-connector-label--down">▼ HTTP Request</span>
              <span className="arch-connector-label arch-connector-label--up">▲ HTTP Response</span>
            </div>
          </div>

          {/* Katman 2 — Backend Server */}
          <div className="arch-layer-label">Backend Server</div>
          <div className="arch-server-box">
            <div className="arch-server-title">
              <span className="arch-icon"><TbServer /></span>
              Backend Server
            </div>

            <div className="arch-sub-nodes">
              <div className="arch-sub-node">
                <div className="arch-sub-icon"><TbCpu /></div>
                <div className="arch-sub-title">API Layer</div>
                <div className="arch-sub-desc">İsteği karşılar</div>
              </div>
            </div>

            <div className="arch-connector">
              <div className="arch-connector-line" />
              <div className="arch-connector-label">Cache kontrol</div>
            </div>

            <div className="arch-sub-nodes">
              <div className="arch-sub-node highlight">
                <div className="arch-sub-icon"><TbCommand /></div>
                <div className="arch-sub-title">Redis Cache</div>
                <div className="arch-sub-desc">Veri var mı?</div>
              </div>
            </div>

            <div className="arch-flow-split">
              <div className="arch-flow-path arch-flow-path--hit">
                <div className="arch-flow-path-title">Cache Hit</div>
                <div className="arch-connector">
                  <div className="arch-connector-line" />
                  <div className="arch-connector-label arch-connector-label--hit">Bulundu</div>
                </div>
                <div className="arch-node highlight">
                  <div className="arch-icon"><TbRocket /></div>
                  <div className="arch-title">Redis</div>
                  <div className="arch-desc">~0.1ms</div>
                </div>
                <div className="arch-connector">
                  <div className="arch-connector-line arch-connector-line--up" />
                  <div className="arch-connector-label arch-connector-label--hit">▲ Direkt döner</div>
                </div>
              </div>

              <div className="arch-flow-path arch-flow-path--miss">
                <div className="arch-flow-path-title">Cache Miss</div>
                <div className="arch-connector">
                  <div className="arch-connector-line" />
                  <div className="arch-connector-label arch-connector-label--miss">Bulunamadı</div>
                </div>
                <div className="arch-node">
                  <div className="arch-icon"><TbDatabase /></div>
                  <div className="arch-title">PostgreSQL</div>
                  <div className="arch-desc">~5ms</div>
                </div>
                <div className="arch-connector">
                  <div className="arch-connector-line arch-connector-line--up" />
                  <div className="arch-connector-label arch-connector-label--miss">▲ Çek → Cache&apos;e yaz</div>
                </div>
              </div>
            </div>

            <div className="arch-server-chips-label">Redis Veri Yapıları</div>
            <div className="arch-layer">
              <div className="arch-chip"><span className="arch-chip-icon"><VscSymbolString /></span> String</div>
              <div className="arch-chip"><span className="arch-chip-icon"><TbList /></span> List</div>
              <div className="arch-chip"><span className="arch-chip-icon"><TbCirclesRelation /></span> Set</div>
              <div className="arch-chip"><span className="arch-chip-icon"><TbHash /></span> Hash</div>
              <div className="arch-chip"><span className="arch-chip-icon"><TbSortAscending /></span> Sorted Set</div>
            </div>
          </div>
        </div>
      </div>

      {/* Redis Komut Önizleme */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title"><TbTerminal2 className="icon" /> Redis Nasıl Çalışır?</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 14 }}>
          Redis tüm verileri <strong style={{ color: 'var(--accent-blue)' }}>RAM&apos;de</strong> tutar — disk erişimi olmadığı için
          okuma/yazma <strong style={{ color: 'var(--accent-green)' }}>~0.1ms</strong> seviyesindedir.
          Bir istek geldiğinde önce Redis&apos;e bakılır (<em>cache hit</em>); veri varsa anında döner.
          Yoksa veritabanından çekilir, Redis&apos;e yazılır ve bir sonraki istekte cache&apos;ten sunulur.
          Bu sayede veritabanı yükü düşer, yanıt süresi kısalır.
          Aşağıda temel komut örneklerini görebilirsiniz:
        </p>
        <div className="home-terminal-grid">
          <div className="home-terminal-block">
            <div className="home-terminal-label"><VscSymbolString style={{ color: 'var(--accent-blue)' }} /> String</div>
            <div className="code-block">
              <div className="code-block-header">
                <div className="code-block-dots"><span /><span /><span /></div>
                <div className="code-block-title">redis-cli</div>
              </div>
              <div className="code-block-body">
                <pre><code>{`> SET user:1 "Portal"\nOK\n> GET user:1\n"Portal"\n> INCR visitor:count\n(integer) 1`}</code></pre>
              </div>
            </div>
          </div>
          <div className="home-terminal-block">
            <div className="home-terminal-label"><TbHash style={{ color: 'var(--redis-red)' }} /> Hash</div>
            <div className="code-block">
              <div className="code-block-header">
                <div className="code-block-dots"><span /><span /><span /></div>
                <div className="code-block-title">redis-cli</div>
              </div>
              <div className="code-block-body">
                <pre><code>{`> HSET user:1 name "Portal" age 25\n(integer) 2\n> HGET user:1 name\n"Portal"`}</code></pre>
              </div>
            </div>
          </div>
          <div className="home-terminal-block">
            <div className="home-terminal-label"><TbList style={{ color: 'var(--accent-green)' }} /> List &amp; Set</div>
            <div className="code-block">
              <div className="code-block-header">
                <div className="code-block-dots"><span /><span /><span /></div>
                <div className="code-block-title">redis-cli</div>
              </div>
              <div className="code-block-body">
                <pre><code>{`> LPUSH queue "job1"\n(integer) 1\n> SADD online:users "user:1"\n(integer) 1`}</code></pre>
              </div>
            </div>
          </div>
          <div className="home-terminal-block">
            <div className="home-terminal-label"><TbSortAscending style={{ color: '#A78BFA' }} /> Sorted Set</div>
            <div className="code-block">
              <div className="code-block-header">
                <div className="code-block-dots"><span /><span /><span /></div>
                <div className="code-block-title">redis-cli</div>
              </div>
              <div className="code-block-body">
                <pre><code>{`> ZADD leaderboard 9500 "player1"\n(integer) 1\n> ZRANK leaderboard "player1"\n(integer) 0`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Veri Yapıları */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title"><TbLayoutGrid className="icon" /> Veri Yapıları</div>
        <div className="home-ds-grid">
          {dataStructures.map((ds) => {
            const Icon = ds.icon;
            return (
              <div key={ds.title} className="home-ds-card" style={{ borderTopColor: ds.color }}>
                <div className="home-ds-header">
                  <span className="home-ds-icon" style={{ color: ds.color }}><Icon /></span>
                  <strong>{ds.title}</strong>

                </div>
                <div className="home-ds-desc">{ds.desc}</div>
                <code className="home-ds-example">{ds.example}</code>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Design & Quick Tips */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title"><TbKey className="icon" /> Key Design Pattern</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 14 }}>
          Redis&apos;te anahtarlar <strong style={{ color: 'var(--accent-blue)' }}>namespace</strong> mantığıyla tasarlanır.
          Bu sayede veriler organize kalır ve çakışma riski ortadan kalkar.
        </p>
        <div className="home-key-pattern">
          <span className="home-key-segment" style={{ color: 'var(--accent-green)' }}>entity</span>
          <span className="home-key-sep">:</span>
          <span className="home-key-segment" style={{ color: 'var(--accent-orange)' }}>id</span>
          <span className="home-key-sep">:</span>
          <span className="home-key-segment" style={{ color: '#A78BFA' }}>field</span>
        </div>
        <div className="home-key-examples">
          <code>user:1001:email</code>
          <code>session:abc123</code>
          <code>cache:product:42</code>
          <code>rate:api:192.168.1.1</code>
        </div>
      </div>

      {/* Gerçek Hayat Senaryoları */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title"><TbBolt className="icon" /> Nerede Kullanılır?</div>
        <div className="home-usecase-grid">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <div key={uc.title} className="home-usecase-card">
                <div className="home-usecase-icon" style={{ color: uc.color, backgroundColor: `${uc.color}15` }}><Icon /></div>
                <div className="home-usecase-info">
                  <strong>{uc.title}</strong>
                  <span>{uc.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redis vs Geleneksel DB */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title"><TbDatabase className="icon" /> Redis vs Geleneksel Veritabanı</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Özellik</th>
              <th>Redis (In-Memory)</th>
              <th>PostgreSQL (Disk)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Okuma Hızı</td>
              <td style={{ color: 'var(--accent-green)', fontWeight: 700 }}>~0.1ms</td>
              <td style={{ color: 'var(--text-muted)' }}>~1-10ms</td>
            </tr>
            <tr>
              <td>Yazma Hızı</td>
              <td style={{ color: 'var(--accent-green)', fontWeight: 700 }}>~0.1ms</td>
              <td style={{ color: 'var(--text-muted)' }}>~1-10ms</td>
            </tr>
            <tr>
              <td>Veri Modeli</td>
              <td style={{ color: 'var(--accent-blue)' }}>Key-Value + Veri Yapıları</td>
              <td style={{ color: 'var(--accent-blue)' }}>Tablo / İlişkisel</td>
            </tr>
            <tr>
              <td>Kalıcılık</td>
              <td style={{ color: 'var(--accent-orange)' }}>Opsiyonel (RDB / AOF)</td>
              <td style={{ color: 'var(--accent-green)' }}>Varsayılan</td>
            </tr>
            <tr>
              <td>Kullanım</td>
              <td>Cache, Session, Queue, Pub/Sub</td>
              <td>Ana veritabanı</td>
            </tr>
            <tr>
              <td>Ölçekleme</td>
              <td style={{ color: 'var(--accent-blue)' }}>Master-Replica + Sentinel</td>
              <td style={{ color: 'var(--text-muted)' }}>Read Replica</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Öne Çıkan Özellikler */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">Öne Çıkan Özellikler</div>
        <div className="feature-grid">
          <div className="feature-card" style={{ borderTopColor: 'var(--accent-green)' }}>
            <div className="feature-icon" style={{ color: 'var(--accent-green)' }}><TbRocket /></div>
            <div className="feature-title">Yüksek Hız</div>
            <div className="feature-desc">Tüm veriler RAM&apos;de — disk erişimi yok. 100K+ ops/s, sub-millisecond latency.</div>
          </div>
          <div className="feature-card" style={{ borderTopColor: 'var(--accent-blue)' }}>
            <div className="feature-icon" style={{ color: 'var(--accent-blue)' }}><TbLayoutGrid /></div>
            <div className="feature-title">Zengin Veri Yapıları</div>
            <div className="feature-desc">String, List, Set, Hash, Sorted Set + Stream, Bitmap, HyperLogLog.</div>
          </div>
          <div className="feature-card" style={{ borderTopColor: 'var(--accent-orange)' }}>
            <div className="feature-icon" style={{ color: 'var(--accent-orange)' }}><TbShieldCheck /></div>
            <div className="feature-title">Kalıcılık</div>
            <div className="feature-desc">RDB (point-in-time snapshot) ve AOF (append-only log) ile veri güvenliği.</div>
          </div>
          <div className="feature-card" style={{ borderTopColor: '#A78BFA' }}>
            <div className="feature-icon" style={{ color: '#A78BFA' }}><TbServer /></div>
            <div className="feature-title">Dağıtık Yapı</div>
            <div className="feature-desc">Master-Replica replikasyon. Sentinel ile otomatik failover ve monitoring.</div>
          </div>
          <div className="feature-card" style={{ borderTopColor: 'var(--redis-red)' }}>
            <div className="feature-icon" style={{ color: 'var(--redis-red)' }}><TbBroadcast /></div>
            <div className="feature-title">Pub/Sub</div>
            <div className="feature-desc">Fire-and-forget mesajlaşma. Mikrosaniye gecikme ile gerçek zamanlı iletişim.</div>
          </div>
          <div className="feature-card" style={{ borderTopColor: 'var(--accent-green)' }}>
            <div className="feature-icon" style={{ color: 'var(--accent-green)' }}><TbArrowsExchange /></div>
            <div className="feature-title">Atomik İşlemler</div>
            <div className="feature-desc">MULTI/EXEC ile transaction. INCR/DECR atomik — race condition yok.</div>
          </div>
        </div>
      </div>

      {/* Redis Sentinel */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">Redis Sentinel (Yüksek Erişilebilirlik)</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 12 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Redis Sentinel</strong>, Redis sunucularını izler ve
          Master çökerse otomatik failover gerçekleştirir.
        </p>
        <div className="step-flow">
          <div className="step-flow-item info">
            <div className="step-flow-number">1</div>
            <div className="step-flow-content">
              <strong>İzle (Monitoring)</strong>
              <p>Master ve Replica&apos;ları sürekli ping ile izler.</p>
            </div>
          </div>
          <div className="step-flow-item">
            <div className="step-flow-number">2</div>
            <div className="step-flow-content">
              <strong>Sorun Tespit Et</strong>
              <p>Master yanıt vermezse, diğer Sentinel&apos;ler ile oylama yaparak doğrular.</p>
            </div>
          </div>
          <div className="step-flow-item success">
            <div className="step-flow-number">3</div>
            <div className="step-flow-content">
              <strong>Otomatik Failover</strong>
              <p>Bir Replica&apos;yı yeni Master yapar. Diğer Replica&apos;lar yeni Master&apos;a bağlanır.</p>
            </div>
          </div>
          <div className="step-flow-item info">
            <div className="step-flow-number">4</div>
            <div className="step-flow-content">
              <strong>Bildirim</strong>
              <p>Sistem yöneticilerini bilgilendirir. Client&apos;lar güncel Master adresini öğrenir.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modüller */}
      <div className="card">
        <div className="card-title">
          <TbPresentation className="icon" />
          Workshop Modülleri
        </div>
        <div className="home-modules">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.path} to={m.path} className="home-module-card">
                <div className="home-module-icon"><Icon /></div>
                <div className="home-module-info">
                  <strong>{m.label}</strong>
                  <span>{m.desc}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
