import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import TechBackground from './TechBackground';

function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TechBackground />
        <TopBar />
        <div className="main-content">
          <Outlet />
        </div>
        <footer className="app-footer">
          <span>&copy; {new Date().getFullYear()} Portal. Tüm hakları saklıdır.</span>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
