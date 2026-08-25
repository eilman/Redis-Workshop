# Redis Best Practices

## 1. Key İsimlendirme

### Kurallar

```
# İyi key isimlendirme
user:1000:profile          # object:id:field
order:2024-01:items        # tarih bazlı gruplama
cache:product:5001         # namespace ile ayrım
session:abc123xyz          # oturum tanımlayıcı

# Kötü key isimlendirme
myKey                      # Anlamsız
user_1000_profile          # Tutarsız ayırıcı (_ yerine : kullanın)
u:1000:p                   # Çok kısa, anlaşılmaz
this:is:a:very:long:key:that:wastes:memory  # Gereksiz uzun
```

### İsimlendirme İlkeleri

| İlke | Açıklama |
|------|----------|
| `:` ayırıcı kullanın | Redis ekosisteminde standart ayırıcıdır |
| Namespace ekleyin | `app:module:entity:id` formatı çakışmayı önler |
| Kısa ama anlamlı tutun | Her key bellekte yer kaplar, ama okunabilirlik de önemli |
| Büyük/küçük harf tutarlılığı | Tamamını küçük harf yapın veya camelCase kullanın, karıştırmayın |
| Versiyon ekleyin (gerekirse) | `v2:user:1000:profile` - schema değişikliklerinde faydalı |

---

## 2. Memory Yönetimi

### Memory Kullanımını İzleme

```redis
# Toplam memory bilgisi
INFO memory

# Belirli bir key'in memory kullanımı
MEMORY USAGE user:1000:profile

# Key sayısı
DBSIZE

# Tüm istatistikler
INFO stats
```

### Memory Optimizasyonu

- **Kısa key isimleri kullanın**: Her karakter memory tüketir. `user:1000` vs `u:1000` arasında binlerce key'de ciddi fark oluşur
- **TTL atayın**: Geçici verilere mutlaka expire süresi verin
- **Doğru veri yapısını seçin**: Küçük hash'ler, ayrı string key'lerden daha az memory kullanır (ziplist encoding)
- **Büyük key'lerden kaçının**: Tek bir key'de MB'larca veri tutmak tehlikelidir
- **UNLINK kullanın**: Büyük key'leri silerken `DEL` yerine `UNLINK` kullanın (async silme)

### Memory Limitleri

```
# redis.conf veya CONFIG SET ile
maxmemory 256mb
maxmemory-policy allkeys-lru
```

> **Kural**: Production'da mutlaka `maxmemory` ayarlanmalıdır. Ayarlanmazsa Redis tüm RAM'i tüketebilir ve OOM killer tarafından sonlandırılabilir.

---

## 3. Eviction Policy (Tahliye Politikası)

`maxmemory` limitine ulaşıldığında Redis'in hangi key'leri sileceğini belirler.

| Policy | Açıklama | Kullanım |
|--------|----------|----------|
| `noeviction` | Yeni yazma reddedilir | Veri kaybı kabul edilemez |
| `allkeys-lru` | En az kullanılan key silinir | Genel amaçlı cache |
| `allkeys-lfu` | En az sıklıkta kullanılan silinir | Popülerlik bazlı cache |
| `volatile-lru` | TTL'li key'lerden LRU silinir | Karışık veri + cache |
| `volatile-lfu` | TTL'li key'lerden LFU silinir | Karışık veri + cache |
| `allkeys-random` | Rastgele key silinir | Homojen erişim pattern'i |
| `volatile-random` | TTL'li key'lerden rastgele silinir | Nadir kullanılır |
| `volatile-ttl` | En kısa TTL'li key silinir | TTL öncelikli tahliye |

### Öneriler

- **Cache olarak kullanıyorsanız**: `allkeys-lru` veya `allkeys-lfu`
- **Hem cache hem kalıcı veri varsa**: `volatile-lru` (kalıcı key'lere TTL vermeyin)
- **Veri kaybı kabul edilemezse**: `noeviction` + yeterli memory

---

## 4. Cache Pattern'leri

### Cache-Aside (Lazy Loading)

En yaygın pattern. Uygulama önce cache'e bakar, yoksa veritabanından okur ve cache'e yazar.

```java
public User getUser(Long id) {
    String key = "user:" + id;

    // 1. Cache'e bak
    User cached = redisTemplate.opsForValue().get(key);
    if (cached != null) {
        return cached; // Cache hit
    }

    // 2. DB'den oku
    User user = userRepository.findById(id).orElseThrow();

    // 3. Cache'e yaz (TTL ile)
    redisTemplate.opsForValue().set(key, user, Duration.ofMinutes(30));

    return user;
}
```

**Artıları**: Sadece istenen veri cache'lenir, cache hatası tolere edilebilir.
**Eksileri**: İlk istek yavaş (cache miss), cache ile DB arasında tutarsızlık olabilir.

### Write-Through

Her yazma işlemi hem cache'e hem veritabanına yapılır.

```java
public User updateUser(Long id, UserDto dto) {
    User user = userRepository.save(toEntity(dto));

    // Cache'i güncelle
    String key = "user:" + id;
    redisTemplate.opsForValue().set(key, user, Duration.ofMinutes(30));

    return user;
}
```

**Artıları**: Cache her zaman güncel.
**Eksileri**: Her yazma işlemi yavaşlar, hiç okunmayan veriler de cache'lenir.

### Write-Behind (Write-Back)

Yazma işlemi önce cache'e yapılır, veritabanına asenkron olarak yazılır.

**Artıları**: Yazma işlemleri çok hızlı, batch yazma mümkün.
**Eksileri**: Veri kaybı riski (Redis çökerse), implementasyon karmaşık.

### Cache Invalidation

```java
// Veri güncellendiğinde cache'i sil
public void updateUser(Long id, UserDto dto) {
    userRepository.save(toEntity(dto));
    redisTemplate.delete("user:" + id);  // Güncelleme yerine silme önerilir
}
```

> **Önemli**: Cache güncelleme yerine cache silme (invalidation) tercih edin. Bu, race condition riskini azaltır.

### Cache Stampede Koruması

Popüler bir key expire olduğunda aynı anda çok sayıda istek veritabanına gidebilir.

```java
// Mutex/Lock ile koruma
public User getUserWithLock(Long id) {
    String key = "user:" + id;
    User cached = redisTemplate.opsForValue().get(key);
    if (cached != null) return cached;

    String lockKey = "lock:" + key;
    Boolean acquired = redisTemplate.opsForValue()
        .setIfAbsent(lockKey, "1", Duration.ofSeconds(10));

    if (Boolean.TRUE.equals(acquired)) {
        try {
            User user = userRepository.findById(id).orElseThrow();
            redisTemplate.opsForValue().set(key, user, Duration.ofMinutes(30));
            return user;
        } finally {
            redisTemplate.delete(lockKey);
        }
    }

    // Lock alınamadıysa kısa bekle ve tekrar dene
    Thread.sleep(50);
    return getUserWithLock(id);
}
```

---

## 5. Bağlantı Yönetimi (Connection Management)

### Connection Pooling

```yaml
# application.yml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      lettuce:
        pool:
          max-active: 16      # Maksimum aktif bağlantı
          max-idle: 8          # Maksimum boşta bağlantı
          min-idle: 2          # Minimum boşta bağlantı
          max-wait: 2000ms     # Bağlantı bekleme süresi
```

### Bağlantı Önerileri

| Parametre | Öneri | Açıklama |
|-----------|-------|----------|
| `max-active` | 8-32 | Uygulama başına, iş yüküne göre ayarlayın |
| `max-idle` | max-active/2 | Gereksiz bağlantı tutmayı önler |
| `min-idle` | 2-4 | Cold start'ı önler |
| `max-wait` | 1-5 saniye | Çok uzun bekleme uygulama timeout'una yol açar |
| `timeout` | 2000ms | Komut timeout süresi |

### Dikkat Edilmesi Gerekenler

- **Connection leak'lerden kaçının**: Her işlem sonrası bağlantı pool'a geri dönmeli
- **Pipeline kullanın**: Çok sayıda komutu tek seferde gönderin
- **Büyük komutlardan kaçının**: `KEYS *`, `SMEMBERS` (çok büyük set'ler), `HGETALL` (çok büyük hash'ler)
- **Timeout ayarlayın**: Hem connection hem command timeout belirleyin

---

## 6. Güvenlik

### Temel Güvenlik Adımları

```
# 1. Şifre belirleyin
requirepass your-strong-password-here

# 2. Tehlikeli komutları devre dışı bırakın
rename-command FLUSHALL ""
rename-command FLUSHDB ""
rename-command KEYS ""
rename-command CONFIG ""

# 3. Bind adresini sınırlayın
bind 127.0.0.1

# 4. Protected mode aktif olsun
protected-mode yes
```

### Spring Boot Güvenlik Ayarları

```yaml
spring:
  data:
    redis:
      password: ${REDIS_PASSWORD}    # Environment variable kullanın
      ssl:
        enabled: true                # Production'da SSL aktif olmalı
```

### Güvenlik Kontrol Listesi

- [ ] Redis şifresi ayarlandı mı?
- [ ] Redis sadece gerekli IP'lerden erişilebilir mi?
- [ ] Tehlikeli komutlar rename/disable edildi mi?
- [ ] Redis portu (6379) dışarıya açık değil mi?
- [ ] SSL/TLS aktif mi? (production)
- [ ] Redis kullanıcısı root olarak çalışmıyor mu?
- [ ] Redis log'ları izleniyor mu?

---

## 7. Production Checklist

### Deployment Öncesi

- [ ] **maxmemory** ayarlandı (toplam RAM'in %60-70'i)
- [ ] **maxmemory-policy** iş yüküne uygun seçildi
- [ ] **Persistence** yapılandırıldı (RDB + AOF önerilir)
- [ ] **Backup** stratejisi belirlendi
- [ ] **Monitoring** kuruldu (Redis INFO, Prometheus/Grafana)
- [ ] **Alerting** yapılandırıldı (memory, bağlantı sayısı, latency)

### Performans

- [ ] **Slow log** aktif (`slowlog-log-slower-than 10000`)
- [ ] **Pipeline** kullanılıyor (batch işlemler için)
- [ ] **Connection pooling** ayarlandı
- [ ] **Büyük key'ler** tespit edildi ve optimize edildi
- [ ] `KEYS` komutu yerine `SCAN` kullanılıyor

### Yüksek Erişilebilirlik (High Availability)

- [ ] **Redis Sentinel** veya **Redis Cluster** kuruldu
- [ ] **Replica** node'lar yapılandırıldı
- [ ] **Failover** senaryoları test edildi
- [ ] **Client-side** retry mekanizması var

### Uygulama Tarafı

- [ ] **TTL** tüm cache key'lerine atandı
- [ ] **Cache invalidation** stratejisi belirlendi
- [ ] **Error handling** Redis erişilemez olduğunda uygulama çalışmaya devam edebilir
- [ ] **Circuit breaker** pattern'i uygulandı (opsiyonel)
- [ ] **Serialization** formatı belirlendi (JSON vs MessagePack vs Protobuf)

### İzleme Metrikleri

| Metrik | Komut | Uyarı Eşiği |
|--------|-------|-------------|
| Memory kullanımı | `INFO memory` | > %80 maxmemory |
| Bağlantı sayısı | `INFO clients` | > %80 maxclients |
| Hit rate | `INFO stats` | < %80 |
| Evicted keys | `INFO stats` | Sürekli artış |
| Latency | `INFO latency` | > 1ms (p99) |
| Blocked clients | `INFO clients` | > 0 (uzun süre) |

---

## Özet

1. **Key'leri doğru isimlendirin**: `object:id:field` formatı, `:` ayırıcı
2. **TTL kullanın**: Tüm cache key'lerine expire süresi verin
3. **Memory'yi yönetin**: maxmemory + uygun eviction policy
4. **Doğru pattern'i seçin**: Cache-Aside çoğu senaryo için yeterli
5. **Bağlantıları yönetin**: Connection pooling, timeout, pipeline
6. **Güvenliği sağlayın**: Şifre, bind, tehlikeli komutları devre dışı bırakın
7. **İzleyin**: Memory, hit rate, latency metriklerini takip edin
