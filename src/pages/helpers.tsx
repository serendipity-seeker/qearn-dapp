import { PublicIdKeyConverter } from "@/components/helpers/PublicIdKeyConverter";
import { Uint8Base64Converter } from "@/components/helpers/Uint8Base64Converter";
import { TransactionCreator } from "@/components/helpers/TransactionCreator";
import { TransactionParser } from "@/components/helpers/TransactionParser";
import { PayloadCreator } from "@/components/helpers/PayloadCreator";
import { RandomSeedGenerator } from "@/components/helpers/RandomSeedGenerator";
import { motion } from "framer-motion";
import { Uint8ArrayParser } from "@/components/helpers/Uint8ArrayParser";

const Helpers: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-4xl px-4 py-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 text-center text-4xl font-bold"
      >
        DevTools
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <PublicIdKeyConverter />
        <Uint8Base64Converter />
        <TransactionCreator />
        <TransactionParser />
        <PayloadCreator />
        <Uint8ArrayParser />
        <RandomSeedGenerator />
      </motion.div>
    </motion.div>
  );
};

export default Helpers;
