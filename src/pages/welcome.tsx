import Button from '@/components/ui/Button';
import { closeTimeAtom } from '@/store/closeTime';
import { qearnStatsAtom } from '@/store/qearnStat';
import { tickInfoAtom } from '@/store/tickInfo';
import { formatQubicAmount } from '@/utils';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { FaLock as FaLockSolid, FaClock as FaClockSolid, FaPercent as FaPercentSolid } from 'react-icons/fa6';

const Welcome: React.FC = () => {
  const [closeTime] = useAtom(closeTimeAtom);
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
        <h5 className="text-xl mt-4 md:text-2xl text-gray-50 max-w-[748px] text-center">Connect your wallet to start staking</h5>
        <Button className="w-full max-w-xs md:w-80" primary label="Connect Wallet" />
      </div>
      <div className="w-full p-6 flex md:flex-row flex-col justify-center items-center gap-6 border-t-2 border-b-2 border-gray-50">
        <div>
          <span>
            <FaLockSolid className="inline mr-1" /> TVL:
          </span>
          <span>{formatQubicAmount(qearnStats?.totalLockAmount || 0)}</span>
        </div>
        <div className="text-center px-4 md:border-l-2 md:border-r-2 md:border-gray-50">
          <FaClockSolid className="inline mr-1" />
          Weekly Locking Closes in {closeTime.days} d {closeTime.hours} h {closeTime.minutes} min
        </div>
        <div>
          <span>
            <FaPercentSolid className="inline mr-1" /> Current APY:
          </span>
          <span>{(qearnStats[tickInfo?.epoch]?.yieldPercentage / 100000 || 0).toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
