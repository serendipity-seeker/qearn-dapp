import { Outlet } from 'react-router-dom';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import logo from '@/assets/qearn.svg';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useFetchTickInfo } from '@/hooks/useFetchTickInfo';
import { tickInfoAtom } from '@/store/tickInfo';
import { useAtom } from 'jotai';

const Layout: React.FC = () => {
  const { refetch } = useFetchTickInfo();
  const intervalRef = useRef<NodeJS.Timeout>();
  const [, setTickInfo] = useAtom(tickInfoAtom);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      const { data } = await refetch();
      if (data) {
        setTickInfo(data);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetch]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-90">
      <Header logo={logo} />
      <div className="flex-1 pt-[80px]">
        <div className="p-4">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
