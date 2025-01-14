import { formatQubicAmount } from "@/utils";
import { FaLock as FaLockSolid, FaClock as FaClockSolid, FaPercent as FaPercentSolid } from 'react-icons/fa6';
import { closeTimeAtom } from '@/store/closeTime';
import { useAtom } from 'jotai';
import { qearnStatsAtom } from "@/store/qearnStat";
import { tickInfoAtom } from "@/store/tickInfo";

const InfoBanner: React.FC = () => {
  const [closeTime] = useAtom(closeTimeAtom);
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [tickInfo] = useAtom(tickInfoAtom);

  return (
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
  );
};

export default InfoBanner;
