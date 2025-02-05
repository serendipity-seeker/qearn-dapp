import { motion } from "framer-motion";
import TVL from "./charts/TVL";
import BonusAmountAnalyzer from "./charts/BonusAmountAnalyzer";
import Richlist from "./charts/Richlist";
import TotalQearnStats from "./charts/TotalQearnStats";

const Dashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <TVL />
        <BonusAmountAnalyzer />
        <Richlist />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full"
      >
        <TotalQearnStats />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
