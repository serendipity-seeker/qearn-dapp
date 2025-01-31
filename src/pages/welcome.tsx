import Button from "@/components/ui/Button";
import { qearnStatsAtom } from "@/store/qearnStat";
import { tickInfoAtom } from "@/store/tickInfo";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Welcome: React.FC = () => {
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [tickInfo] = useAtom(tickInfoAtom);
  const [currentEpoch, setCurrentEpoch] = useState<number>();

  useEffect(() => {
    if (!currentEpoch && tickInfo?.epoch) setCurrentEpoch(tickInfo?.epoch);
  }, [tickInfo]);

  return (
    <motion.div
      className="flex h-full flex-col items-center justify-between gap-4 md:gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-1 flex-col items-center justify-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h2
          className="max-w-[800px] text-center text-4xl font-bold uppercase md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Earn{" "}
          <span className="text-primary-40">
            {(qearnStats[tickInfo?.epoch]?.yieldPercentage / 100000 || 0).toFixed(2)}%
          </span>{" "}
          Rewards by Staking $QUBIC
        </motion.h2>
        <motion.h5
          className="mt-4 max-w-[748px] text-center text-xl text-gray-50 md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Connect your wallet to start locking
        </motion.h5>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex w-full justify-center"
        >
          <Link to="/home">
            <Button variant="primary" className="min-w-[240px]" label="Start Locking" />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Welcome;
