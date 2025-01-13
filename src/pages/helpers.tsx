import { PublicIdKeyConverter } from '@/components/helpers/PublicIdKeyConverter';
import { Uint8Base64Converter } from '@/components/helpers/Uint8Base64Converter';
import { TransactionCreator } from '@/components/helpers/TransactionCreator';
import { TransactionParser } from '@/components/helpers/TransactionParser';
import { PayloadCreator } from '@/components/helpers/PayloadCreator';
import { RandomSeedGenerator } from '@/components/helpers/RandomSeedGenerator';

const Helpers: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">DevTools</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PublicIdKeyConverter />
        <Uint8Base64Converter />
        <TransactionCreator />
        <TransactionParser />
        <PayloadCreator />
        <RandomSeedGenerator />
      </div>
    </div>
  );
};

export default Helpers;
