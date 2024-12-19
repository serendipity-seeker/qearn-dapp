import { Outlet } from 'react-router-dom';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import logo from '@/assets/qearn.svg';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-90">
      <Header logo={logo} />
      <div className="flex-1 pt-[80px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
