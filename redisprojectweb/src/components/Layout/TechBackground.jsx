import { useMemo } from 'react';
import {
  TbDatabase, TbServer, TbKey, TbHash, TbList,
  TbCirclesRelation, TbSortAscending, TbClock,
  TbBroadcast, TbRocket, TbBolt, TbLock,
  TbTerminal2, TbCpu, TbCommand, TbStack2,
  TbCloud, TbNetwork, TbShieldLock, TbBinaryTree,
  TbApiApp, TbWorldWww, TbGitBranch, TbBox,
} from 'react-icons/tb';

const TEXTS = [
  'SET', 'GET', 'DEL', 'HSET', 'HGET', 'LPUSH', 'RPUSH', 'LPOP',
  'SADD', 'SREM', 'ZADD', 'ZRANK', 'INCR', 'EXPIRE', 'TTL',
  'PUBLISH', 'SUBSCRIBE', 'MULTI', 'EXEC', 'WATCH', 'SCAN',
  'KEYS *', 'PING', 'PONG', 'OK', 'nil',
  'key:value', 'user:1', 'cache:hit', 'session:abc',
  'O(1)', 'O(log N)', 'in-memory', 'redis-cli',
  'RDB', 'AOF', 'RESP', 'TCP', 'pub/sub',
];

const COLORS = ['', 'red', 'green', 'orange', 'purple', 'cyan', 'pink'];

const ICONS = [
  TbDatabase, TbServer, TbKey, TbHash, TbList,
  TbCirclesRelation, TbSortAscending, TbClock,
  TbBroadcast, TbRocket, TbBolt, TbLock,
  TbTerminal2, TbCpu, TbCommand, TbStack2,
  TbCloud, TbNetwork, TbShieldLock, TbBinaryTree,
  TbApiApp, TbWorldWww, TbGitBranch, TbBox,
];

const ICON_COLORS = ['', 'red', 'green', 'orange', 'purple', 'cyan', 'pink'];

function TechBackground() {
  const items = useMemo(() => {
    const result = [];

    // Falling text items
    for (let i = 0; i < 55; i++) {
      const text = TEXTS[i % TEXTS.length];
      const color = COLORS[i % COLORS.length];
      const left = ((i * 1.82) % 100);
      const duration = 12 + (i % 8) * 2.5;
      const delay = (i * 0.9) % 20;

      result.push(
        <span
          key={`t${i}`}
          className={`tech-bg-item ${color}`}
          style={{
            left: `${left}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        >
          {text}
        </span>
      );
    }

    // Falling icon items — more icons, with colors
    for (let i = 0; i < 30; i++) {
      const Icon = ICONS[i % ICONS.length];
      const color = ICON_COLORS[i % ICON_COLORS.length];
      const left = ((i * 3.4 + 2) % 100);
      const duration = 13 + (i % 6) * 3;
      const delay = (i * 1.2 + 1) % 20;
      const isLg = i % 4 === 0;

      result.push(
        <span
          key={`i${i}`}
          className={`tech-bg-item ${color}`}
          style={{
            left: `${left}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        >
          <span className={`tech-bg-icon ${isLg ? 'lg' : ''}`}><Icon /></span>
        </span>
      );
    }

    return result;
  }, []);

  return (
    <div className="tech-bg" aria-hidden="true">
      <div className="tech-bg-glow" />
      {items}
    </div>
  );
}

export default TechBackground;
