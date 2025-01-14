import Button from '@/components/ui/Button';
import { qearnStatsAtom } from '@/store/qearnStat';
import { tickInfoAtom } from '@/store/tickInfo';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Welcome: React.FC = () => {
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [tickInfo] = useAtom(tickInfoAtom);
  const [currentEpoch, setCurrentEpoch] = useState<number>();

  useEffect(() => {
    if (!currentEpoch && tickInfo?.epoch) setCurrentEpoch(tickInfo?.epoch);
  }, [tickInfo]);

  return (
    <div className="flex flex-col justify-between items-center gap-4 md:gap-8 h-full">
      <div className="flex flex-1 flex-col justify-center items-center gap-4">
        <h2 className="text-4xl md:text-7xl font-bold max-w-[748px] text-center">
          Earn <span className="text-primary-50">{(qearnStats[tickInfo?.epoch]?.yieldPercentage / 100000 || 0).toFixed(2)}%</span> Rewards by Staking $QUBIC
        </h2>
        <h5 className="text-xl mt-4 md:text-2xl text-gray-50 max-w-[748px] text-center">Connect your wallet to start locking</h5>
        <Link to="/home" className="w-full max-w-xs md:w-80">
          <Button primary className="w-full" label="Start Locking" />
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
