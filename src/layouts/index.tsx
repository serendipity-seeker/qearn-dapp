import { Outlet } from 'react-router-dom';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import logo from '@/assets/qearn.svg';
import Fetcher from '@/components/fetchers/Fetcher';
import TxMonitor from '@/components/fetchers/TxMonitor';
import InfoBanner from '@/components/InfoBanner';

const Layout: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-90">
      <Header logo={logo} />
      <div className="flex flex-1 pt-[80px]">
        <div className="p-4 flex-1">
          <Outlet />
        </div>
        <Fetcher />
        <TxMonitor />
      </div>
      <InfoBanner />
      <Footer />
    </div>
  );
};

export default Layout;
