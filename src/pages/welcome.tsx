import Button from '@/components/ui/Button';
import { closeTimeAtom } from '@/store/closeTime';
import { qearnStatsAtom } from '@/store/qearnStat';
import { tickInfoAtom } from '@/store/tickInfo';
import { useAtom } from 'jotai';

const Welcome: React.FC = () => {
  const [closeTime] = useAtom(closeTimeAtom);
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [tickInfo] = useAtom(tickInfoAtom);

  console.log('qearnStats', qearnStats);

  return (
    <div className="flex flex-col justify-center items-center gap-4 md:gap-8 h-full px-4">
      <h2 className="text-4xl md:text-7xl font-bold max-w-[748px] text-center">
        Earn <span className="text-primary-50">6.71%</span> Rewards by Staking $QUBIC
      </h2>
      <h5 className="text-xl md:text-2xl text-gray-50 max-w-[748px] text-center">Connect your wallet to start staking</h5>
      <Button className="w-full max-w-xs md:w-80" primary label="Connect Wallet" />

      <div className="text-sm text-gray-50">
        {closeTime.days} days {closeTime.hours} hours {closeTime.minutes} minutes
      </div>
    </div>
  );
};

export default Welcome;
