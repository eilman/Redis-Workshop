# Redis Temelleri

## Redis Nedir?

Redis (Remote Dictionary Server), açık kaynaklı, in-memory bir veri yapısı deposudur. Verileri RAM'de tutarak son derece hızlı okuma/yazma işlemleri sağlar. Database, cache, message broker ve streaming engine olarak kullanılabilir.

### Temel Özellikler

- **In-Memory**: Tüm veriler RAM'de tutulur, bu sayede mikrosaniye seviyesinde yanıt süreleri sağlanır
- **Single-Threaded**: Ana işlem tek thread üzerinde çalışır, bu sayede race condition sorunları yaşanmaz
- **Persistence**: RDB (snapshot) ve AOF (append-only file) ile veri kalıcılığı sağlanabilir
- **Replication**: Master-Replica yapısıyla yüksek erişilebilirlik sağlanır
- **Cluster**: Verilerin birden fazla node'a dağıtılmasıyla horizontal scaling yapılabilir

---

## Veri Yapıları (Data Structures)

### 1. String

En temel veri tipidir. Metin, sayı veya binary veri tutabilir. Maksimum 512 MB boyutunda olabilir.

```redis
# Değer atama ve okuma
SET user:name "Ahmet"
GET user:name              # "Ahmet"

# Sayısal işlemler
SET counter 10
INCR counter               # 11
INCRBY counter 5           # 16
DECR counter               # 15

# Birden fazla key ile çalışma
MSET key1 "val1" key2 "val2"
MGET key1 key2             # "val1", "val2"

# Koşullu atama (key yoksa set et)
SETNX user:name "Mehmet"   # 0 (key zaten var, set edilmedi)
```

**Kullanım Alanları**: Session bilgileri, cache, sayaçlar, rate limiting.

### 2. List

Sıralı string koleksiyonudur. Linked list olarak implemente edilmiştir. Baştan ve sondan ekleme/çıkarma O(1) complexity'ye sahiptir.

```redis
# Başa ve sona ekleme
LPUSH tasks "task1"        # Başa ekle
RPUSH tasks "task2"        # Sona ekle
LPUSH tasks "task0"        # Başa ekle

# Listeleme
LRANGE tasks 0 -1          # ["task0", "task1", "task2"]
LRANGE tasks 0 1           # ["task0", "task1"]

# Çıkarma
LPOP tasks                 # "task0" (baştan çıkar)
RPOP tasks                 # "task2" (sondan çıkar)

# Uzunluk
LLEN tasks                 # 1

# Blocking pop (queue pattern)
BLPOP tasks 30             # 30 saniye bekle, eleman gelince al
```

**Kullanım Alanları**: Message queue, activity feed, son görülen öğeler listesi.

### 3. Set

Benzersiz (unique) string'lerin sırasız koleksiyonudur. Eleman ekleme, çıkarma ve varlık kontrolü O(1) complexity'ye sahiptir.

```redis
# Eleman ekleme
SADD tags "redis" "cache" "nosql"
SADD tags "redis"          # 0 (zaten var, eklenmedi)

# Elemanları listeleme
SMEMBERS tags              # {"redis", "cache", "nosql"}

# Varlık kontrolü
SISMEMBER tags "redis"     # 1 (var)
SISMEMBER tags "sql"       # 0 (yok)

# Eleman sayısı
SCARD tags                 # 3

# Küme işlemleri
SADD tags2 "redis" "database" "fast"
SINTER tags tags2          # {"redis"} (kesişim)
SUNION tags tags2          # {"redis","cache","nosql","database","fast"} (birleşim)
SDIFF tags tags2           # {"cache","nosql"} (fark)
```

**Kullanım Alanları**: Etiketleme, benzersiz ziyaretçi takibi, ortak arkadaş bulma.

### 4. Hash

Field-value çiftlerinden oluşan bir yapıdır. Bir objenin birden fazla alanını tek bir key altında saklayabilirsiniz.

```redis
# Alan atama
HSET user:100 name "Ahmet" age "30" city "Istanbul"

# Tek alan okuma
HGET user:100 name         # "Ahmet"

# Tüm alanları okuma
HGETALL user:100           # {name: "Ahmet", age: "30", city: "Istanbul"}

# Alan varlık kontrolü
HEXISTS user:100 email     # 0 (yok)

# Sayısal alan artırma
HINCRBY user:100 age 1     # 31

# Birden fazla alan okuma
HMGET user:100 name city   # ["Ahmet", "Istanbul"]

# Alan silme
HDEL user:100 city
```

**Kullanım Alanları**: Kullanıcı profilleri, ürün bilgileri, session verileri, konfigürasyon ayarları.

### 5. Sorted Set (ZSet)

Set'e benzer ancak her elemana bir score (puan) atanır. Elemanlar score'a göre sıralıdır.

```redis
# Eleman ekleme (score ile)
ZADD leaderboard 100 "player1"
ZADD leaderboard 200 "player2"
ZADD leaderboard 150 "player3"

# Score'a göre sıralama (küçükten büyüğe)
ZRANGE leaderboard 0 -1 WITHSCORES
# player1:100, player3:150, player2:200

# Tersten sıralama (büyükten küçüğe)
ZREVRANGE leaderboard 0 -1 WITHSCORES
# player2:200, player3:150, player1:100

# Sıralama (rank) öğrenme
ZRANK leaderboard "player2"    # 2 (0-indexed, küçükten büyüğe)
ZREVRANK leaderboard "player2" # 0 (en yüksek score)

# Score güncelleme
ZINCRBY leaderboard 50 "player1"  # 150

# Score aralığına göre sorgulama
ZRANGEBYSCORE leaderboard 100 200

# Eleman sayısı
ZCARD leaderboard          # 3
```

**Kullanım Alanları**: Liderlik tabloları, öncelik kuyrukları, zaman bazlı sıralama, rate limiting.

---

## TTL (Time To Live)

Redis key'lerine otomatik silme süresi atanabilir. Cache mekanizması için kritik bir özelliktir.

```redis
# Saniye cinsinden süre atama
SET session:abc "data"
EXPIRE session:abc 3600        # 3600 saniye (1 saat) sonra silinecek

# Set ile birlikte süre atama
SET session:abc "data" EX 3600    # Saniye cinsinden
SET session:abc "data" PX 60000  # Milisaniye cinsinden

# Kalan süreyi öğrenme
TTL session:abc                # Kalan saniye (-1: süresiz, -2: key yok)
PTTL session:abc               # Kalan milisaniye

# Süreyi kaldırma (kalıcı yapma)
PERSIST session:abc

# Belirli bir zaman noktasında silme (Unix timestamp)
EXPIREAT session:abc 1735689600
```

### TTL Stratejileri

- **Lazy Expiration**: Key'e erişildiğinde süresi kontrol edilir
- **Active Expiration**: Redis periyodik olarak rastgele key'lerin süresini kontrol eder
- Her iki yöntem birlikte kullanılarak memory verimli şekilde yönetilir

---

## Pub/Sub (Publish/Subscribe)

Redis'in mesajlaşma mekanizmasıdır. Publisher'lar mesaj gönderir, subscriber'lar dinler. Mesajlar kalıcı değildir (fire-and-forget).

```redis
# Subscriber (Terminal 1)
SUBSCRIBE notifications
SUBSCRIBE chat:room1

# Pattern ile subscribe
PSUBSCRIBE chat:*          # chat: ile başlayan tüm kanallara abone ol

# Publisher (Terminal 2)
PUBLISH notifications "Yeni sipariş geldi!"
PUBLISH chat:room1 "Merhaba!"

# Aktif kanal sayısını öğrenme
PUBSUB CHANNELS
PUBSUB NUMSUB notifications
```

### Pub/Sub Özellikleri

- **Fire-and-Forget**: Mesajlar saklanmaz, çevrimdışı subscriber'lar mesajı kaçırır
- **Fan-out**: Bir mesaj tüm subscriber'lara iletilir
- **Pattern Matching**: Wildcard ile birden fazla kanala abone olunabilir
- Kalıcı mesajlaşma gerekiyorsa **Redis Streams** kullanılmalıdır

---

## Key Tasarımı (Key Design)

İyi bir key tasarımı, Redis'in verimli kullanımı için kritiktir.

### İsimlendirme Kuralları

```
# Format: object-type:id:field
user:1000:profile
user:1000:sessions
product:5001:details
order:2024:items

# Hiyerarşi için : (kolon) kullanılır
app:cache:user:1000
app:session:abc123

# Ortam ayrımı
dev:user:1000
prod:user:1000
```

### Key Tasarım İlkeleri

| İlke | Açıklama | Örnek |
|------|----------|-------|
| Anlamlı isimler | Key ne içerdiğini anlatmalı | `user:1000:name` ✅ `u1000n` ❌ |
| Tutarlı ayırıcı | Her yerde aynı ayırıcıyı kullan | `:` (kolon) önerilir |
| Kısa ama açık | Çok uzun key'ler memory israf eder | `usr:1000` yerine `user:1000` ✅ |
| Namespace kullanımı | Çakışmayı önler | `app1:user:1000`, `app2:user:1000` |

### Key Arama

```redis
# Pattern ile key arama (Production'da KEYS yerine SCAN kullanın!)
KEYS user:*                # Tüm user key'lerini bul (BLOCKING - tehlikeli!)

# SCAN ile güvenli arama
SCAN 0 MATCH user:* COUNT 100    # Cursor bazlı, non-blocking
```

> **Uyarı**: `KEYS` komutu production ortamında kullanılmamalıdır. Tüm key'leri taradığı için Redis'i bloklar. Bunun yerine `SCAN` kullanılmalıdır.

---

## Spring Boot ile Redis Kullanımı

Bu projede Redis, Spring Boot ile aşağıdaki şekillerde kullanılmaktadır:

```java
// RedisTemplate ile temel işlemler
@Autowired
private RedisTemplate<String, Object> redisTemplate;

// String işlemleri
redisTemplate.opsForValue().set("key", "value");
redisTemplate.opsForValue().set("key", "value", Duration.ofMinutes(30));

// Hash işlemleri
redisTemplate.opsForHash().put("user:100", "name", "Ahmet");
redisTemplate.opsForHash().entries("user:100");

// List işlemleri
redisTemplate.opsForList().rightPush("queue", "item1");
redisTemplate.opsForList().leftPop("queue");

// Set işlemleri
redisTemplate.opsForSet().add("tags", "redis", "cache");
redisTemplate.opsForSet().members("tags");

// Sorted Set işlemleri
redisTemplate.opsForZSet().add("leaderboard", "player1", 100);
redisTemplate.opsForZSet().reverseRangeWithScores("leaderboard", 0, 9);
```

---

## Özet Tablo

| Veri Yapısı | Açıklama | Tipik Kullanım |
|-------------|----------|----------------|
| **String** | Basit key-value | Cache, session, sayaç |
| **List** | Sıralı koleksiyon | Queue, feed, log |
| **Set** | Benzersiz koleksiyon | Etiket, benzersiz takip |
| **Hash** | Field-value map | Obje saklama, profil |
| **Sorted Set** | Puanlı benzersiz koleksiyon | Leaderboard, sıralama |
| **Pub/Sub** | Mesajlaşma | Bildirim, real-time |
