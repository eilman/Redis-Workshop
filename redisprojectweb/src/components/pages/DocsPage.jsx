import { TbBook2 } from 'react-icons/tb';
import TheorySection from '../common/TheorySection';
import CodeBlock from '../common/CodeBlock';

function DocsPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <TbBook2 className="icon" />
          Redis Dokümanı
        </h1>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Görsel şemalar ve diyagramlar ile zenginleştirilmiş versiyon</p>
      </div>

      {/* 1. Redis Nedir? */}
      <TheorySection title="1. Redis Nedir?">
        <p>
          <strong>Redis (Remote Dictionary Server)</strong>, açık kaynaklı, in-memory bir veri yapısı deposudur.
        </p>

        {/* Redis Mimarisi Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>REDIS MİMARİSİ</div>
          <svg viewBox="0 0 610 250" style={{ maxWidth: '100%', maxHeight: '270px' }}>
            <defs>
              <marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#0ea5e9"/></marker>
              <marker id="arrowG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#22d3ee"/></marker>
              <marker id="arrowY" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#f59e0b"/></marker>
            </defs>
            <rect x="10" y="50" width="100" height="50" rx="6" fill="#132743" stroke="#0ea5e9" strokeWidth="1.5"/>
            <text x="60" y="72" textAnchor="middle" fill="#e0e0e0" fontSize="13">Client App 1</text>
            <text x="60" y="87" textAnchor="middle" fill="#64748b" fontSize="10">Spring Boot</text>
            <rect x="10" y="115" width="100" height="50" rx="6" fill="#132743" stroke="#0ea5e9" strokeWidth="1.5"/>
            <text x="60" y="137" textAnchor="middle" fill="#e0e0e0" fontSize="13">Client App 2</text>
            <text x="60" y="152" textAnchor="middle" fill="#64748b" fontSize="10">Spring Boot</text>
            <line x1="110" y1="75" x2="220" y2="90" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <line x1="110" y1="140" x2="220" y2="110" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <rect x="220" y="50" width="160" height="100" rx="8" fill="#0f1d32" stroke="#0ea5e9" strokeWidth="2"/>
            <text x="300" y="73" textAnchor="middle" fill="#0ea5e9" fontSize="16" fontWeight="bold">Redis Server</text>
            <text x="300" y="90" textAnchor="middle" fill="#22d3ee" fontSize="12">Single-Threaded</text>
            <text x="300" y="105" textAnchor="middle" fill="#64748b" fontSize="10">RAM: ~0.1ms R/W</text>
            <rect x="240" y="112" width="50" height="18" rx="3" fill="rgba(14,165,233,0.12)" stroke="rgba(14,165,233,0.4)"/>
            <text x="265" y="125" textAnchor="middle" fill="#0ea5e9" fontSize="10">RDB</text>
            <rect x="310" y="112" width="50" height="18" rx="3" fill="rgba(34,211,238,0.12)" stroke="rgba(34,211,238,0.4)"/>
            <text x="335" y="125" textAnchor="middle" fill="#22d3ee" fontSize="10">AOF</text>
            <line x1="300" y1="150" x2="300" y2="190" stroke="#f59e0b80" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arrowY)"/>
            <rect x="230" y="190" width="140" height="35" rx="5" fill="#0c1829" stroke="rgba(245,158,11,0.4)"/>
            <text x="300" y="212" textAnchor="middle" fill="#f59e0b" fontSize="12">Disk (Persistence)</text>
            <line x1="380" y1="90" x2="470" y2="70" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arrowG)"/>
            <line x1="380" y1="110" x2="470" y2="130" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arrowG)"/>
            <rect x="470" y="50" width="120" height="35" rx="6" fill="#0c1829" stroke="rgba(34,211,238,0.4)"/>
            <text x="530" y="66" textAnchor="middle" fill="#22d3ee" fontSize="12">Replica 1</text>
            <text x="530" y="78" textAnchor="middle" fill="#4a6a8a" fontSize="9">Read-Only</text>
            <rect x="470" y="110" width="120" height="35" rx="6" fill="#0c1829" stroke="rgba(34,211,238,0.4)"/>
            <text x="530" y="126" textAnchor="middle" fill="#22d3ee" fontSize="12">Replica 2</text>
            <text x="530" y="138" textAnchor="middle" fill="#4a6a8a" fontSize="9">Read-Only</text>
          </svg>
        </div>

        <h4>Temel Özellikler</h4>
        <ul>
          <li><strong>In-memory:</strong> Veriler RAM'de tutulur, ~0.1ms okuma/yazma süresi</li>
          <li><strong>Veri Yapilari:</strong> String, List, Set, Hash, Sorted Set, Stream ve daha fazlası</li>
          <li><strong>Persistence:</strong> RDB (snapshot) ve AOF (append-only file) ile disk'e yazma desteği</li>
          <li><strong>Replication:</strong> Master-Replica yapısında veri çoğaltma</li>
          <li><strong>Clustering:</strong> Yatay ölçekleme için Redis Cluster</li>
        </ul>

        <h4>In-Memory vs Disk-Based Karşılaştırma</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Özellik</th><th>In-Memory (Redis)</th><th>Disk-Based (PostgreSQL vb.)</th></tr>
          </thead>
          <tbody>
            <tr><td>Okuma Hızı</td><td>~0.1ms</td><td>~1-10ms</td></tr>
            <tr><td>Yazma Hızı</td><td>~0.1ms</td><td>~1-10ms</td></tr>
            <tr><td>Veri Kalıcılığı</td><td>Opsiyonel (RDB/AOF)</td><td>Varsayılan</td></tr>
            <tr><td>Veri Modeli</td><td>Key-Value + Veri Yapıları</td><td>Tablo/İlişkisel</td></tr>
            <tr><td>Kullanım Alanı</td><td>Cache, Session, Queue</td><td>Ana veritabanı</td></tr>
          </tbody>
        </table>

        <h4>Dağıtık Yapı ve Redis Sentinel</h4>
        <ul>
          <li><strong>Master-Replica:</strong> Veri çoğaltma ile okuma performansı artırma</li>
          <li><strong>Redis Sentinel:</strong> Yüksek erişilebilirlik (HA) bileşeni — Master'ı sürekli ping ile izler, çökerse otomatik failover yapar</li>
          <li><strong>Redis Cluster:</strong> Yatay ölçekleme için veriyi birden fazla node'a dağıtma</li>
        </ul>

        <h4>Cache vs Persist Ayrımı</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Özellik</th><th>Cache Veri</th><th>Persist Veri</th></tr>
          </thead>
          <tbody>
            <tr><td>Key Adlandırma</td><td><code>cache:user:123</code></td><td><code>data:user:123</code></td></tr>
            <tr><td>TTL</td><td>Var (örn. 1 saat)</td><td>Yok veya çok uzun</td></tr>
            <tr><td>Kaybolursa?</td><td>DB'den tekrar çekilir</td><td>Veri kaybolur</td></tr>
          </tbody>
        </table>

        <h4>Yaygın Kullanım Alanları</h4>
        <ul>
          <li><strong>Önbellekleme (Caching):</strong> DB sorgularını RAM'de saklayarak tekrar eden istekleri hızlandırma</li>
          <li><strong>Oturum Yönetimi (Session):</strong> Distributed session verilerini merkezi olarak yönetme</li>
          <li><strong>Mesaj Aracısı (Pub/Sub):</strong> Gerçek zamanlı mesajlaşma, bildirim ve event yayını</li>
          <li><strong>Gerçek Zamanlı Veri İşleme:</strong> Sayaçlar, leaderboard, rate limiting, canlı analitik</li>
        </ul>

        <h4>Veri Yapıları Key-Value Örnekleri</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Key</th><th>Veri Yapısı</th><th>Açıklama</th></tr>
          </thead>
          <tbody>
            <tr><td><code>user:1</code></td><td>String</td><td>Kullanıcı bilgisi (JSON string)</td></tr>
            <tr><td><code>cart:123</code></td><td>Hash</td><td>Sepet içeriği (field-value çiftleri)</td></tr>
            <tr><td><code>timeline:user:1</code></td><td>List</td><td>Kullanıcı aktivite akışı</td></tr>
            <tr><td><code>online:users</code></td><td>Set</td><td>Çevrimiçi kullanıcılar (benzersiz)</td></tr>
            <tr><td><code>leaderboard:game1</code></td><td>Sorted Set</td><td>Oyun sıralaması (score ile)</td></tr>
          </tbody>
        </table>
      </TheorySection>

      {/* 2. Strings */}
      <TheorySection title="2. Strings">
        <p>Redis'in en temel veri yapısı. Binary-safe, max 512MB.</p>

        {/* String Veri Yapısı Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>STRING VERİ YAPISI</div>
          <svg viewBox="0 0 600 80" style={{ maxWidth: '100%', maxHeight: '100px' }}>
            <rect x="30" y="15" width="120" height="40" rx="5" fill="#132743" stroke="#0ea5e9" strokeWidth="1.5"/>
            <text x="90" y="32" textAnchor="middle" fill="#0ea5e9" fontSize="13" fontWeight="bold">KEY</text>
            <text x="90" y="46" textAnchor="middle" fill="#64748b" fontSize="10">user:1001:name</text>
            <line x1="150" y1="35" x2="220" y2="35" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <rect x="220" y="15" width="140" height="40" rx="5" fill="#0f1d32" stroke="#22d3ee" strokeWidth="1.5"/>
            <text x="290" y="32" textAnchor="middle" fill="#22d3ee" fontSize="13" fontWeight="bold">VALUE</text>
            <text x="290" y="46" textAnchor="middle" fill="#64748b" fontSize="10">"Alice"</text>
            <rect x="400" y="5" width="170" height="60" rx="5" fill="#0c1829" stroke="#1e3a5f"/>
            <text x="485" y="22" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">Desteklenen Tipler:</text>
            <text x="485" y="38" textAnchor="middle" fill="#64748b" fontSize="10">String, Integer, Float</text>
            <text x="485" y="52" textAnchor="middle" fill="#64748b" fontSize="10">JSON, Binary</text>
          </svg>
        </div>
        <h4>String'in Saklayabildiği Tipler</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Tip</th><th>Açıklama</th><th>Örnek</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>String</strong></td><td>Düz metin</td><td><code>SET name "Portal"</code></td></tr>
            <tr><td><strong>Integer</strong></td><td>Tam sayı (INCR/DECR ile)</td><td><code>SET counter "42"</code></td></tr>
            <tr><td><strong>Float</strong></td><td>Ondalıklı sayı (INCRBYFLOAT ile)</td><td><code>SET price "9.99"</code></td></tr>
            <tr><td><strong>JSON (string olarak)</strong></td><td>Serialize edilmiş JSON</td><td><code>{'SET user:1 \'{"name":"Portal"}\''}</code></td></tr>
            <tr><td><strong>Binary Data</strong></td><td>Görsel, dosya vb.</td><td>JPEG, serialized object</td></tr>
          </tbody>
        </table>
        <h4>Temel Komutlar</h4>
        <CodeBlock title="String Komutları">{`SET key value              # Değer ata
GET key                    # Değer oku
DEL key                    # Key sil
INCR key                   # Atomik 1 artır
DECR key                   # Atomik 1 azalt
INCRBY key amount          # Atomik N artır
APPEND key value           # Mevcut değere ekle
MSET k1 v1 k2 v2          # Çoklu atama
MGET k1 k2                # Çoklu okuma
SETNX key value            # Sadece yoksa ata
SET key value EX seconds   # TTL ile ata`}</CodeBlock>

        <h4>Atomik İşlemler ve Race Condition</h4>
        <p>
          <strong>INCR/DECR komutları atomiktir.</strong> Birden fazla client aynı anda INCR çağırsa bile race condition oluşmaz — Redis single-threaded olduğu için her komut sırayla işlenir.
          Ayrı GET + hesapla + SET yapmak yerine INCR kullanmak veri tutarsızlığını önler.
        </p>

        <h4>Kullanım Örnekleri</h4>
        <ul>
          <li>Counter: <code>INCR page:views:homepage</code></li>
          <li>Cache: <code>{'SET cache:user:1001 "{json}" EX 3600'}</code></li>
          <li>Session Token: <code>SET session:abc123 "user_id:1001" EX 1800</code></li>
        </ul>
      </TheorySection>

      {/* 3. Lists */}
      <TheorySection title="3. Lists">
        <p>Doubly linked list, max ~4 milyar eleman. O(1) push/pop, O(N) index erişimi. <strong>Her iki uçtan da ekleme ve çıkarma yapılabilir.</strong></p>

        {/* List Veri Yapısı Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>LİST VERİ YAPISI &amp; KALIPLARI</div>
          <svg viewBox="0 0 600 170" style={{ maxWidth: '100%', maxHeight: '190px' }}>
            <text x="30" y="25" fill="#0ea5e9" fontSize="11" fontWeight="bold">LPUSH →</text>
            <rect x="100" y="10" width="80" height="28" rx="5" fill="#132743" stroke="#0ea5e9" strokeWidth="1"/>
            <text x="140" y="28" textAnchor="middle" fill="#e0e0e0" fontSize="10">Node 1</text>
            <text x="188" y="28" fill="#0ea5e9" fontSize="13">↔</text>
            <rect x="205" y="10" width="80" height="28" rx="5" fill="#132743" stroke="#0ea5e9" strokeWidth="1"/>
            <text x="245" y="28" textAnchor="middle" fill="#e0e0e0" fontSize="10">Node 2</text>
            <text x="293" y="28" fill="#0ea5e9" fontSize="13">↔</text>
            <rect x="310" y="10" width="80" height="28" rx="5" fill="#132743" stroke="#0ea5e9" strokeWidth="1"/>
            <text x="350" y="28" textAnchor="middle" fill="#e0e0e0" fontSize="10">Node 3</text>
            <text x="400" y="25" fill="#22d3ee" fontSize="11" fontWeight="bold">→ RPOP</text>
            <rect x="30" y="55" width="250" height="42" rx="6" fill="#0f1f35" stroke="rgba(14,165,233,0.25)"/>
            <text x="155" y="73" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">Queue (FIFO): LPUSH + RPOP</text>
            <text x="155" y="88" textAnchor="middle" fill="#64748b" fontSize="9">E-posta kuyruğu, iş kuyruğu</text>
            <rect x="310" y="55" width="250" height="42" rx="6" fill="#0f1f35" stroke="rgba(14,165,233,0.25)"/>
            <text x="435" y="73" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">Stack (LIFO): LPUSH + LPOP</text>
            <text x="435" y="88" textAnchor="middle" fill="#64748b" fontSize="9">Undo/Redo işlemleri</text>
            <rect x="30" y="107" width="250" height="42" rx="6" fill="#0f1f35" stroke="rgba(14,165,233,0.25)"/>
            <text x="155" y="125" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">Son N Kayıt: LPUSH + LTRIM</text>
            <text x="155" y="140" textAnchor="middle" fill="#64748b" fontSize="9">Son 100 aktivite kaydı</text>
            <rect x="310" y="107" width="250" height="42" rx="6" fill="#0f1f35" stroke="rgba(14,165,233,0.25)"/>
            <text x="435" y="125" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">Blocking Queue: LPUSH + BLPOP</text>
            <text x="435" y="140" textAnchor="middle" fill="#64748b" fontSize="9">Eleman gelene kadar bekle</text>
          </svg>
        </div>
        <h4>Komut Detay Tablosu</h4>
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
            <tr><td><code>LINDEX</code></td><td>Index ile erişim (O(N))</td><td><code>LINDEX mylist 2</code></td></tr>
            <tr><td><code>LTRIM</code></td><td>Listeyi belirtilen aralığa kırpar</td><td><code>LTRIM mylist 0 99</code></td></tr>
          </tbody>
        </table>

        <h4>Kullanım Kalıpları</h4>
        <ul>
          <li><strong>Queue (FIFO):</strong> <code>LPUSH</code> + <code>RPOP</code></li>
          <li><strong>Stack (LIFO):</strong> <code>LPUSH</code> + <code>LPOP</code></li>
          <li><strong>Son N kayit:</strong> <code>LPUSH</code> + <code>LTRIM 0 99</code> (son 100)</li>
        </ul>
      </TheorySection>

      {/* 4. Sets */}
      <TheorySection title="4. Sets">
        <p>Benzersiz string elemanlar. Sıralanmamış.</p>

        {/* Set Operasyonları Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>SET OPERASYONLARI</div>
          <svg viewBox="0 0 600 170" style={{ maxWidth: '100%', maxHeight: '190px' }}>
            <circle cx="180" cy="85" r="65" fill="rgba(14,165,233,0.06)" stroke="#0ea5e9" strokeWidth="1.5"/>
            <text x="135" y="52" fill="#0ea5e9" fontSize="12" fontWeight="bold">Set A</text>
            <text x="138" y="78" fill="#c8d6e5" fontSize="10">alice</text>
            <text x="138" y="105" fill="#c8d6e5" fontSize="10">carol</text>
            <circle cx="265" cy="85" r="65" fill="rgba(34,211,238,0.06)" stroke="#22d3ee" strokeWidth="1.5"/>
            <text x="295" y="52" fill="#22d3ee" fontSize="12" fontWeight="bold">Set B</text>
            <text x="295" y="78" fill="#c8d6e5" fontSize="10">dave</text>
            <text x="295" y="105" fill="#c8d6e5" fontSize="10">eve</text>
            <text x="220" y="90" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">bob</text>
            <rect x="390" y="20" width="185" height="30" rx="5" fill="#0f1f35" stroke="rgba(16,185,129,0.25)"/>
            <text x="482" y="33" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">SUNION: alice, bob, carol, dave, eve</text>
            <text x="482" y="43" textAnchor="middle" fill="#64748b" fontSize="8"></text>
            <rect x="390" y="60" width="185" height="28" rx="5" fill="#0f1f35" stroke="rgba(245,158,11,0.25)"/>
            <text x="482" y="78" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">SINTER: bob</text>
            <rect x="390" y="100" width="185" height="28" rx="5" fill="#0f1f35" stroke="rgba(239,68,68,0.25)"/>
            <text x="482" y="118" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="600">SDIFF A B: alice, carol</text>
          </svg>
        </div>
        <h4>Temel Komutlar</h4>
        <CodeBlock title="Set Komutları">{`SADD key member            # Eleman ekle
SREM key member            # Eleman sil
SMEMBERS key               # Tüm elemanları getir
SISMEMBER key member       # Üyelik kontrolü (O(1))
SCARD key                  # Eleman sayısı
SCARD key                  # Eleman sayısı`}</CodeBlock>

        <h4>Kullanım Örnekleri</h4>
        <ul>
          <li>Benzersiz ziyaretçi: <code>SADD visitors:2024-01-15 "user:1001"</code></li>
          <li>Tag sistemi: <code>SADD article:5001:tags "redis" "nosql" "cache"</code></li>
          <li>Online kullanıcılar: <code>SADD online:users "user:1001"</code></li>
        </ul>
      </TheorySection>

      {/* 5. Hashes */}
      <TheorySection title="5. Hashes">
        <p>Field-value çiftleri. <strong>Bunu bir nesne (object) gibi düşünebilirsin</strong> — tıpkı JavaScript'teki obje veya Java'daki Map gibi.</p>

        {/* Hash Veri Yapısı Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>HASH VERİ YAPISI</div>
          <svg viewBox="0 0 600 110" style={{ maxWidth: '100%', maxHeight: '130px' }}>
            <rect x="20" y="25" width="120" height="40" rx="5" fill="#132743" stroke="#0ea5e9" strokeWidth="1.5"/>
            <text x="80" y="42" textAnchor="middle" fill="#0ea5e9" fontSize="13" fontWeight="bold">KEY</text>
            <text x="80" y="57" textAnchor="middle" fill="#64748b" fontSize="10">user:1001</text>
            <line x1="140" y1="45" x2="190" y2="45" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <rect x="190" y="5" width="220" height="95" rx="5" fill="#0f1d32" stroke="#22d3ee" strokeWidth="1.5"/>
            <text x="300" y="22" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="bold">HASH FIELDS</text>
            <line x1="190" y1="28" x2="410" y2="28" stroke="#1e3a5f"/>
            <text x="230" y="44" fill="#38bdf8" fontSize="10">name</text><text x="330" y="44" fill="#b0c4de" fontSize="10">"Alice"</text>
            <text x="230" y="59" fill="#38bdf8" fontSize="10">email</text><text x="330" y="59" fill="#b0c4de" fontSize="10">"alice@ex.com"</text>
            <text x="230" y="74" fill="#38bdf8" fontSize="10">age</text><text x="330" y="74" fill="#b0c4de" fontSize="10">"30"</text>
            <text x="230" y="89" fill="#38bdf8" fontSize="10">role</text><text x="330" y="89" fill="#b0c4de" fontSize="10">"admin"</text>
            <rect x="430" y="5" width="150" height="95" rx="5" fill="#0c1829" stroke="#1e3a5f"/>
            <text x="505" y="22" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="600">Avantajlar</text>
            <text x="440" y="40" fill="#64748b" fontSize="9">Tek field güncelleme</text>
            <text x="440" y="55" fill="#64748b" fontSize="9">Bellek optimizasyonu</text>
            <text x="440" y="70" fill="#64748b" fontSize="9">(ziplist encoding)</text>
            <text x="440" y="85" fill="#64748b" fontSize="9">HINCRBY ile atomik artış</text>
          </svg>
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

        <h4>Temel Komutlar</h4>
        <CodeBlock title="Hash Komutları">{`HSET key field value       # Field'a değer ata
HGET key field             # Field değerini oku
HGETALL key                # Tüm field-value çiftleri
HDEL key field             # Field sil
HEXISTS key field          # Field var mi?
HINCRBY key field amount   # Sayısal field'i artır
HMSET key f1 v1 f2 v2     # Çoklu atama
HMGET key f1 f2            # Çoklu okuma
HKEYS key                  # Tüm field isimleri
HVALS key                  # Tüm değerler`}</CodeBlock>

        <h4>Kullanım Örneği</h4>
        <CodeBlock title="Hash Kullanım Örneği">{`HSET user:1001 name "Portal" email "ekin@mail.com" age "25"
HGET user:1001 email       # "ekin@mail.com"
HINCRBY user:1001 age 1    # 26`}</CodeBlock>
        <p><strong>Not:</strong> Hash, hem daha az bellek harcar hem de ilgili verileri mantıksal olarak gruplar — ayrı key'lerde saklamaktansa Hash kullanmak çok daha verimlidir.</p>

        <h4>Encoding Optimizasyonu</h4>
        <p>
          Küçük hash'ler (<code>hash-max-ziplist-entries</code> ve <code>hash-max-ziplist-value</code> limitleri altında) <strong>ziplist</strong> encoding kullanır ve çok daha az bellek harcar.
          Büyük hash'lerde <code>HGETALL</code> yerine <code>HGET</code> veya <code>HMGET</code> kullanın — çok fazla field varsa tüm hash'i çekmek Redis'i yavaşlatabilir.
        </p>
      </TheorySection>

      {/* 6. Sorted Sets */}
      <TheorySection title="6. Sorted Sets">
        <p>Score ile ilişkilendirilmiş benzersiz elemanlar. Otomatik sıralanır.</p>

        {/* Sorted Set Leaderboard Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>SORTED SET - LEADERBOARD ÖRNEĞİ</div>
          <svg viewBox="0 0 600 140" style={{ maxWidth: '100%', maxHeight: '160px' }}>
            <rect x="30" y="5" width="250" height="125" rx="6" fill="#0f1d32" stroke="#0ea5e9" strokeWidth="1.5"/>
            <text x="155" y="24" textAnchor="middle" fill="#0ea5e9" fontSize="12" fontWeight="bold">game:leaderboard</text>
            <line x1="30" y1="32" x2="280" y2="32" stroke="#1e3a5f"/>
            <text x="75" y="48" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="600">Score</text>
            <text x="160" y="48" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="600">Member</text>
            <text x="245" y="48" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="600">Rank</text>
            <line x1="30" y1="55" x2="280" y2="55" stroke="#1e3a5f"/>
            <text x="75" y="72" textAnchor="middle" fill="#fbbf24" fontSize="11">2200</text>
            <text x="160" y="72" textAnchor="middle" fill="#c8d6e5" fontSize="11">bob</text>
            <text x="245" y="72" textAnchor="middle" fill="#34d399" fontSize="11">#1</text>
            <text x="75" y="92" textAnchor="middle" fill="#fbbf24" fontSize="11">1800</text>
            <text x="160" y="92" textAnchor="middle" fill="#c8d6e5" fontSize="11">charlie</text>
            <text x="245" y="92" textAnchor="middle" fill="#34d399" fontSize="11">#2</text>
            <text x="75" y="112" textAnchor="middle" fill="#fbbf24" fontSize="11">1500</text>
            <text x="160" y="112" textAnchor="middle" fill="#c8d6e5" fontSize="11">alice</text>
            <text x="245" y="112" textAnchor="middle" fill="#34d399" fontSize="11">#3</text>
            <rect x="310" y="5" width="265" height="125" rx="6" fill="#0c1829" stroke="#1e3a5f"/>
            <text x="442" y="24" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">Kullanım Alanları</text>
            <text x="320" y="44" fill="#38bdf8" fontSize="10">ZADD key score member → Eleman ekle</text>
            <text x="320" y="62" fill="#38bdf8" fontSize="10">ZREVRANGE key 0 9 → En iyi 10</text>
            <text x="320" y="80" fill="#38bdf8" fontSize="10">ZINCRBY key amt member → Skor artır</text>
            <text x="320" y="100" fill="#64748b" fontSize="9">Priority Queue | Zaman Serisi</text>
            <text x="320" y="115" fill="#64748b" fontSize="9">Trend Ürünler | Rate Limiting</text>
          </svg>
        </div>
        <h4>Temel Komutlar</h4>
        <CodeBlock title="Sorted Set Komutları">{`ZADD key score member      # Score ile eleman ekle
ZRANGE key start stop      # Sıraya göre getir
ZREVRANGE key start stop   # Ters sıraya göre getir
ZRANK key member           # Eleman sırası
ZSCORE key member          # Eleman skoru
ZREM key member            # Eleman sil
ZCARD key                  # Eleman sayısı
ZINCRBY key amount member  # Skoru artır`}</CodeBlock>

        <h4>Kullanım Örnekleri</h4>
        <ul>
          <li>Leaderboard: <code>ZADD leaderboard 1500 "player1"</code></li>
          <li>Priority Queue: Score = öncelik</li>
          <li>Zaman serisi: Score = timestamp</li>
        </ul>
      </TheorySection>

      {/* 7. TTL ve Expiration */}
      <TheorySection title="7. TTL ve Expiration">

        {/* TTL Mekanizması Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>TTL MEKANİZMASI</div>
          <svg viewBox="0 0 600 100" style={{ maxWidth: '100%', maxHeight: '120px' }}>
            <rect x="15" y="5" width="180" height="80" rx="6" fill="#0f1f35" stroke="rgba(14,165,233,0.25)"/>
            <text x="105" y="24" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">Lazy Expiration</text>
            <text x="105" y="40" textAnchor="middle" fill="#94a3b8" fontSize="9">Key'e erişildiği anda</text>
            <text x="105" y="53" textAnchor="middle" fill="#94a3b8" fontSize="9">kontrol edilir.</text>
            <text x="105" y="70" textAnchor="middle" fill="#64748b" fontSize="8">GET key → expired? → sil</text>
            <rect x="210" y="5" width="180" height="80" rx="6" fill="#0f1f35" stroke="rgba(14,165,233,0.25)"/>
            <text x="300" y="24" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">Active Expiration</text>
            <text x="300" y="40" textAnchor="middle" fill="#94a3b8" fontSize="9">Saniyede 10 kez rastgele</text>
            <text x="300" y="53" textAnchor="middle" fill="#94a3b8" fontSize="9">key'leri kontrol eder.</text>
            <text x="300" y="70" textAnchor="middle" fill="#64748b" fontSize="8">Background thread tarar</text>
            <rect x="405" y="5" width="180" height="80" rx="6" fill="#0f1f35" stroke="rgba(245,158,11,0.25)"/>
            <text x="495" y="24" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">TTL Dönüşleri</text>
            <text x="495" y="42" textAnchor="middle" fill="#34d399" fontSize="9">Pozitif = Kalan süre (sn)</text>
            <text x="495" y="57" textAnchor="middle" fill="#fbbf24" fontSize="9">-1 = Key kalıcı (TTL yok)</text>
            <text x="495" y="72" textAnchor="middle" fill="#f87171" fontSize="9">-2 = Key mevcut değil</text>
          </svg>
        </div>

        <h4>TTL Mekanizmasi</h4>
        <p>Redis, expire olmuş key'leri iki farklı stratejiyle temizler:</p>
        <ul>
          <li><strong>Lazy Expiration (Pasif):</strong> Key'e erişildiği anda TTL kontrol edilir. Expire olmuşsa silinir ve null döner. Erişilmeyen key'ler bellekte kalmaya devam edebilir.</li>
          <li><strong>Active Expiration (Aktif):</strong> Redis saniyede 10 kez rastgele 20 key seçer ve expire olanları siler. Eğer %25'ten fazlası expire ise aynı döngüyü tekrarlar. Bu sayede erişilmeyen expire key'ler de temizlenir.</li>
        </ul>

        <h4>Önemli Komutlar</h4>
        <CodeBlock title="TTL Komutları">{`SET key value EX 30        # 30 saniye TTL ile ata
EXPIRE key 60              # Mevcut key'e TTL ata
TTL key                    # Kalan süreyi öğren
PTTL key                   # Milisaniye cinsinden TTL
PERSIST key                # TTL kaldır (kalıcı yap)
EXPIREAT key timestamp     # Unix timestamp ile expire`}</CodeBlock>

        <h4>TTL Dönüşleri</h4>
        <ul>
          <li><strong>Pozitif sayi:</strong> Kalan süre (saniye)</li>
          <li><strong>-1:</strong> Key kalıcı (TTL yok)</li>
          <li><strong>-2:</strong> Key mevcut değil</li>
        </ul>

        <h4>Best Practices</h4>
        <ul>
          <li><strong>Cache Jitter:</strong> TTL'ye rastgele sapma ekleyin (<code>base_ttl + random(0, 60)</code>)</li>
          <li><strong>Sliding TTL:</strong> Aktif key'lerin TTL'sini her erişimde yenileyin</li>
          <li>Çok kısa TTL vermekten kaçının (sürekli cache miss)</li>
        </ul>

        <h4>Cache vs Persist Ayrımı</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Özellik</th><th>Cache Veri</th><th>Persist Veri</th></tr>
          </thead>
          <tbody>
            <tr><td>Key Adlandırma</td><td><code>cache:user:123</code></td><td><code>data:user:123</code></td></tr>
            <tr><td>TTL</td><td>Var (örn. 1 saat)</td><td>Yok veya çok uzun</td></tr>
            <tr><td>Kaybolursa?</td><td>DB'den tekrar çekilir</td><td>Veri kaybolur</td></tr>
          </tbody>
        </table>

        <h4>E-Ticaret Cache Örneği: "En Çok Satan Ürünler"</h4>
        <p>
          Bu sorguyu her seferinde DB'den çekmek pahalıdır. Redis ile önbelleğe alınır:
        </p>
        <CodeBlock title="E-Ticaret Cache">{`# 5 dakikalık TTL ile cache'le
SET cache:top-products "[{id:1,name:'Laptop'},{id:2,name:'Phone'}]" EX 300

# İstek gelince:
# 1. Redis'e bak → GET cache:top-products
# 2. Varsa (HIT) → anında döndür
# 3. Yoksa (MISS) → DB'den çek, Redis'e yaz, döndür`}</CodeBlock>

        <h4>Cache Mantığı</h4>
        <p>
          <strong>"Önce RAM'e bak, yoksa DB'ye git, bulduğunu RAM'e koy."</strong> Bu sayede tekrar eden istekler mikrosaniye seviyesinde cevaplanır.
        </p>
      </TheorySection>

      {/* 8. Cache Pattern'leri ve Eviction */}
      <TheorySection title="8. Cache Pattern'leri ve Eviction">

        {/* Cache-Aside Pattern Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>CACHE-ASIDE PATTERN AKIŞI</div>
          <svg viewBox="0 0 600 200" style={{ maxWidth: '100%', maxHeight: '220px' }}>
            <defs>
              <marker id="arrowG2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#34d399"/></marker>
            </defs>
            <rect x="220" y="5" width="160" height="40" rx="6" fill="#132743" stroke="#0ea5e9" strokeWidth="2"/>
            <text x="300" y="30" textAnchor="middle" fill="#0ea5e9" fontSize="13" fontWeight="bold">Application</text>
            <rect x="50" y="100" width="150" height="40" rx="6" fill="#0f1d32" stroke="#22d3ee" strokeWidth="1.5"/>
            <text x="125" y="118" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="bold">Redis Cache</text>
            <text x="125" y="132" textAnchor="middle" fill="#64748b" fontSize="9">~0.1ms</text>
            <rect x="400" y="100" width="150" height="40" rx="6" fill="#0c1829" stroke="rgba(245,158,11,0.4)"/>
            <text x="475" y="118" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">Database</text>
            <text x="475" y="132" textAnchor="middle" fill="#64748b" fontSize="9">~5-50ms</text>
            <line x1="260" y1="45" x2="160" y2="100" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" markerEnd="url(#arrowG)"/>
            <text x="175" y="72" fill="#22d3ee" fontSize="9">1. Cache kontrol</text>
            <line x1="125" y1="100" x2="240" y2="45" stroke="rgba(52,211,153,0.5)" strokeWidth="1.5" markerEnd="url(#arrowG2)"/>
            <text x="140" y="86" fill="#34d399" fontSize="9">HIT → Döndür</text>
            <line x1="340" y1="45" x2="440" y2="100" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" markerEnd="url(#arrowY)"/>
            <text x="405" y="72" fill="#f59e0b" fontSize="9">2. MISS: DB oku</text>
            <line x1="400" y1="140" x2="200" y2="140" stroke="rgba(14,165,233,0.5)" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arrowR)"/>
            <text x="300" y="160" textAnchor="middle" fill="#0ea5e9" fontSize="9">3. Cache'e yaz</text>
          </svg>
        </div>

        <h4>Cache Hit ve Cache Miss</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Durum</th><th>Açıklama</th><th>Sonuç</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Cache Hit</strong></td><td>Aranan veri Redis'te bulundu</td><td>Veri anında döndürülür (mikrosaniye)</td></tr>
            <tr><td><strong>Cache Miss</strong></td><td>Aranan veri Redis'te bulunamadı</td><td>DB'den çekilir, Redis'e yazılır, sonra döndürülür</td></tr>
          </tbody>
        </table>

        <h4>Cache-Aside (Lazy Loading)</h4>
        <p>En yaygın pattern. Uygulama cache'i yönetir.</p>
        <ol>
          <li>Cache'i kontrol et</li>
          <li>Hit → Döndür</li>
          <li>Miss → DB'den oku, cache'e yaz, döndür</li>
        </ol>

        <h4>Write-Through</h4>
        <p>Her yazma işleminde cache ve DB aynı anda güncellenir.</p>
        <ul>
          <li><strong>Avantaj:</strong> Cache her zaman güncel</li>
          <li><strong>Dezavantaj:</strong> Yazma yavaş</li>
        </ul>

        <h4>Write-Behind (Write-Back)</h4>
        <p>Önce cache'e yazılır, DB'ye asenkron yazılır.</p>
        <ul>
          <li><strong>Avantaj:</strong> Çok hızlı yazma</li>
          <li><strong>Dezavantaj:</strong> Veri kaybi riski</li>
        </ul>

        <h4>Hangi Pattern Ne Zaman Seçilmeli?</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Senaryo</th><th>Pattern</th><th>Neden?</th></tr>
          </thead>
          <tbody>
            <tr><td>E-ticaret kataloğu, kullanıcı profili</td><td><code>Cache-Aside</code></td><td>Okuma ağırlıklı, veri seyrek değişir</td></tr>
            <tr><td>Finansal işlemler, ödeme, stok</td><td><code>Write-Through</code></td><td>Tutarlılık kritik, eski veri kabul edilemez</td></tr>
            <tr><td>Log toplama, IoT sensör verisi</td><td><code>Write-Behind</code></td><td>Yazma yoğun, küçük veri kaybı tolere edilebilir</td></tr>
            <tr><td>Sosyal medya feed, haber akışı</td><td><code>Cache-Aside</code></td><td>Okuma çok yoğun, gecikmeli güncelleme kabul edilir</td></tr>
            <tr><td>Session, sepet bilgisi</td><td><code>Write-Through</code></td><td>Her güncelleme anında hem cache hem DB'de olmalı</td></tr>
            <tr><td>Gerçek zamanlı oyun skoru</td><td><code>Write-Behind</code></td><td>Saniyede binlerce güncelleme, anlık DB yazımı darboğaz olur</td></tr>
          </tbody>
        </table>

        <h4>Cache Sorunları ve Çözümleri</h4>

        <p><strong>1. Cache Stampede (Thundering Herd):</strong> Popüler bir key expire olduğunda çok sayıda istek aynı anda DB'ye yönelir.</p>
        <ul>
          <li><strong>Mutex Lock:</strong> İlk miss alan istek lock alır (<code>SET lock:key NX EX 5</code>), DB'den çekip cache'e yazar. Diğerleri bekler.</li>
          <li><strong>Early Refresh:</strong> Key expire olmadan önce arka planda yenilenir. Kullanıcı hiç miss görmez.</li>
          <li><strong>Stale-While-Revalidate:</strong> Eski veriyi anında döndür, arka planda yenisini çek.</li>
        </ul>

        <p><strong>2. Cache Penetration:</strong> Var olmayan veri sürekli sorgulanır, her seferinde DB'ye gidilir.</p>
        <ul>
          <li><strong>Null Caching:</strong> DB'den null dönen sonuçları da kısa TTL ile cache'e yaz (<code>SET key "NULL" EX 60</code>)</li>
          <li><strong>Bloom Filter:</strong> İstekten önce key'in var olup olmadığını kontrol et. Yoksa direkt reddet.</li>
          <li><strong>Input Validation:</strong> Geçersiz ID formatlarını uygulama katmanında reddet.</li>
        </ul>

        <p><strong>3. Cache Avalanche (Çığ Etkisi):</strong> Çok sayıda key aynı anda expire olur, tüm istekler DB'ye yönelir.</p>
        <ul>
          <li><strong>TTL Jitter:</strong> Her key'e rastgele ek süre ekle (<code>TTL = 3600 + random(0, 300)</code>)</li>
          <li><strong>Multi-Layer Cache:</strong> Redis önüne uygulama içi L1 cache (Caffeine/Guava) koy.</li>
          <li><strong>Circuit Breaker:</strong> DB'ye giden istek eşiği aşarsa devre kes, fallback döndür.</li>
          <li><strong>Redis HA (Sentinel/Cluster):</strong> Tek node çökse bile replica devralır.</li>
        </ul>

        <h4>Cache Invalidation Stratejileri</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Strateji</th><th>Nasıl?</th><th>Avantaj</th><th>Dezavantaj</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>TTL-Based</strong></td><td>Her key'e <code>EXPIRE</code> süresi koy</td><td>En basit, otomatik</td><td>TTL dolana kadar eski veri sunulabilir</td></tr>
            <tr><td><strong>Event-Based</strong></td><td>Veri değişince event yayınla (Pub/Sub, Kafka)</td><td>Gerçek zamanlı tutarlılık</td><td>Event altyapısı gerekli</td></tr>
            <tr><td><strong>Manual (DEL)</strong></td><td>Uygulama kodu güncelleme sırasında <code>DEL</code> çağırır</td><td>Tam kontrol</td><td>Her güncelleme noktası unutulmamalı</td></tr>
          </tbody>
        </table>
        <div className="tip-box">
          <strong>En iyi pratik:</strong> TTL-based + Event-based birlikte kullanın. TTL bir güvenlik ağı olarak kalır, event-based ise anlık tutarlılık sağlar.
        </div>

        <h4>Pipelining</h4>

        {/* Normal vs Pipeline Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>NORMAL VS PİPELİNE KARŞILAŞTIRMASI</div>
          <svg viewBox="0 0 600 150" style={{ maxWidth: '100%', maxHeight: '170px' }}>
            <text x="130" y="14" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold">Normal (N round-trip)</text>
            <rect x="30" y="22" width="60" height="20" rx="3" fill="#132743" stroke="rgba(239,68,68,0.25)"/>
            <text x="60" y="36" textAnchor="middle" fill="#c8d6e5" fontSize="8">SET k1</text>
            <line x1="90" y1="32" x2="130" y2="32" stroke="rgba(239,68,68,0.3)" strokeWidth="1"/>
            <rect x="130" y="22" width="60" height="20" rx="3" fill="#0f1d32" stroke="#1e3a5f"/>
            <text x="160" y="36" textAnchor="middle" fill="#64748b" fontSize="8">Server</text>
            <rect x="30" y="48" width="60" height="20" rx="3" fill="#132743" stroke="rgba(239,68,68,0.25)"/>
            <text x="60" y="62" textAnchor="middle" fill="#c8d6e5" fontSize="8">SET k2</text>
            <line x1="90" y1="58" x2="130" y2="58" stroke="rgba(239,68,68,0.3)" strokeWidth="1"/>
            <rect x="130" y="48" width="60" height="20" rx="3" fill="#0f1d32" stroke="#1e3a5f"/>
            <text x="160" y="62" textAnchor="middle" fill="#64748b" fontSize="8">Server</text>
            <rect x="30" y="74" width="60" height="20" rx="3" fill="#132743" stroke="rgba(239,68,68,0.25)"/>
            <text x="60" y="88" textAnchor="middle" fill="#c8d6e5" fontSize="8">SET k3</text>
            <line x1="90" y1="84" x2="130" y2="84" stroke="rgba(239,68,68,0.3)" strokeWidth="1"/>
            <rect x="130" y="74" width="60" height="20" rx="3" fill="#0f1d32" stroke="#1e3a5f"/>
            <text x="160" y="88" textAnchor="middle" fill="#64748b" fontSize="8">Server</text>
            <text x="130" y="112" textAnchor="middle" fill="#f87171" fontSize="9">3 round-trip</text>
            <text x="440" y="14" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">Pipeline (1 round-trip)</text>
            <rect x="320" y="22" width="80" height="75" rx="6" fill="#132743" stroke="rgba(16,185,129,0.25)"/>
            <text x="360" y="42" textAnchor="middle" fill="#c8d6e5" fontSize="8">SET k1</text>
            <text x="360" y="56" textAnchor="middle" fill="#c8d6e5" fontSize="8">SET k2</text>
            <text x="360" y="70" textAnchor="middle" fill="#c8d6e5" fontSize="8">SET k3</text>
            <text x="360" y="84" textAnchor="middle" fill="#64748b" fontSize="7">(batch)</text>
            <line x1="400" y1="59" x2="450" y2="59" stroke="rgba(16,185,129,0.5)" strokeWidth="2" markerEnd="url(#arrowG)"/>
            <rect x="450" y="32" width="80" height="55" rx="6" fill="#0f1d32" stroke="rgba(34,211,238,0.4)"/>
            <text x="490" y="55" textAnchor="middle" fill="#22d3ee" fontSize="10">Server</text>
            <text x="490" y="72" textAnchor="middle" fill="#64748b" fontSize="8">[OK, OK, OK]</text>
            <text x="440" y="112" textAnchor="middle" fill="#34d399" fontSize="9">1 round-trip</text>
            <rect x="180" y="125" width="240" height="20" rx="4" fill="#0c1829" stroke="#1e3a5f"/>
            <text x="300" y="139" textAnchor="middle" fill="#fbbf24" fontSize="8">100 islem: ~50ms → ~5ms (~10x) | 1000: ~500ms → ~15ms (~33x)</text>
          </svg>
        </div>

        <p>
          Normal modda her komut ayrı bir <strong>round-trip</strong> gerektirir (istek → yanıt → istek → yanıt...).
          Pipeline modda tüm komutlar <strong>tek seferde</strong> gönderilir ve yanıtlar toplu alınır. N komut için N round-trip yerine 1 round-trip yapılır.
        </p>
        <CodeBlock title="Pipeline Örneği">{`# Normal: 3 round-trip
SET key1 val1  →  OK
SET key2 val2  →  OK
SET key3 val3  →  OK

# Pipeline: 1 round-trip
SET key1 val1 \\
SET key2 val2  →  [OK, OK, OK]
SET key3 val3 /`}</CodeBlock>

        {/* LRU vs LFU Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>LRU VS LFU KARŞILAŞTIRMASI</div>
          <svg viewBox="0 0 600 80" style={{ maxWidth: '100%', maxHeight: '100px' }}>
            <rect x="20" y="5" width="270" height="68" rx="6" fill="#0f1f35" stroke="rgba(14,165,233,0.25)"/>
            <text x="155" y="22" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="bold">LRU - Least Recently Used</text>
            <text x="155" y="38" textAnchor="middle" fill="#94a3b8" fontSize="9">En son ne zaman erişildi?</text>
            <text x="155" y="52" textAnchor="middle" fill="#94a3b8" fontSize="9">Uzun süredir erişilmemiş key silinir.</text>
            <text x="155" y="66" textAnchor="middle" fill="#64748b" fontSize="8">Zaman bazlı | Genel amaçlı</text>
            <rect x="310" y="5" width="270" height="68" rx="6" fill="#0f1f35" stroke="rgba(34,211,238,0.25)"/>
            <text x="445" y="22" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="bold">LFU - Least Frequently Used</text>
            <text x="445" y="38" textAnchor="middle" fill="#94a3b8" fontSize="9">Ne sıklıkta erişiliyor?</text>
            <text x="445" y="52" textAnchor="middle" fill="#94a3b8" fontSize="9">Az erişilen key silinir.</text>
            <text x="445" y="66" textAnchor="middle" fill="#64748b" fontSize="8">Frekans bazlı | Popüler içerik</text>
          </svg>
        </div>

        <h4>Eviction Policy'ler</h4>
        <p><strong>RAM sınırsız değildir!</strong> Redis'te <code>maxmemory</code> limiti aşıldığında, hangi key'lerin silineceğini eviction policy belirler.</p>
        <p>
          <strong>LRU (Least Recently Used):</strong> En son ne zaman kullanıldığına bakar → <em>kullanım zamanı</em> önemli.
          <br />
          <strong>LFU (Least Frequently Used):</strong> Kaç kez kullanıldığına bakar → <em>kullanım sayısı</em> önemli.
        </p>
        <CodeBlock title="Eviction Yapılandırması">{`# redis.conf veya runtime
maxmemory 256mb
maxmemory-policy allkeys-lru`}</CodeBlock>
        <table className="theory-table">
          <thead>
            <tr><th>Policy</th><th>Açıklama</th><th>Kullanım</th></tr>
          </thead>
          <tbody>
            <tr><td><code>noeviction</code></td><td>Hiçbir şey silmez, yazma hatası verir</td><td>Veri kaybi kabul edilemez</td></tr>
            <tr><td><code>allkeys-lru</code></td><td>Tüm key'ler arasından en az kullanılanı sil</td><td>Genel amaçlı cache (önerilen)</td></tr>
            <tr><td><code>allkeys-lfu</code></td><td>Tüm key'ler arasından en az erişilen sil</td><td>Frekans bazlı cache</td></tr>
            <tr><td><code>volatile-lru</code></td><td>TTL'li key'ler arasından LRU</td><td>Kalıcı + geçici veri</td></tr>
            <tr><td><code>volatile-lfu</code></td><td>TTL'li key'ler arasından LFU</td><td>TTL'li frekans bazlı</td></tr>
            <tr><td><code>volatile-ttl</code></td><td>En yakin expire olacak key silinir</td><td>TTL öncelikli temizlik</td></tr>
            <tr><td><code>allkeys-random</code></td><td>Rastgele key silinir</td><td>Eşit önem</td></tr>
            <tr><td><code>volatile-random</code></td><td>TTL'li key'lerden rastgele silinir</td><td>Basit temizlik</td></tr>
          </tbody>
        </table>
        <div className="tip-box">
          <strong>Öneri:</strong> Çoğu senaryo için <code>allkeys-lru</code> kullanın. <code>maxmemory</code> değerini sunucu RAM'inin %70-80'i olarak ayarlayın.
        </div>
      </TheorySection>

      {/* 9. Key Design Best Practices */}
      <TheorySection title="9. Key Design Best Practices">

        {/* Key Namespace Formatı Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>KEY NAMESPACE FORMATI</div>
          <svg viewBox="0 0 600 100" style={{ maxWidth: '100%', maxHeight: '120px' }}>
            <rect x="170" y="2" width="260" height="30" rx="8" fill="#132743" stroke="#0ea5e9" strokeWidth="2"/>
            <text x="300" y="22" textAnchor="middle" fill="#0ea5e9" fontSize="15" fontWeight="bold" fontFamily="monospace">entity : id : field</text>
            <rect x="15" y="45" width="175" height="22" rx="4" fill="#0f1f35" stroke="#1e3a5f"/>
            <text x="102" y="60" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace">user:1001:email</text>
            <rect x="210" y="45" width="175" height="22" rx="4" fill="#0f1f35" stroke="#1e3a5f"/>
            <text x="297" y="60" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace">product:5001:stock</text>
            <rect x="405" y="45" width="175" height="22" rx="4" fill="#0f1f35" stroke="#1e3a5f"/>
            <text x="492" y="60" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace">session:abc123</text>
            <rect x="15" y="75" width="175" height="22" rx="4" fill="#0f1f35" stroke="#1e3a5f"/>
            <text x="102" y="90" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace">cache:user:1001</text>
            <rect x="210" y="75" width="175" height="22" rx="4" fill="#0f1f35" stroke="#1e3a5f"/>
            <text x="297" y="90" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace">v2:user:1001:profile</text>
            <rect x="405" y="75" width="175" height="22" rx="4" fill="#0f1f35" stroke="#1e3a5f"/>
            <text x="492" y="90" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace">prod:user:1001:email</text>
          </svg>
        </div>

        <h4>Namespace Formati</h4>
        <CodeBlock title="Namespace Formati">entity:id:field</CodeBlock>

        <h4>Örnekler</h4>
        <CodeBlock title="Key Örnekleri">{`user:1001:email           # Kullanıcı e-postası
product:5001:stock        # Ürün stok
session:abc123            # Oturum verisi
cache:user:1001           # Cache'lenmis kullanici
v2:user:1001:profile      # Versiyon prefix'i
prod:user:1001:email      # Ortam prefix'i`}</CodeBlock>

        <h4>Key Boyutu</h4>
        <ul>
          <li>Kısa ama anlamlı key'ler kullanın</li>
          <li>Çok uzun key'ler bellek ve network harcar</li>
          <li>Kötü: <code>u:1001:e</code> (anlaşılmaz) veya <code>the_user_with_id_1001_email_address</code> (çok uzun)</li>
          <li>İyi: <code>user:1001:email</code></li>
        </ul>

        <h4>SCAN vs KEYS</h4>
        <ul>
          <li><strong>KEYS:</strong> Tüm key'leri döndürür, Redis'i BLOKE EDER. Production'da KULLANMAYIN!</li>
          <li><strong>SCAN:</strong> Cursor bazlı, bloklama yapmaz. Güvenli.</li>
        </ul>
        <CodeBlock title="SCAN vs KEYS">{`# Tehlikeli (Production'da kullanmayın!)
KEYS user:*

# Güvenli
SCAN 0 MATCH user:* COUNT 100`}</CodeBlock>
      </TheorySection>

      {/* 10. Pub/Sub */}
      <TheorySection title="10. Pub/Sub">

        {/* Pub/Sub Mimarisi Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>PUB/SUB MİMARİSİ</div>
          <svg viewBox="0 0 600 150" style={{ maxWidth: '100%', maxHeight: '170px' }}>
            <rect x="20" y="45" width="110" height="55" rx="6" fill="#132743" stroke="#0ea5e9" strokeWidth="1.5"/>
            <text x="75" y="67" textAnchor="middle" fill="#0ea5e9" fontSize="12" fontWeight="bold">Publisher</text>
            <text x="75" y="83" textAnchor="middle" fill="#64748b" fontSize="9">PUBLISH ch msg</text>
            <line x1="130" y1="72" x2="210" y2="72" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <rect x="210" y="25" width="160" height="90" rx="8" fill="#0f1d32" stroke="#22d3ee" strokeWidth="2"/>
            <text x="290" y="48" textAnchor="middle" fill="#22d3ee" fontSize="13" fontWeight="bold">Redis Channel</text>
            <text x="290" y="65" textAnchor="middle" fill="#64748b" fontSize="10">notifications</text>
            <text x="290" y="82" textAnchor="middle" fill="#f59e0b" fontSize="9">Fire-and-Forget</text>
            <text x="290" y="105" textAnchor="middle" fill="#64748b" fontSize="8">Mesajlar saklanmaz</text>
            <line x1="370" y1="50" x2="430" y2="30" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" markerEnd="url(#arrowG)"/>
            <line x1="370" y1="72" x2="430" y2="72" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" markerEnd="url(#arrowG)"/>
            <line x1="370" y1="94" x2="430" y2="114" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" markerEnd="url(#arrowG)"/>
            <rect x="430" y="12" width="140" height="30" rx="5" fill="#0c1829" stroke="rgba(34,211,238,0.4)"/>
            <text x="500" y="31" textAnchor="middle" fill="#c8d6e5" fontSize="10">Subscriber 1</text>
            <rect x="430" y="55" width="140" height="30" rx="5" fill="#0c1829" stroke="rgba(34,211,238,0.4)"/>
            <text x="500" y="74" textAnchor="middle" fill="#c8d6e5" fontSize="10">Subscriber 2</text>
            <rect x="430" y="98" width="140" height="30" rx="5" fill="#0c1829" stroke="rgba(34,211,238,0.4)"/>
            <text x="500" y="117" textAnchor="middle" fill="#c8d6e5" fontSize="10">Subscriber 3</text>
          </svg>
        </div>

        <h4>Temel Kavramlar</h4>
        <ul>
          <li><strong>Publisher:</strong> Mesajı kanala gönderir</li>
          <li><strong>Subscriber:</strong> Kanaldan mesaj alır</li>
          <li><strong>Channel:</strong> Mesajların yayınlandığı isimlendirilmiş kanal</li>
          <li><strong>Fire-and-forget:</strong> Mesajlar saklanmaz</li>
        </ul>

        <h4>Avantajlar</h4>
        <ul>
          <li><strong>Çok hızlı:</strong> Tüm iletişim RAM üzerinden gerçekleşir</li>
          <li><strong>Gerçek zamanlı:</strong> Mesajlar anında iletilir, polling gerekmez</li>
          <li><strong>Loosely Coupled:</strong> Publisher ve Subscriber birbirini tanımak zorunda değil</li>
          <li><strong>Basit kurulum:</strong> Ekstra araç gerekmez, Redis zaten mevcut</li>
        </ul>

        <h4>Kullanım Alanları</h4>
        <ul>
          <li>WebSocket bildirimleri, chat uygulamaları</li>
          <li>Canlı skor / borsa verileri</li>
          <li>Log / metrik yayını, cache invalidation</li>
          <li>Microservice event yayını</li>
        </ul>

        <h4>Dezavantajlar</h4>
        <ul>
          <li><strong>Mesaj kuyruğu yok:</strong> Mesajlar saklanmaz, subscriber bağlı değilse kaybolur</li>
          <li><strong>Retry yok:</strong> Başarısız mesajlar tekrar gönderilmez</li>
          <li><strong>ACK yok:</strong> Mesajın alınıp alınmadığı doğrulanamaz</li>
          <li><strong>Offline subscriber mesaj okuyamaz</strong></li>
        </ul>

        <h4>Analoji: Radyo vs Netflix/YouTube</h4>
        <p>
          <strong>Pub/Sub = Radyo:</strong> Canlı yayın dinlersin. Açık değilsen programı kaçırırsın. Geri sarma yok.
          <br />
          <strong>Streams/Kafka = Netflix/YouTube:</strong> İstediğin zaman, istediğin yerden izlersin. Geçmiş içerikler kayıtlıdır.
        </p>

        <h4>Komutlar</h4>
        <CodeBlock title="Pub/Sub Komutları">{`PUBLISH channel message    # Mesaj yayınla
SUBSCRIBE channel          # Kanala abone ol
UNSUBSCRIBE channel        # Aboneligi iptal et
PSUBSCRIBE pattern         # Desen ile abone ol (news.*)`}</CodeBlock>

        <h4>Redis Streams vs Pub/Sub</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Özellik</th><th>Pub/Sub</th><th>Streams</th></tr>
          </thead>
          <tbody>
            <tr><td>Mesaj Kalıcılığı</td><td>Yok</td><td>Var</td></tr>
            <tr><td>Consumer Groups</td><td>Yok</td><td>Var</td></tr>
            <tr><td>Retry / ACK</td><td>Yok</td><td>Var</td></tr>
            <tr><td>Replay (tekrar okuma)</td><td>Yok</td><td>Var</td></tr>
            <tr><td>Performans</td><td>Çok hızlı</td><td>Hızlı</td></tr>
          </tbody>
        </table>

        <h4>Alternatifler</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Araç</th><th>Ne Zaman Tercih Edilir?</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Redis Streams</strong></td><td>Mesaj kalıcılığı ve consumer group gerektiğinde</td></tr>
            <tr><td><strong>RabbitMQ</strong></td><td>Gelişmiş kuyruk, routing, retry ve ACK gerektiğinde</td></tr>
            <tr><td><strong>Apache Kafka</strong></td><td>Yüksek hacimli, dağıtık event streaming gerektiğinde</td></tr>
          </tbody>
        </table>
      </TheorySection>

      {/* 11. Session Yonetimi */}
      <TheorySection title="11. Session Yönetimi">

        {/* Distributed Session Mimarisi Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>DISTRIBUTED SESSION MİMARİSİ</div>
          <svg viewBox="0 0 600 210" style={{ maxWidth: '100%', maxHeight: '230px' }}>
            <rect x="210" y="5" width="180" height="35" rx="8" fill="#132743" stroke="#0ea5e9" strokeWidth="2"/>
            <text x="300" y="28" textAnchor="middle" fill="#0ea5e9" fontSize="13" fontWeight="bold">Load Balancer</text>
            <line x1="245" y1="40" x2="120" y2="75" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <line x1="300" y1="40" x2="300" y2="75" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <line x1="355" y1="40" x2="480" y2="75" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <rect x="60" y="75" width="120" height="35" rx="6" fill="#0f1f35" stroke="#1e3a5f"/>
            <text x="120" y="97" textAnchor="middle" fill="#c8d6e5" fontSize="11">Server 1</text>
            <rect x="240" y="75" width="120" height="35" rx="6" fill="#0f1f35" stroke="#1e3a5f"/>
            <text x="300" y="97" textAnchor="middle" fill="#c8d6e5" fontSize="11">Server 2</text>
            <rect x="420" y="75" width="120" height="35" rx="6" fill="#0f1f35" stroke="#1e3a5f"/>
            <text x="480" y="97" textAnchor="middle" fill="#c8d6e5" fontSize="11">Server 3</text>
            <line x1="120" y1="110" x2="260" y2="145" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arrowG)"/>
            <line x1="300" y1="110" x2="300" y2="145" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arrowG)"/>
            <line x1="480" y1="110" x2="340" y2="145" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arrowG)"/>
            <rect x="195" y="145" width="210" height="45" rx="8" fill="#0f1d32" stroke="#22d3ee" strokeWidth="2"/>
            <text x="300" y="166" textAnchor="middle" fill="#22d3ee" fontSize="14" fontWeight="bold">Redis Session Store</text>
            <text x="300" y="182" textAnchor="middle" fill="#64748b" fontSize="9">Merkezi session deposu</text>
          </svg>
        </div>

        <h4>Distributed Session Problemi</h4>
        <p>Birden fazla sunucu oldugunda session verisinin paylaşımı.</p>

        <h4>Spring Session + Redis</h4>
        <CodeBlock title="Spring Session Yapılandırması">{`// application.properties
spring.session.store-type=redis
spring.session.redis.namespace=spring:session
server.servlet.session.timeout=30m`}</CodeBlock>

        <h4>Avantajlar</h4>
        <ul>
          <li>Sunucu çökerse session kaybolmaz</li>
          <li>Load balancer sticky session'a gerek yok</li>
          <li>Horizontal scaling kolaylığı</li>
          <li>Redis TTL ile otomatik session temizliği</li>
          <li>Hızlı session erişimi (~0.1ms)</li>
        </ul>

        <h4>Session Verisi Redis'te</h4>
        <CodeBlock title="Session Verisi">{`# Spring Session Redis'te şu şekilde saklar:
HSET spring:session:sessions:<session-id>
  sessionAttr:username "alice"
  sessionAttr:theme "dark"
  creationTime "1703001234567"
  lastAccessedTime "1703001234567"
  maxInactiveInterval "1800"`}</CodeBlock>

        <h4>Distributed Lock (Redlock)</h4>

        {/* Lock Mekanizması Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>SET NX EX - LOCK MEKANİZMASI</div>
          <svg viewBox="0 0 600 110" style={{ maxWidth: '100%', maxHeight: '130px' }}>
            <rect x="15" y="10" width="170" height="85" rx="6" fill="#0f1f35" stroke="#0ea5e9" strokeWidth="1.5"/>
            <text x="100" y="28" textAnchor="middle" fill="#0ea5e9" fontSize="11" fontWeight="bold">Lock Alma</text>
            <text x="100" y="43" textAnchor="middle" fill="#38bdf8" fontSize="8">SET lock:resource "owner" NX EX 30</text>
            <text x="100" y="60" textAnchor="middle" fill="#34d399" fontSize="8">OK → Lock alındı</text>
            <text x="100" y="73" textAnchor="middle" fill="#f87171" fontSize="8">null → Başkasında</text>
            <text x="100" y="88" textAnchor="middle" fill="#64748b" fontSize="7">NX=yoksa | EX=TTL (deadlock önleme)</text>
            <line x1="185" y1="52" x2="215" y2="52" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <rect x="215" y="10" width="170" height="85" rx="6" fill="#0f1d32" stroke="#f59e0b" strokeWidth="1.5"/>
            <text x="300" y="28" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">Kritik Bölge</text>
            <text x="300" y="46" textAnchor="middle" fill="#94a3b8" fontSize="9">Güvenlice işlem yap</text>
            <text x="300" y="62" textAnchor="middle" fill="#64748b" fontSize="8">GET stock → 5</text>
            <text x="300" y="76" textAnchor="middle" fill="#64748b" fontSize="8">SET stock 4</text>
            <text x="300" y="90" textAnchor="middle" fill="#64748b" fontSize="7">Sadece lock sahibi erişir</text>
            <line x1="385" y1="52" x2="415" y2="52" stroke="#f59e0b80" strokeWidth="1.5" markerEnd="url(#arrowY)"/>
            <rect x="415" y="10" width="170" height="85" rx="6" fill="#0f1f35" stroke="#22d3ee" strokeWidth="1.5"/>
            <text x="500" y="28" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="bold">Lock Bırakma</text>
            <text x="500" y="46" textAnchor="middle" fill="#94a3b8" fontSize="9">1. Owner kontrolü yap</text>
            <text x="500" y="62" textAnchor="middle" fill="#64748b" fontSize="8">GET lock:resource</text>
            <text x="500" y="78" textAnchor="middle" fill="#94a3b8" fontSize="9">2. Eşleşiyorsa sil</text>
            <text x="500" y="92" textAnchor="middle" fill="#64748b" fontSize="8">DEL lock:resource</text>
          </svg>
        </div>

        <p>
          Birden fazla sunucu aynı kaynağa eriştiğinde race condition oluşabilir.
          Redis ile dağıtık kilit (distributed lock) oluşturularak aynı anda sadece bir instance'ın işlem yapması sağlanır.
        </p>
        <CodeBlock title="Distributed Lock Pattern">{`# Lock al (sadece yoksa ata + timeout)
SET lock:resource-name owner-id NX EX 10

# NX = sadece key yoksa ata (başka biri almamışsa)
# EX 10 = 10 saniye sonra otomatik serbest bırak (deadlock önleme)

# İşlem bitti → Lock'u serbest bırak
DEL lock:resource-name`}</CodeBlock>
        <div className="tip-box">
          <strong>Dikkat:</strong> Lock'u serbest bırakırken sadece sahibi silmelidir. Lua script ile owner-id kontrol edildikten sonra DEL yapılması önerilir. Session TTL genellikle 30 dakika (web), hassas işlemler için 5-10 dakika olarak ayarlanır.
        </div>
      </TheorySection>

      {/* 12. Transactions */}
      <TheorySection title="12. Transactions (MULTI/EXEC)">

        {/* Transaction Akışı Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>TRANSACTION AKIŞI</div>
          <svg viewBox="0 0 600 100" style={{ maxWidth: '100%', maxHeight: '120px' }}>
            <rect x="15" y="15" width="105" height="65" rx="6" fill="#132743" stroke="#0ea5e9" strokeWidth="1.5"/>
            <text x="67" y="35" textAnchor="middle" fill="#0ea5e9" fontSize="12" fontWeight="bold">MULTI</text>
            <text x="67" y="52" textAnchor="middle" fill="#64748b" fontSize="9">Transaction</text>
            <text x="67" y="65" textAnchor="middle" fill="#64748b" fontSize="9">başla</text>
            <line x1="120" y1="47" x2="148" y2="47" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <rect x="148" y="15" width="165" height="65" rx="6" fill="#0f1d32" stroke="#22d3ee" strokeWidth="1.5"/>
            <text x="230" y="33" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="bold">KUYRUK (Queued)</text>
            <text x="230" y="48" textAnchor="middle" fill="#64748b" fontSize="9">SET key1 val1 → QUEUED</text>
            <text x="230" y="61" textAnchor="middle" fill="#64748b" fontSize="9">SET key2 val2 → QUEUED</text>
            <text x="230" y="74" textAnchor="middle" fill="#64748b" fontSize="9">INCR counter → QUEUED</text>
            <line x1="313" y1="47" x2="341" y2="47" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" markerEnd="url(#arrowG)"/>
            <rect x="341" y="15" width="100" height="65" rx="6" fill="#0f1f35" stroke="#f59e0b" strokeWidth="1.5"/>
            <text x="391" y="35" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">EXEC</text>
            <text x="391" y="52" textAnchor="middle" fill="#64748b" fontSize="9">Tüm komutları</text>
            <text x="391" y="65" textAnchor="middle" fill="#64748b" fontSize="9">çalıştır</text>
            <line x1="441" y1="47" x2="469" y2="47" stroke="#f59e0b80" strokeWidth="1.5" markerEnd="url(#arrowY)"/>
            <rect x="469" y="15" width="110" height="65" rx="6" fill="#0c1829" stroke="rgba(16,185,129,0.4)"/>
            <text x="524" y="35" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold">Atomik</text>
            <text x="524" y="52" textAnchor="middle" fill="#64748b" fontSize="9">[OK, OK, 1]</text>
            <text x="524" y="65" textAnchor="middle" fill="#64748b" fontSize="9">veya iptal</text>
          </svg>
        </div>

        <h4>MULTI / EXEC / DISCARD</h4>
        <p>
          Redis transaction'ları <strong>MULTI</strong> ile başlar, komutlar sıraya alınır (QUEUED) ve <strong>EXEC</strong> ile atomik olarak çalıştırılır.
          Tüm komutlar ya hep birlikte çalışır ya da hiçbiri. <strong>DISCARD</strong> ile transaction iptal edilir.
        </p>
        <CodeBlock title="Transaction Akışı">{`MULTI                      # Transaction başlat
SET account:alice 75       # → QUEUED
SET account:bob 125        # → QUEUED
EXEC                       # Tüm komutları atomik çalıştır
# Sonuç: [OK, OK]`}</CodeBlock>

        <h4>WATCH — Optimistic Locking</h4>
        <p>
          <strong>WATCH</strong> bir key'i izlemeye alır. WATCH ile EXEC arasında o key başka bir client tarafından
          değiştirilirse, EXEC <strong>null</strong> döner ve transaction iptal edilir.
        </p>
        <CodeBlock title="WATCH Kullanımı">{`WATCH account:alice        # Key'i izle
GET account:alice          # Mevcut değeri oku → "100"

MULTI
SET account:alice 75       # → QUEUED
EXEC
# Eğer başka client account:alice'i değiştirdiyse → null (iptal)
# Değiştirmediyse → [OK] (başarılı)`}</CodeBlock>
        <p>
          Bu pattern ile retry yapılır: EXEC null dönerse, yeni değeri oku → tekrar WATCH → tekrar dene.
        </p>

        <h4>Redis vs SQL Transactions</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Özellik</th><th>Redis</th><th>SQL (PostgreSQL vb.)</th></tr>
          </thead>
          <tbody>
            <tr><td>Rollback</td><td><strong>Yok</strong> — bir komut hata verse bile diğerleri çalışır</td><td>Var — hata olursa tümü geri alınır</td></tr>
            <tr><td>İzolasyon</td><td>EXEC sırasında araya komut giremez</td><td>Farklı izolasyon seviyeleri</td></tr>
            <tr><td>Locking</td><td>Optimistic (WATCH)</td><td>Pessimistic (SELECT FOR UPDATE)</td></tr>
          </tbody>
        </table>
        <div className="tip-box">
          <strong>Önemli:</strong> Redis transaction'larında rollback yoktur. WATCH + retry pattern kullanarak veri tutarlılığı sağlanır.
        </div>
      </TheorySection>

      {/* 13. Rate Limiting */}
      <TheorySection title="13. Rate Limiting">

        {/* Sliding Window Log Akışı Diyagramı */}
        <div style={{ background: 'linear-gradient(135deg, #0a1525, #0e1e35)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', padding: '14px', margin: '10px 0 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>SLIDING WINDOW LOG AKIŞI</div>
          <svg viewBox="0 0 600 85" style={{ maxWidth: '100%', maxHeight: '105px' }}>
            <rect x="10" y="5" width="130" height="65" rx="6" fill="#0f1f35" stroke="rgba(239,68,68,0.25)"/>
            <text x="75" y="22" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="600">1. Eski Temizle</text>
            <text x="75" y="36" textAnchor="middle" fill="#64748b" fontSize="8">ZREMRANGEBYSCORE</text>
            <text x="75" y="48" textAnchor="middle" fill="#64748b" fontSize="8">ratelimit:client1</text>
            <text x="75" y="60" textAnchor="middle" fill="#64748b" fontSize="7">0 &lt;now - window&gt;</text>
            <line x1="140" y1="37" x2="158" y2="37" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <rect x="158" y="5" width="130" height="65" rx="6" fill="#0f1f35" stroke="rgba(14,165,233,0.25)"/>
            <text x="223" y="22" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="600">2. Say</text>
            <text x="223" y="36" textAnchor="middle" fill="#64748b" fontSize="8">ZCARD</text>
            <text x="223" y="48" textAnchor="middle" fill="#64748b" fontSize="8">ratelimit:client1</text>
            <text x="223" y="60" textAnchor="middle" fill="#64748b" fontSize="7">Aktif istek sayısı</text>
            <line x1="288" y1="37" x2="306" y2="37" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <rect x="306" y="5" width="130" height="65" rx="6" fill="#0f1f35" stroke="rgba(16,185,129,0.25)"/>
            <text x="371" y="22" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">3. Ekle (limit ok)</text>
            <text x="371" y="36" textAnchor="middle" fill="#64748b" fontSize="8">ZADD</text>
            <text x="371" y="48" textAnchor="middle" fill="#64748b" fontSize="8">ratelimit:client1</text>
            <text x="371" y="60" textAnchor="middle" fill="#64748b" fontSize="7">&lt;ts&gt; &lt;req-id&gt;</text>
            <line x1="436" y1="37" x2="454" y2="37" stroke="#0ea5e980" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
            <rect x="454" y="5" width="130" height="65" rx="6" fill="#0f1f35" stroke="rgba(245,158,11,0.25)"/>
            <text x="519" y="22" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">4. TTL Ata</text>
            <text x="519" y="36" textAnchor="middle" fill="#64748b" fontSize="8">EXPIRE</text>
            <text x="519" y="48" textAnchor="middle" fill="#64748b" fontSize="8">ratelimit:client1</text>
            <text x="519" y="60" textAnchor="middle" fill="#64748b" fontSize="7">60 (pencere süresi)</text>
          </svg>
        </div>

        <p>
          Kullanıcı veya IP başına belirli bir zaman penceresi içinde yapılabilecek istek sayısını sınırlar.
          Sunucu koruma, API abuse engelleme, brute-force zorlaştırma ve kaynak yönetimi için kullanılır.
        </p>

        <h4>Neden Redis?</h4>
        <ul>
          <li><strong>RAM tabanlı hız:</strong> Her istekte sayaç kontrolü mikrosaniyede tamamlanır</li>
          <li><strong>Atomic işlemler:</strong> INCR komutu race condition olmadan güvenli sayaç artırır</li>
          <li><strong>TTL desteği:</strong> EXPIRE ile pencere sonunda sayaç otomatik sıfırlanır</li>
          <li><strong>Distributed:</strong> Birden fazla sunucu aynı Redis&apos;i kullanarak ortak sayaç tutar</li>
        </ul>

        <h4>Algoritmalar</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Algoritma</th><th>Nasıl Çalışır?</th><th>Burst</th><th>Kullanım</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Fixed Window</strong></td>
              <td>Sabit zaman dilimlerinde sayaç. <code>INCR</code> + <code>EXPIRE</code>.</td>
              <td>Sınırda risk var</td>
              <td>Basit API limitleri</td>
            </tr>
            <tr>
              <td><strong>Sliding Window</strong></td>
              <td>Sorted Set ile timestamp saklanır, pencere dışı temizlenir.</td>
              <td>Yok</td>
              <td>Hassas rate limiting</td>
            </tr>
            <tr>
              <td><strong>Token Bucket</strong></td>
              <td>Sabit hızda token eklenir, her istek 1 token harcar.</td>
              <td>Kontrollü izin</td>
              <td>API gateway, CDN</td>
            </tr>
            <tr>
              <td><strong>Leaky Bucket</strong></td>
              <td>İstekler kovaya dolar, sabit hızda dışarı akar.</td>
              <td>Yok</td>
              <td>Trafik şekillendirme</td>
            </tr>
          </tbody>
        </table>

        <h4>Sliding Window Implementasyonu (Sorted Set)</h4>
        <CodeBlock title="Sliding Window Rate Limiting">{`# Her istekte şu adımlar:

# 1. Pencere dışı eski istekleri temizle
ZREMRANGEBYSCORE rate:user:1001 0 <1-dakika-önceki-timestamp>

# 2. Mevcut istek sayısını kontrol et
ZCARD rate:user:1001

# 3. Limit aşılmadıysa yeni isteği ekle
ZADD rate:user:1001 <timestamp> <request-id>

# 4. Key'e TTL koy (temizlik için)
EXPIRE rate:user:1001 60

# ZCARD > limit ise → 429 Too Many Requests`}</CodeBlock>

        <h4>Fixed Window (Basit Sayaç)</h4>
        <CodeBlock title="Fixed Window Rate Limiting">{`# Her istekte:
INCR rate:user:1001:minute:202401151030
EXPIRE rate:user:1001:minute:202401151030 60

# Değer > limit ise → 429 Too Many Requests`}</CodeBlock>

        <h4>Rate Limiting Tek Başına Yetmez!</h4>
        <p>Gerçek sistemlerde rate limiting ilk savunma hattıdır. Ek güvenlik katmanları:</p>
        <ul>
          <li><strong>Account Lock:</strong> N başarısız denemede hesap geçici kilitlenir</li>
          <li><strong>CAPTCHA:</strong> Bot/insan ayrımı yapar</li>
          <li><strong>IP Ban:</strong> Sürekli saldıran IP tamamen engellenir</li>
          <li><strong>Exponential Backoff:</strong> Her başarısız denemede bekleme süresi katlanır (1s → 2s → 4s → 8s...)</li>
          <li><strong>MFA:</strong> Şifre + ikinci doğrulama (SMS, Auth app)</li>
        </ul>
        <div className="tip-box">
          <strong>Gerçek sistem yaklaşımı:</strong> Redis rate limit (ilk filtre) → Account Lock (brute-force engeli) → CAPTCHA (bot kontrolü) → MFA (kimlik doğrulama) → IP Ban (agresif saldırı engeli). Bu katmanlar birlikte çalışır.
        </div>
      </TheorySection>

      {/* 14. Komut Referans Tabloları */}
      <TheorySection title="14. Komut Referans Tabloları">
        <h4>String Komutları</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Karmaşıklık</th><th>Açıklama</th></tr>
          </thead>
          <tbody>
            <tr><td><code>SET</code></td><td>O(1)</td><td>Değer ata</td></tr>
            <tr><td><code>GET</code></td><td>O(1)</td><td>Değer oku</td></tr>
            <tr><td><code>DEL</code></td><td>O(1)</td><td>Key sil</td></tr>
            <tr><td><code>INCR/DECR</code></td><td>O(1)</td><td>Atomik artır/azalt</td></tr>
            <tr><td><code>APPEND</code></td><td>O(1)*</td><td>Değere ekle</td></tr>
            <tr><td><code>MSET/MGET</code></td><td>O(N)</td><td>Çoklu atama/okuma</td></tr>
            <tr><td><code>SETNX</code></td><td>O(1)</td><td>Sadece yoksa ata</td></tr>
          </tbody>
        </table>

        <h4>List Komutları</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Karmaşıklık</th><th>Açıklama</th></tr>
          </thead>
          <tbody>
            <tr><td><code>LPUSH/RPUSH</code></td><td>O(1)</td><td>Başa/sona ekle</td></tr>
            <tr><td><code>LPOP/RPOP</code></td><td>O(1)</td><td>Baştan/sondan çıkar</td></tr>
            <tr><td><code>LRANGE</code></td><td>O(S+N)</td><td>Aralık getir</td></tr>
            <tr><td><code>LLEN</code></td><td>O(1)</td><td>Uzunluk</td></tr>
            <tr><td><code>LINDEX</code></td><td>O(N)</td><td>Index ile eriş</td></tr>
            <tr><td><code>LTRIM</code></td><td>O(N)</td><td>Listeyi kırp</td></tr>
          </tbody>
        </table>

        <h4>Set Komutları</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Karmaşıklık</th><th>Açıklama</th></tr>
          </thead>
          <tbody>
            <tr><td><code>SADD</code></td><td>O(1)</td><td>Eleman ekle</td></tr>
            <tr><td><code>SREM</code></td><td>O(1)</td><td>Eleman sil</td></tr>
            <tr><td><code>SISMEMBER</code></td><td>O(1)</td><td>Üyelik kontrolü</td></tr>
            <tr><td><code>SMEMBERS</code></td><td>O(N)</td><td>Tüm elemanlar</td></tr>
          </tbody>
        </table>

        <h4>Hash Komutları</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Karmaşıklık</th><th>Açıklama</th></tr>
          </thead>
          <tbody>
            <tr><td><code>HSET</code></td><td>O(1)</td><td>Field ata</td></tr>
            <tr><td><code>HGET</code></td><td>O(1)</td><td>Field oku</td></tr>
            <tr><td><code>HGETALL</code></td><td>O(N)</td><td>Tüm field'lar</td></tr>
            <tr><td><code>HDEL</code></td><td>O(1)</td><td>Field sil</td></tr>
            <tr><td><code>HINCRBY</code></td><td>O(1)</td><td>Sayısal field artır</td></tr>
          </tbody>
        </table>

        <h4>Sorted Set Komutları</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Karmaşıklık</th><th>Açıklama</th></tr>
          </thead>
          <tbody>
            <tr><td><code>ZADD</code></td><td>O(log N)</td><td>Eleman ekle</td></tr>
            <tr><td><code>ZRANGE</code></td><td>O(log N + M)</td><td>Sıraya göre getir</td></tr>
            <tr><td><code>ZRANK</code></td><td>O(log N)</td><td>Sıra öğren</td></tr>
            <tr><td><code>ZSCORE</code></td><td>O(1)</td><td>Skor öğren</td></tr>
            <tr><td><code>ZREM</code></td><td>O(log N)</td><td>Eleman sil</td></tr>
          </tbody>
        </table>
        <h4>Transaction Komutları</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Karmaşıklık</th><th>Açıklama</th></tr>
          </thead>
          <tbody>
            <tr><td><code>MULTI</code></td><td>O(1)</td><td>Transaction başlat</td></tr>
            <tr><td><code>EXEC</code></td><td>O(N)</td><td>Kuyruklanmış komutları çalıştır</td></tr>
            <tr><td><code>DISCARD</code></td><td>O(1)</td><td>Transaction iptal et</td></tr>
            <tr><td><code>WATCH</code></td><td>O(1)</td><td>Key'i izlemeye al (optimistic lock)</td></tr>
            <tr><td><code>UNWATCH</code></td><td>O(1)</td><td>Tüm izlemeleri iptal et</td></tr>
          </tbody>
        </table>

        <h4>Pub/Sub Komutları</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Komut</th><th>Karmaşıklık</th><th>Açıklama</th></tr>
          </thead>
          <tbody>
            <tr><td><code>PUBLISH</code></td><td>O(N+M)</td><td>Kanala mesaj yayınla</td></tr>
            <tr><td><code>SUBSCRIBE</code></td><td>O(1)</td><td>Kanala abone ol</td></tr>
            <tr><td><code>UNSUBSCRIBE</code></td><td>O(1)</td><td>Aboneliği iptal et</td></tr>
            <tr><td><code>PSUBSCRIBE</code></td><td>O(1)</td><td>Pattern ile abone ol</td></tr>
          </tbody>
        </table>
      </TheorySection>

      {/* 15. Gerçek Dünya Örnekleri */}
      <TheorySection title="15. Gerçek Dünya Örnekleri">
        <h4>Örnek 1: Sayfa Görüntülenme Sayacı</h4>
        <CodeBlock title="Sayfa Görüntülenme Sayacı">{`# Her sayfa ziyaretinde
INCR page:views:homepage
INCR page:views:about

# Görüntülenme sayısını oku
GET page:views:homepage`}</CodeBlock>

        <h4>Örnek 2: Rate Limiting (Sliding Window)</h4>
        <CodeBlock title="Rate Limiting">{`# Her istekte
ZADD rate:user:1001 <timestamp> <request-id>
ZREMRANGEBYSCORE rate:user:1001 0 <1-dakika-önceki-timestamp>
ZCARD rate:user:1001
# ZCARD > limit ise istek reddet`}</CodeBlock>

        <h4>Örnek 3: Leaderboard</h4>
        <CodeBlock title="Leaderboard">{`ZADD game:leaderboard 1500 "alice"
ZADD game:leaderboard 2200 "bob"
ZADD game:leaderboard 1800 "charlie"

# En iyi 10
ZREVRANGE game:leaderboard 0 9 WITHSCORES

# Sıra öğren
ZREVRANK game:leaderboard "alice"`}</CodeBlock>

        <h4>Örnek 4: Son Aktiviteler</h4>
        <CodeBlock title="Son Aktiviteler">{`# Yeni aktivite ekle
LPUSH user:1001:activity "Login at 2024-01-15 10:30"
LTRIM user:1001:activity 0 49   # Son 50 aktivite

# Son 10 aktiviteyi getir
LRANGE user:1001:activity 0 9`}</CodeBlock>

        <h4>Örnek 5: Online Kullanıcılar</h4>
        <CodeBlock title="Online Kullanıcılar">{`# Kullanıcı online
SADD online:users "user:1001"

# Kullanıcı offline
SREM online:users "user:1001"

# Online kullanıcı sayısı
SCARD online:users

# Kullanıcı online mi?
SISMEMBER online:users "user:1001"`}</CodeBlock>
      </TheorySection>

      {/* Kaynaklar */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title">Kaynaklar</div>
        <ul>
          <li><a href="https://redis.io/docs/" target="_blank" rel="noopener noreferrer">Redis Resmi Dokümantasyon</a></li>
          <li><a href="https://redis.io/commands/" target="_blank" rel="noopener noreferrer">Redis Komut Referansı</a></li>
          <li><a href="https://spring.io/projects/spring-data-redis" target="_blank" rel="noopener noreferrer">Spring Data Redis</a></li>
          <li><a href="https://spring.io/projects/spring-session" target="_blank" rel="noopener noreferrer">Spring Session</a></li>
        </ul>
      </div>
    </div>
  );
}

export default DocsPage;
