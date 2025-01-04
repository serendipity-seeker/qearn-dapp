import LockStatCard from '@/components/LockStatCard';
import QearnForm from '@/components/QearnForm';
import TickInfoCard from '@/components/TickInfoCard';
import { tickInfoAtom } from '@/store/tickInfo';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

const Home: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const currentEpoch = useMemo(() => tickInfo?.epoch || 142, [tickInfo?.epoch]);

  return (
    <div className="flex flex-col gap-4">
      <TickInfoCard />
      <LockStatCard currentEpoch={currentEpoch} />
      <QearnForm />
    </div>
  );
};

export default Home;
