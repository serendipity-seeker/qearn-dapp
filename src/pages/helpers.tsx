import { PublicIdKeyConverter } from '@/components/helpers/PublicIdKeyConverter';
import { Uint8Base64Converter } from '@/components/helpers/Uint8Base64Converter';
import { TransactionCreator } from '@/components/helpers/TransactionCreator';
import { TransactionParser } from '@/components/helpers/TransactionParser';
import { PayloadCreator } from '@/components/helpers/PayloadCreator';
import { RandomSeedGenerator } from '@/components/helpers/RandomSeedGenerator';
import { motion } from 'framer-motion';

const Helpers: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-4xl font-bold text-center mb-8">
        DevTools
      </motion.h1>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PublicIdKeyConverter />
        <Uint8Base64Converter />
        <TransactionCreator />
        <TransactionParser />
        <PayloadCreator />
        <RandomSeedGenerator />
      </motion.div>
    </motion.div>
  );
};

export default Helpers;
