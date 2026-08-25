import { useState, useEffect } from 'react';
import { TbServer } from 'react-icons/tb';

function TopBar() {
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/cache/stats');
        setConnected(response.ok);
      } catch {
        setConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="top-bar">
      <div className="top-bar-title">
        <TbServer style={{ marginRight: 8, opacity: 0.6 }} />
        Redis - Interactive Demo
      </div>
      <div className="connection-status">
        <span className={`connection-dot${connected ? '' : ' disconnected'}`} />
        {connected ? 'Connected to Redis' : 'Disconnected'}
      </div>
    </div>
  );
}

export default TopBar;
