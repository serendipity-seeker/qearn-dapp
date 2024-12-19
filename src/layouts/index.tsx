import { Outlet } from 'react-router-dom';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import logo from '@/assets/qubic.svg';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header logo={logo} />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
