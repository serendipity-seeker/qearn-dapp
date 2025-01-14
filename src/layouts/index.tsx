import { Outlet } from 'react-router-dom';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import logo from '@/assets/qearn.svg';
import Fetcher from './Fetcher';
import TxMonitor from './TxMonitor';
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
