import Button from '@/components/ui/Button';

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 md:gap-8 h-full px-4">
      <h2 className="text-4xl md:text-7xl font-bold max-w-[748px] text-center">
        Earn <span className="text-primary-50">6.71%</span> Rewards by Staking $QUBIC
      </h2>
      <h5 className="text-xl md:text-2xl text-gray-50 max-w-[748px] text-center">Connect your wallet to start staking</h5>
      <Button className="w-full max-w-xs md:w-80" primary label="Connect Wallet" />
    </div>
  );
};

export default Welcome;
