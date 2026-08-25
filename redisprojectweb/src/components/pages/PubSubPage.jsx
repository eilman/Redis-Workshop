import { useState, useEffect, useRef, useCallback } from 'react';
import { TbBroadcast } from 'react-icons/tb';
import { Client } from '@stomp/stompjs';
import { pubsubApi } from '../../api/redisApi';
import InputField from '../common/InputField';
import ActionButton from '../common/ActionButton';
import CommandLog from '../common/CommandLog';
import TheorySection from '../common/TheorySection';

function PubSubPage() {
  const [publishChannel, setPublishChannel] = useState('news');
  const [publishMessage, setPublishMessage] = useState('Hello Redis!');
  const [subscribeChannel, setSubscribeChannel] = useState('news');
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChannels, setActiveChannels] = useState([]);
  const [stompConnected, setStompConnected] = useState(false);
  const [commands, setCommands] = useState([]);
  const [error, setError] = useState(null);

  const stompClientRef = useRef(null);
  const subscriptionsRef = useRef({});
  const messageFeedRef = useRef(null);

  const addCommand = (data) => {
    setCommands((prev) => [...prev, data]);
    setError(null);
  };

  const handleError = (err) => {
    const msg = err.response?.data?.result || err.message;
    setError(msg);
  };

  // Connect STOMP client
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setStompConnected(true);
      },
      onDisconnect: () => {
        setStompConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers.message);
        setStompConnected(false);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, []);

  // Auto-scroll message feed
  useEffect(() => {
    if (messageFeedRef.current) {
      messageFeedRef.current.scrollTop = messageFeedRef.current.scrollHeight;
    }
  }, [messages]);

  const subscribeToStompChannel = useCallback((channel) => {
    const client = stompClientRef.current;
    if (!client || !client.active) return;

    const destination = `/topic/pubsub/${channel}`;

    // Don't subscribe twice
    if (subscriptionsRef.current[channel]) return;

    const subscription = client.subscribe(destination, (message) => {
      try {
        const body = JSON.parse(message.body);
        setMessages((prev) => [...prev, {
          channel: body.channel || channel,
          message: body.message || body.data || message.body,
          timestamp: new Date().toLocaleTimeString(),
        }].slice(-100)); // Keep last 100 messages
      } catch {
        setMessages((prev) => [...prev, {
          channel,
          message: message.body,
          timestamp: new Date().toLocaleTimeString(),
        }].slice(-100));
      }
    });

    subscriptionsRef.current[channel] = subscription;
  }, []);

  const unsubscribeFromStompChannel = useCallback((channel) => {
    if (subscriptionsRef.current[channel]) {
      subscriptionsRef.current[channel].unsubscribe();
      delete subscriptionsRef.current[channel];
    }
  }, []);

  const handlePublish = async () => {
    if (!publishChannel.trim() || !publishMessage.trim()) return;
    try {
      const res = await pubsubApi.publish(publishChannel, publishMessage);
      addCommand(res.data);
    } catch (err) {
      handleError(err);
    }
  };

  const handleSubscribe = async () => {
    if (!subscribeChannel.trim()) return;
    if (subscribedChannels.includes(subscribeChannel)) return;
    try {
      const res = await pubsubApi.subscribe(subscribeChannel);
      addCommand(res.data);
      setSubscribedChannels((prev) => [...prev, subscribeChannel]);
      subscribeToStompChannel(subscribeChannel);
      await loadChannels();
    } catch (err) {
      handleError(err);
    }
  };

  const handleUnsubscribe = async (channel) => {
    try {
      const res = await pubsubApi.unsubscribe(channel);
      addCommand(res.data);
      setSubscribedChannels((prev) => prev.filter((c) => c !== channel));
      unsubscribeFromStompChannel(channel);
      await loadChannels();
    } catch (err) {
      handleError(err);
    }
  };

  const loadChannels = async () => {
    try {
      const res = await pubsubApi.channels();
      addCommand(res.data);
      const result = res.data.result;
      if (Array.isArray(result)) {
        setActiveChannels(result);
      } else {
        setActiveChannels([]);
      }
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    loadChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <TbBroadcast className="icon" />
          Pub/Sub
        </h1>
      </div>

      <TheorySection title="Pub/Sub - Temel Kavramlar">
        <p>
          Pub/Sub (Publish/Subscribe), Redis&apos;in sunduğu gerçek zamanlı mesajlaşma modelidir.
          Bir uygulama bir kanala mesaj yayınlar (<strong>publish</strong>), o kanalı dinleyen tüm uygulamalar
          mesajı anında alır (<strong>subscribe</strong>).
          {' '}<strong>Fire-and-forget</strong> yapısındadır — mesajlar Redis&apos;te saklanmaz, sadece o an bağlı olan
          subscriber&apos;lara iletilir. Chat uygulamaları, canlı bildirimler, canlı skor yayını ve
          microservice&apos;ler arası event iletimi gibi senaryolarda kullanılır.
        </p>
        <p>
          Günlük hayattan bir örnek: bir WhatsApp grubuna mesaj attığında, gruptaki herkes anında görür.
          Ama gruba sonradan katılan biri eski mesajları göremez. Pub/Sub de tam böyle çalışır —
          Publisher bir kanala mesaj gönderir, o kanalı dinleyen tüm subscriber&apos;lar anında alır.
          Kimse dinlemiyorsa mesaj kaybolur.
        </p>

        {/* Görsel: Pub/Sub mimarisi diyagramı */}
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
          padding: 16, marginBottom: 16, overflowX: 'auto',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 12, minWidth: 400, fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
          }}>
            {/* Publisher */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Publisher</div>
              <div style={{
                background: 'rgba(0,212,255,0.15)', border: '2px solid var(--accent-blue)',
                borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontWeight: 700, color: 'var(--accent-blue)',
              }}>
                PUBLISH
              </div>
            </div>
            {/* Ok */}
            <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>&rarr;</div>
            {/* Channel */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Channel</div>
              <div style={{
                background: 'rgba(231,76,60,0.15)', border: '2px solid var(--redis-red)',
                borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontWeight: 700, color: 'var(--redis-red)',
              }}>
                #news
              </div>
            </div>
            {/* Ok */}
            <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>&rarr;</div>
            {/* Subscribers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Subscribers</div>
              {['Sub-1', 'Sub-2', 'Sub-3'].map((s) => (
                <div key={s} style={{
                  background: 'rgba(0,255,136,0.15)', border: '2px solid var(--accent-green)',
                  borderRadius: 'var(--radius-sm)', padding: '4px 12px', fontWeight: 600,
                  color: 'var(--accent-green)', fontSize: '0.75rem', textAlign: 'center',
                }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        <h4>Avantajlar</h4>
        <div className="feature-grid" style={{ marginBottom: 16 }}>
          {[
            { icon: '🚀', title: 'Çok Hızlı', desc: 'Tüm iletişim RAM üzerinden gerçekleşir, mikrosaniye seviyesinde.' },
            { icon: '⚡', title: 'Gerçek Zamanlı', desc: 'Mesajlar anında iletilir, polling gerekmez.' },
            { icon: '🔗', title: 'Loosely Coupled', desc: 'Publisher ve Subscriber birbirini tanımak zorunda değil.' },
            { icon: '🛠', title: 'Basit Kurulum', desc: 'Ekstra araç kurmaya gerek yok, Redis zaten mevcut.' },
          ].map((item) => (
            <div className="feature-card" key={item.title}>
              <div className="feature-icon" style={{ fontSize: '1.6rem' }}>{item.icon}</div>
              <div className="feature-title">{item.title}</div>
              <div className="feature-desc">{item.desc}</div>
            </div>
          ))}
        </div>

        <h4>Kullanım Alanları</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {[
            { label: 'WebSocket Bildirimleri', color: 'var(--accent-blue)' },
            { label: 'Chat Uygulamaları', color: 'var(--accent-green)' },
            { label: 'Canlı Skor / Borsa', color: 'var(--accent-orange)' },
            { label: 'Log / Metrik Yayını', color: '#9B59B6' },
            { label: 'Cache Invalidation', color: 'var(--redis-red)' },
            { label: 'Microservice Events', color: 'var(--accent-blue)' },
          ].map((chip) => (
            <span key={chip.label} style={{
              display: 'inline-block', padding: '6px 14px',
              background: 'var(--bg-input)', border: `1.5px solid ${chip.color}`,
              borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, color: chip.color,
            }}>
              {chip.label}
            </span>
          ))}
        </div>

        <h4>Dezavantajlar</h4>
        <div className="warning-box" style={{marginBottom: 12}}>
          <ul style={{margin: 0, paddingLeft: 20}}>
            <li><strong>Mesaj kuyruğu yok:</strong> Mesajlar saklanmaz, subscriber bağlı değilse mesaj kaybolur</li>
            <li><strong>Retry mekanizması yok:</strong> Başarısız mesajlar tekrar gönderilmez</li>
            <li><strong>ACK (onay) yok:</strong> Mesajın alınıp alınmadığı doğrulanamaz</li>
            <li><strong>Offline subscriber mesaj okuyamaz:</strong> Sadece bağlıyken mesaj alabilir</li>
          </ul>
        </div>

        <h4>Analoji: Radyo vs Netflix/YouTube</h4>
        {/* Görsel: Radyo vs Netflix karşılaştırması */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{
            flex: '1 1 180px', background: 'rgba(231,76,60,0.1)', border: '2px solid var(--redis-red)',
            borderRadius: 'var(--radius-sm)', padding: 14, textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>📻</div>
            <div style={{ fontWeight: 700, color: 'var(--redis-red)', fontSize: '0.9rem' }}>Pub/Sub = Radyo</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
              Canlı yayın. Açık değilsen kaçırırsın. Geri sarma yok.
            </div>
          </div>
          <div style={{
            flex: '1 1 180px', background: 'rgba(0,255,136,0.1)', border: '2px solid var(--accent-green)',
            borderRadius: 'var(--radius-sm)', padding: 14, textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>🎬</div>
            <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.9rem' }}>Streams = Netflix</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
              İstediğin zaman izle. Geçmiş içerikler kayıtlı.
            </div>
          </div>
        </div>

        <h4>Redis Streams ile Farkı</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Özellik</th><th>Pub/Sub</th><th>Streams</th></tr>
          </thead>
          <tbody>
            <tr><td>Mesaj Kalıcılığı</td><td style={{ color: 'var(--redis-red)' }}>Yok (kaybolabilir)</td><td style={{ color: 'var(--accent-green)' }}>Var (saklanir)</td></tr>
            <tr><td>Consumer Groups</td><td style={{ color: 'var(--redis-red)' }}>Yok</td><td style={{ color: 'var(--accent-green)' }}>Var</td></tr>
            <tr><td>Retry / ACK</td><td style={{ color: 'var(--redis-red)' }}>Yok</td><td style={{ color: 'var(--accent-green)' }}>Var</td></tr>
            <tr><td>Performans</td><td style={{ color: 'var(--accent-green)' }}>Çok hızlı</td><td>Hızlı</td></tr>
            <tr><td>Kullanim</td><td>Bildirimler, chat</td><td>Event sourcing, log</td></tr>
          </tbody>
        </table>

        <h4>Alternatifler</h4>
        <table className="theory-table">
          <thead>
            <tr><th>Araç</th><th>Ne Zaman Tercih Edilir?</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Redis Streams</strong></td><td>Mesaj kalıcılığı ve consumer group gerektiğinde (Redis ekosisteminde kalarak)</td></tr>
            <tr><td><strong>RabbitMQ</strong></td><td>Gelişmiş kuyruk özellikleri, routing, retry ve ACK gerektiğinde</td></tr>
            <tr><td><strong>Apache Kafka</strong></td><td>Yüksek hacimli, dağıtık, log-tabanlı event streaming gerektiğinde</td></tr>
          </tbody>
        </table>

        <h4>Bu Örnek Ne Gösteriyor?</h4>
        <ul>
          <li><strong>Publisher (sol):</strong> Bir kanal adı ve mesaj yazarak <code>PUBLISH</code> komutuyla mesaj gönderirsin. Mesaj Redis üzerinden o kanalı dinleyen herkese iletilir</li>
          <li><strong>Subscriber (sağ):</strong> Bir kanala <code>SUBSCRIBE</code> olursun. O kanaldan gelen mesajlar Live Message Feed&apos;de anlık olarak görünür</li>
          <li><strong>Birden fazla kanal:</strong> Farklı kanallara abone olabilirsin (örn. &quot;news&quot;, &quot;alerts&quot;). Her kanalın mesajları ayrı ayrı gelir</li>
          <li><strong>Fire-and-forget:</strong> Subscriber olmadan mesaj gönderirsen, mesaj kaybolur — kimse almaz. Bunu test etmek için önce publish et, sonra subscribe ol ve mesajın gelmediğini gör</li>
        </ul>
      </TheorySection>

      <div className="two-columns" style={{ marginBottom: 16 }}>
        {/* Publisher */}
        <div className="card">
          <div className="card-title">
            <TbBroadcast className="icon" />
            Publisher
          </div>

          <div className="form-row">
            <InputField label="Channel" value={publishChannel} onChange={setPublishChannel} placeholder="Channel name" />
          </div>

          <div className="form-row">
            <InputField label="Message" value={publishMessage} onChange={setPublishMessage} placeholder="Enter message" />
          </div>

          <ActionButton variant="primary" onClick={handlePublish}>PUBLISH</ActionButton>

          <div style={{ marginTop: 16 }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
            }}>
              Active Channels
            </div>
            {activeChannels.length === 0 ? (
              <div className="empty-state" style={{ padding: 12, fontSize: '0.8rem' }}>
                No active channels
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {activeChannels.map((ch, index) => (
                  <span key={index} className="chip">
                    {String(ch)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Subscriber */}
        <div className="card">
          <div className="card-title">
            <TbBroadcast className="icon" />
            Subscriber
            <span style={{
              marginLeft: 'auto',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span className={`connection-dot${stompConnected ? '' : ' disconnected'}`} />
              {stompConnected ? 'WebSocket Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="form-row">
            <InputField label="Channel" value={subscribeChannel} onChange={setSubscribeChannel} placeholder="Channel to subscribe" />
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <ActionButton variant="success" onClick={handleSubscribe}>Subscribe</ActionButton>
            </div>
          </div>

          {subscribedChannels.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}>
                Subscribed Channels
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {subscribedChannels.map((ch) => (
                  <span key={ch} className="chip" style={{ borderColor: 'var(--accent-green)' }}>
                    {ch}
                    <span
                      className="chip-remove"
                      onClick={() => handleUnsubscribe(ch)}
                      title="Unsubscribe"
                    >
                      x
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 6,
          }}>
            Live Message Feed
          </div>
          <div className="message-feed" ref={messageFeedRef}>
            {messages.length === 0 ? (
              <div className="empty-state" style={{ padding: 12, fontSize: '0.8rem' }}>
                No messages received yet. Subscribe to a channel and publish some messages.
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="message-item fade-in">
                  <div className="message-channel">#{msg.channel}</div>
                  <div className="message-body">{msg.message}</div>
                  <div className="message-time">{msg.timestamp}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <CommandLog commands={commands} onClear={() => setCommands([])} />

      {/* Soru-Cevap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Soru & Cevap</div>
        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            WhatsApp grubuna mesaj gönderdiğinde çevrimdışı olan arkadaşın mesajı görebilir. Pub/Sub&apos;da da durum aynı mı?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Hayır, aynı değil. WhatsApp mesajları sunucuda saklanır ve arkadaşın çevrimiçi olduğunda iletilir.
            Ama Redis Pub/Sub &quot;fire-and-forget&quot; (gönder ve unut) mantığıyla çalışır — mesaj gönderildiği anda
            kim dinliyorsa ona ulaşır, dinlemeyen kaçırır. Mesajların saklanması gerekiyorsa Redis Streams gibi farklı bir yapı kullanılmalıdır.
          </div>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Bir sistem neden doğrudan API çağrısı yerine Pub/Sub kullanır?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Doğrudan API çağrısında gönderici alıcıyı tanımalı ve yanıt beklemeli. Pub/Sub&apos;da ise gönderici alıcıyı bilmek zorunda değil — sadece kanala mesaj bırakır.
            Bu sayede sistemler birbirinden bağımsız çalışabilir. Örneğin sipariş servisi &quot;yeni sipariş&quot; mesajı yayınlar;
            stok servisi, bildirim servisi ve fatura servisi bu mesajı ayrı ayrı dinler. Gönderici tek bir mesaj gönderir, birden fazla sistem tepki verir.
          </div>
        </details>
      </div>
    </div>
  );
}

export default PubSubPage;
