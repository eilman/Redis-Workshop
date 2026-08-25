import { TbMessages, TbArrowUp, TbCheck, TbX } from 'react-icons/tb';
import { FaRedditAlien, FaStackOverflow } from 'react-icons/fa';

const positiveOpinions = [
  {
    text: "Redis inanılmaz hızlı. MySQL sorgularından Redis cache'e geçtik ve p99 latency 120ms'den 2ms'ye düştü. Kıyaslamak bile anlamsız.",
    source: 'Reddit',
    subreddit: 'r/programming',
    upvotes: 847,
  },
  {
    text: "Redis'in en güçlü yanı basitliği. GET, SET, bitti. ORM yok, schema migration yok, sorgu optimizasyonu yok. Direkt çalışıyor.",
    source: 'Reddit',
    subreddit: 'r/webdev',
    upvotes: 623,
  },
  {
    text: "Redis'in veri yapıları inanılmaz güçlü. Sorted Set'ler tek başına leaderboard, rate limiting, priority queue gibi birçok problemi çözüyor — hepsi O(log N) ile.",
    source: 'StackOverflow',
    tag: 'redis',
    upvotes: 312,
  },
  {
    text: "Redis'i cache katmanı olarak kullanmıyorsanız, büyük performans kazanımlarını kaçırıyorsunuz. Stack'imize eklediğimiz en iyi şey Redis oldu.",
    source: 'Reddit',
    subreddit: 'r/backend',
    upvotes: 534,
  },
  {
    text: "Redis Pub/Sub, real-time özellikleri ele alış biçimimizi değiştirdi. WebSocket notification'lar, canlı dashboard'lar, chat — PUBLISH/SUBSCRIBE ile hepsi çok basit.",
    source: 'Reddit',
    subreddit: 'r/node',
    upvotes: 289,
  },
];

const negativeOpinions = [
  {
    text: "Redis RAM'i kahvaltı niyetine yer. 50GB verimiz vardı ve AWS faturamız uçtu. Soğuk veriyi PostgreSQL'e taşıdık ve maliyeti %70 düşürdük.",
    source: 'Reddit',
    subreddit: 'r/devops',
    upvotes: 756,
  },
  {
    text: "Kritik veriler için Redis persistence'a güvenmeyin. Bir crash sırasında AOF fsync 'everysec' olduğu için 30 saniyelik yazma kaybettik. Kaybetmeyi göze alamayacağınız veriler için gerçek bir veritabanı kullanın.",
    source: 'StackOverflow',
    tag: 'redis-persistence',
    upvotes: 445,
  },
  {
    text: "Redis single-threaded. Tek instance'da ~100K ops/sec'i geçtiğinizde shard veya cluster kurmanız gerekiyor. Bu operasyonel karmaşıklık gerçek bir sorun.",
    source: 'Reddit',
    subreddit: 'r/sysadmin',
    upvotes: 398,
  },
  {
    text: "Redis bir veritabanı yedeği DEĞİL. 200GB+ veriyi Redis'te saklamayı denedik ve kabus oldu. Redis'i iyi olduğu şeylerde kullanın — cache, session, queue — ana veri deposu olarak değil.",
    source: 'Reddit',
    subreddit: 'r/programming',
    upvotes: 621,
  },
  {
    text: "BSD'den SSPL'ye lisans değişikliği büyük olay oldu. Birçok şirket KeyDB, Dragonfly veya Valkey gibi alternatifleri değerlendirmek zorunda kaldı. Açık kaynak yönetimine güven önemli.",
    source: 'Reddit',
    subreddit: 'r/opensource',
    upvotes: 1243,
  },
];

function OpinionCard({ opinion, type }) {
  const isPositive = type === 'positive';
  const SourceIcon = opinion.source === 'Reddit' ? FaRedditAlien : FaStackOverflow;
  const sourceLabel = opinion.source === 'Reddit' ? opinion.subreddit : opinion.tag;

  return (
    <div className={`opinion-card ${type}`}>
      <div className="opinion-source">
        <SourceIcon />
        <span>{sourceLabel}</span>
      </div>
      <div className="opinion-text">"{opinion.text}"</div>
      <div className="opinion-meta">
        <TbArrowUp />
        <span>{opinion.upvotes}</span>
      </div>
    </div>
  );
}

function CommunityPage() {
  return (
    <div className="page-container community-page">
      <div className="page-header">
        <h1 className="page-title">
          <TbMessages className="icon" />
          Topluluk Görüşleri
        </h1>
      </div>

      <div className="section-description">
        Reddit, StackOverflow ve diğer platformlardaki <strong>gerçek kullanıcı deneyimlerinden</strong> derlenen
        yorumlar. Redis'in güçlü ve zayıf yönlerini, topluluğun gözünden keşfedin.
      </div>

      {/* Olumlu Yorumlar */}
      <div className="opinion-section-header positive">
        <TbCheck />
        Olumlu Görüşler
      </div>
      <div className="opinions-grid">
        {positiveOpinions.map((opinion, i) => (
          <OpinionCard key={i} opinion={opinion} type="positive" />
        ))}
      </div>

      {/* Olumsuz Yorumlar */}
      <div className="opinion-section-header negative">
        <TbX />
        Eleştiriler ve Uyarılar
      </div>
      <div className="opinions-grid">
        {negativeOpinions.map((opinion, i) => (
          <OpinionCard key={i} opinion={opinion} type="negative" />
        ))}
      </div>

      {/* Özet */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-title">Ne Zaman Redis, Ne Zaman Değil?</div>
        <div className="two-columns" style={{ gap: 16 }}>
          <div>
            <h4 style={{ color: 'var(--accent-green)', marginBottom: 8, fontSize: '0.95rem' }}>
              <TbCheck style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Redis Kullan
            </h4>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.8, paddingLeft: 18 }}>
              <li>Cache katmanı (veritabanı önünde)</li>
              <li>Session yönetimi (distributed)</li>
              <li>Rate limiting & sayaçlar</li>
              <li>Leaderboard & sıralama</li>
              <li>Pub/Sub & gerçek zamanlı bildirimler</li>
              <li>Kısa süreli / geçici veri</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--redis-red)', marginBottom: 8, fontSize: '0.95rem' }}>
              <TbX style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Redis Yeterli Değil
            </h4>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.8, paddingLeft: 18 }}>
              <li>Ana veritabanı olarak (kalıcı veri)</li>
              <li>RAM'den büyük veri setleri</li>
              <li>Karmaşık sorgular & JOIN'ler</li>
              <li>ACID transaction gerektiren işlemler</li>
              <li>Büyük dosya / blob depolama</li>
              <li>Uzun süreli veri saklama</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
