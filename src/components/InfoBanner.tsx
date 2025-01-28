import { formatQubicAmount } from '@/utils';
import { FaLock as FaLockSolid, FaClock as FaClockSolid, FaPercent as FaPercentSolid } from 'react-icons/fa6';
import { closeTimeAtom } from '@/store/closeTime';
import { useAtom } from 'jotai';
import { qearnStatsAtom } from '@/store/qearnStat';
import { tickInfoAtom } from '@/store/tickInfo';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const InfoBanner: React.FC = () => {
  const [closeTime] = useAtom(closeTimeAtom);
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [tickInfo] = useAtom(tickInfoAtom);
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full p-6 flex md:flex-row flex-col justify-center items-center gap-6 border-t-2 border-b-2 border-gray-50 border-opacity-20"
      >
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <span>
            <FaLockSolid className="inline mr-1" /> TVL:
          </span>
          <span>{formatQubicAmount(qearnStats?.totalLockAmount || 0)}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center px-4 md:border-l-2 md:border-r-2 md:border-gray-50 border-opacity-20"
        >
          <FaClockSolid className="inline mr-1" />
          Weekly Locking Closes in {closeTime.days} d {closeTime.hours} h {closeTime.minutes} min
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: 0.6, duration: 0.5 }}>
          <span>
            <FaPercentSolid className="inline mr-1" /> Current APY:
          </span>
          <span>{(qearnStats[tickInfo?.epoch]?.yieldPercentage / 100000 || 0).toFixed(2)}%</span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InfoBanner;
