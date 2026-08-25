# Redis Workshop API

Redis veri yapilari ve ileri seviye ozelliklerini ogretmek icin tasarlanmis Spring Boot REST API.
Her endpoint, calistirilan Redis komutunu, sonucunu ve Turkce/Ingilizce aciklamasini dondurur.

## Gereksinimler

- Java 21
- Redis 7+
- Gradle 8+

## Calistirma

```bash
# Redis'i baslatin
redis-server

# Uygulamayi baslatin
./gradlew bootRun
```

Uygulama `http://localhost:8080` adresinde calisir.

### Environment Variables

| Degisken | Varsayilan | Aciklama |
|----------|-----------|----------|
| `REDIS_HOST` | `localhost` | Redis sunucu adresi |
| `REDIS_PORT` | `6379` | Redis port numarasi |

## API Endpoints

### String Islemleri (`/api/strings`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/strings` | Key-value cifti olustur |
| GET | `/api/strings/{key}` | Deger oku |
| DELETE | `/api/strings/{key}` | Key sil |
| POST | `/api/strings/{key}/increment` | Sayisal degeri artir |
| POST | `/api/strings/{key}/append` | Degere ekleme yap |

### List Islemleri (`/api/lists`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/lists/{key}/lpush` | Basina eleman ekle |
| POST | `/api/lists/{key}/rpush` | Sonuna eleman ekle |
| POST | `/api/lists/{key}/lpop` | Basindan eleman cikar |
| POST | `/api/lists/{key}/rpop` | Sonundan eleman cikar |
| GET | `/api/lists/{key}/range` | Aralik sorgula |
| GET | `/api/lists/{key}/length` | Uzunluk sorgula |

### Hash Islemleri (`/api/hashes`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/hashes/{key}` | Hash field ekle |
| GET | `/api/hashes/{key}/{field}` | Field degerini oku |
| GET | `/api/hashes/{key}` | Tum field'lari oku |
| DELETE | `/api/hashes/{key}/{field}` | Field sil |
| POST | `/api/hashes/{key}/{field}/increment` | Field degerini artir |

### Set Islemleri (`/api/sets`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/sets/{key}/add` | Eleman ekle |
| POST | `/api/sets/{key}/remove` | Eleman cikar |
| GET | `/api/sets/{key}/members` | Tum elemanlari listele |
| GET | `/api/sets/{key}/ismember` | Uyelik kontrolu |

### Sorted Set Islemleri (`/api/sortedsets`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/sortedsets/{key}/add` | Skorlu eleman ekle |
| GET | `/api/sortedsets/{key}/range` | Aralik sorgula |
| GET | `/api/sortedsets/{key}/rank/{member}` | Siralama sorgula |
| GET | `/api/sortedsets/{key}/score/{member}` | Skor sorgula |
| DELETE | `/api/sortedsets/{key}/{member}` | Eleman sil |

### TTL Islemleri (`/api/ttl`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| GET | `/api/ttl/{key}` | TTL sorgula |
| POST | `/api/ttl/{key}/expire` | TTL ayarla |
| POST | `/api/ttl/{key}/persist` | TTL kaldir |

### Cache Pattern (`/api/cache`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| GET | `/api/cache/user/{userId}` | Cache-aside pattern ile kullanici getir |
| DELETE | `/api/cache/user/{userId}` | Cache'den sil |
| GET | `/api/cache/stats` | Cache istatistikleri |
| POST | `/api/cache/reset` | Cache sifirla |

### Key Design (`/api/keys`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/keys/good` | Iyi key tasarimi ornegi |
| POST | `/api/keys/bad` | Kotu key tasarimi ornegi |
| GET | `/api/keys/scan` | SCAN ile key arama |
| GET | `/api/keys/{key}/info` | Key bilgisi sorgula |

### Distributed Lock (`/api/lock`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/lock/acquire` | Lock al |
| POST | `/api/lock/release` | Lock serbest birak |
| GET | `/api/lock/status/{lockKey}` | Lock durumu sorgula |

### Pub/Sub (`/api/pubsub`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/pubsub/publish` | Mesaj yayinla |
| POST | `/api/pubsub/subscribe` | Kanala abone ol |
| POST | `/api/pubsub/unsubscribe` | Aboneligi iptal et |
| GET | `/api/pubsub/channels` | Aktif kanallari listele |

### Rate Limiting (`/api/ratelimit`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/ratelimit/request/{clientId}` | Rate limit kontrolu ile istek |
| GET | `/api/ratelimit/status/{clientId}` | Rate limit durumu |
| POST | `/api/ratelimit/reset/{clientId}` | Rate limit sifirla |

### Transaction (`/api/transactions`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/transactions/transfer` | Atomik transfer |
| POST | `/api/transactions/multi-exec` | MULTI/EXEC demo |
| POST | `/api/transactions/watch-demo` | WATCH/MULTI/EXEC demo |

### Pipeline (`/api/pipeline`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/pipeline/benchmark` | Pipeline vs tekli benchmark |

### Session (`/api/session`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/session/login` | Oturum ac |
| GET | `/api/session/current` | Mevcut oturum bilgisi |
| POST | `/api/session/logout` | Oturum kapat |
| POST | `/api/session/attribute` | Session attribute ekle |
| GET | `/api/session/keys` | Redis'teki session key'lerini incele |

## Proje Yapisi

```
src/main/java/org/example/redisworkshop/
├── RedisWorkshopApplication.java
├── config/
│   ├── CorsConfig.java
│   ├── RedisConfig.java
│   ├── SessionConfig.java
│   └── WebSocketConfig.java
├── controller/
│   ├── StringController.java
│   ├── ListController.java
│   ├── HashController.java
│   ├── SetController.java
│   ├── SortedSetController.java
│   ├── TtlController.java
│   ├── CacheController.java
│   ├── KeyDesignController.java
│   ├── LockController.java
│   ├── PubSubController.java
│   ├── RateLimitController.java
│   ├── TransactionController.java
│   ├── PipelineController.java
│   └── SessionController.java
├── exception/
│   └── GlobalExceptionHandler.java
├── listener/
│   └── RedisMessageSubscriber.java
├── model/
│   ├── RedisCommandResult.java
│   ├── KeyValuePair.java
│   ├── PubSubMessage.java
│   └── CacheStats.java
└── service/
    ├── StringService.java
    ├── ListService.java
    ├── HashService.java
    ├── SetService.java
    ├── SortedSetService.java
    ├── TtlService.java
    ├── CacheService.java
    ├── KeyDesignService.java
    ├── LockService.java
    ├── PubSubService.java
    ├── RateLimitService.java
    ├── TransactionService.java
    ├── PipelineService.java
    └── SessionService.java
```
