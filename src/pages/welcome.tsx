import Button from '@/components/ui/Button';
import { qearnStatsAtom } from '@/store/qearnStat';
import { tickInfoAtom } from '@/store/tickInfo';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome: React.FC = () => {
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [tickInfo] = useAtom(tickInfoAtom);
  const [currentEpoch, setCurrentEpoch] = useState<number>();

  useEffect(() => {
    if (!currentEpoch && tickInfo?.epoch) setCurrentEpoch(tickInfo?.epoch);
  }, [tickInfo]);

  return (
    <motion.div className="flex flex-col justify-between items-center gap-4 md:gap-8 h-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <motion.div className="flex flex-1 flex-col justify-center items-center gap-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <motion.h2 className="text-4xl md:text-6xl font-bold max-w-[800px] text-center uppercase" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          Earn <span className="text-primary-40">{(qearnStats[tickInfo?.epoch]?.yieldPercentage / 100000 || 0).toFixed(2)}%</span> Rewards by Staking $QUBIC
        </motion.h2>
        <motion.h5
          className="text-xl mt-4 md:text-2xl text-gray-50 max-w-[748px] text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Connect your wallet to start locking
        </motion.h5>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }} className="w-full flex justify-center">
          <Link to="/home">
            <Button variant="primary" className="min-w-[240px]" label="Start Locking" />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Welcome;
