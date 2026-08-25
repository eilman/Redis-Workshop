import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './components/pages/HomePage';
import StringPage from './components/pages/StringPage';
import ListPage from './components/pages/ListPage';
import SetPage from './components/pages/SetPage';
import HashPage from './components/pages/HashPage';
import SortedSetPage from './components/pages/SortedSetPage';
import TtlPage from './components/pages/TtlPage';
import CachePage from './components/pages/CachePage';
import KeyDesignPage from './components/pages/KeyDesignPage';
import PubSubPage from './components/pages/PubSubPage';
import SessionPage from './components/pages/SessionPage';
import TransactionPage from './components/pages/TransactionPage';
import RateLimitPage from './components/pages/RateLimitPage';
import DocsPage from './components/pages/DocsPage';
import CommunityPage from './components/pages/CommunityPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="strings" element={<StringPage />} />
        <Route path="lists" element={<ListPage />} />
        <Route path="sets" element={<SetPage />} />
        <Route path="hashes" element={<HashPage />} />
        <Route path="sorted-sets" element={<SortedSetPage />} />
        <Route path="ttl" element={<TtlPage />} />
        <Route path="cache" element={<CachePage />} />
        <Route path="key-design" element={<KeyDesignPage />} />
        <Route path="pubsub" element={<PubSubPage />} />
        <Route path="sessions" element={<SessionPage />} />
        <Route path="transactions" element={<TransactionPage />} />
        <Route path="rate-limiting" element={<RateLimitPage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="community" element={<CommunityPage />} />
      </Route>
    </Routes>
  );
}

export default App;
