import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Strings API ---
export const stringApi = {
  set: (key, value) =>
    api.post('/strings', { key, value }),
  get: (key) =>
    api.get(`/strings/${encodeURIComponent(key)}`),
  del: (key) =>
    api.delete(`/strings/${encodeURIComponent(key)}`),
  increment: (key) =>
    api.post(`/strings/${encodeURIComponent(key)}/increment`),
  append: (key, value) =>
    api.post(`/strings/${encodeURIComponent(key)}/append`, { value }),
};

// --- Lists API ---
export const listApi = {
  lpush: (key, value) =>
    api.post(`/lists/${encodeURIComponent(key)}/lpush`, { value }),
  rpush: (key, value) =>
    api.post(`/lists/${encodeURIComponent(key)}/rpush`, { value }),
  lpop: (key) =>
    api.post(`/lists/${encodeURIComponent(key)}/lpop`),
  rpop: (key) =>
    api.post(`/lists/${encodeURIComponent(key)}/rpop`),
  lrange: (key) =>
    api.get(`/lists/${encodeURIComponent(key)}/range`),
  llen: (key) =>
    api.get(`/lists/${encodeURIComponent(key)}/length`),
};

// --- Sets API ---
export const setApi = {
  add: (key, value) =>
    api.post(`/sets/${encodeURIComponent(key)}/add`, { value }),
  remove: (key, value) =>
    api.post(`/sets/${encodeURIComponent(key)}/remove`, { value }),
  members: (key) =>
    api.get(`/sets/${encodeURIComponent(key)}/members`),
  isMember: (key, value) =>
    api.get(`/sets/${encodeURIComponent(key)}/ismember`, { params: { value } }),
};

// --- Hashes API ---
export const hashApi = {
  set: (key, field, value) =>
    api.post(`/hashes/${encodeURIComponent(key)}`, { field, value }),
  get: (key, field) =>
    api.get(`/hashes/${encodeURIComponent(key)}/${encodeURIComponent(field)}`),
  getAll: (key) =>
    api.get(`/hashes/${encodeURIComponent(key)}`),
  del: (key, field) =>
    api.delete(`/hashes/${encodeURIComponent(key)}/${encodeURIComponent(field)}`),
  increment: (key, field, delta) =>
    api.post(`/hashes/${encodeURIComponent(key)}/${encodeURIComponent(field)}/increment`, { delta }),
};

// --- Sorted Sets API ---
export const sortedSetApi = {
  add: (key, value, score) =>
    api.post(`/sortedsets/${encodeURIComponent(key)}/add`, { value, score }),
  range: (key, start = 0, end = -1) =>
    api.get(`/sortedsets/${encodeURIComponent(key)}/range`, { params: { start, end } }),
  rank: (key, member) =>
    api.get(`/sortedsets/${encodeURIComponent(key)}/rank/${encodeURIComponent(member)}`),
  score: (key, member) =>
    api.get(`/sortedsets/${encodeURIComponent(key)}/score/${encodeURIComponent(member)}`),
  remove: (key, member) =>
    api.delete(`/sortedsets/${encodeURIComponent(key)}/${encodeURIComponent(member)}`),
};

// --- TTL API ---
export const ttlApi = {
  setWithTtl: (key, value, ttlSeconds) =>
    api.post('/ttl', { key, value, ttlSeconds }),
  remaining: (key) =>
    api.get(`/ttl/${encodeURIComponent(key)}`),
  expire: (key, ttlSeconds) =>
    api.post(`/ttl/${encodeURIComponent(key)}/expire`, { ttlSeconds }),
  persist: (key) =>
    api.post(`/ttl/${encodeURIComponent(key)}/persist`),
};

// --- Cache API ---
export const cacheApi = {
  getUser: (userId) =>
    api.get(`/cache/user/${encodeURIComponent(userId)}`),
  invalidateUser: (userId) =>
    api.delete(`/cache/user/${encodeURIComponent(userId)}`),
  stats: () =>
    api.get('/cache/stats'),
  reset: () =>
    api.post('/cache/reset'),
};

// --- Key Design API ---
export const keyDesignApi = {
  demoGood: (data) =>
    api.post('/keys/good', data),
  demoBad: (data) =>
    api.post('/keys/bad', data),
  scan: (pattern) =>
    api.get('/keys/scan', { params: { pattern } }),
  info: (key) =>
    api.get(`/keys/${encodeURIComponent(key)}/info`),
};

// --- Pub/Sub API ---
export const pubsubApi = {
  publish: (channel, message) =>
    api.post('/pubsub/publish', { channel, message }),
  subscribe: (channel) =>
    api.post('/pubsub/subscribe', { channel }),
  unsubscribe: (channel) =>
    api.post('/pubsub/unsubscribe', { channel }),
  channels: () =>
    api.get('/pubsub/channels'),
};

// --- Session API ---
export const sessionApi = {
  login: (username) =>
    api.post('/session/login', { username }),
  me: () =>
    api.get('/session/current'),
  logout: () =>
    api.post('/session/logout'),
  setAttribute: (key, value) =>
    api.post('/session/attribute', { key, value }),
  inspect: () =>
    api.get('/session/keys'),
};

// --- Transactions API ---
export const transactionApi = {
  transfer: (from, to, amount) =>
    api.post('/transactions/transfer', { from, to, amount: String(amount) }),
  multiExec: (commands) =>
    api.post('/transactions/multi-exec', { commands }),
  watchDemo: (key) =>
    api.post('/transactions/watch-demo', { key }),
};

// --- Rate Limit API ---
export const rateLimitApi = {
  request: (clientId, window, limit) =>
    api.post(`/ratelimit/request/${encodeURIComponent(clientId)}`, null, { params: { window, limit } }),
  status: (clientId, window, limit) =>
    api.get(`/ratelimit/status/${encodeURIComponent(clientId)}`, { params: { window, limit } }),
  reset: (clientId) =>
    api.post(`/ratelimit/reset/${encodeURIComponent(clientId)}`),
};

// --- Pipeline API ---
export const pipelineApi = {
  benchmark: (count) =>
    api.post('/pipeline/benchmark', { count }),
};

// --- Lock API ---
export const lockApi = {
  acquire: (lockKey, owner, timeoutSeconds) =>
    api.post('/lock/acquire', { lockKey, owner, timeoutSeconds: String(timeoutSeconds) }),
  release: (lockKey, owner) =>
    api.post('/lock/release', { lockKey, owner }),
  status: (lockKey) =>
    api.get(`/lock/status/${encodeURIComponent(lockKey)}`),
};

export default api;
