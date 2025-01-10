import { Outlet } from 'react-router-dom';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import logo from '@/assets/qearn.svg';
import Fetcher from './Fetcher';
import { FaCoins } from 'react-icons/fa6';
import TxMonitor from './TxMonitor';

const Layout: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-90">
      <Header logo={logo} />
      <div className="absolute bottom-10 right-10">
        <FaCoins className="text-[240px] text-white opacity-20" />
      </div>
      <div className="flex flex-1 pt-[80px]">
        <div className="p-4 flex-1">
          <Outlet />
        </div>
        <Fetcher />
        <TxMonitor />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
