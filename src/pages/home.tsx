import LockStatCard from '@/components/LockStatCard';
import QearnForm from '@/components/QearnForm';
import TickInfoCard from '@/components/TickInfoCard';
import { tickInfoAtom } from '@/store/tickInfo';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <TickInfoCard />
      <QearnForm />
    </div>
  );
};

export default Home;
