import { copyText, formatQubicAmount, truncateMiddle } from '@/utils';
import { useQubicConnect } from './connect/QubicConnectContext';
import { useFetchBalance } from '@/hooks/useFetchBalance';

const WalletInfoLabel: React.FC = () => {
  const { connected, wallet } = useQubicConnect();
  const { data: balance } = useFetchBalance(wallet?.publicKey ?? '');

  if (!connected || !wallet) return null;

  return (
    <div className="p-2 rounded-lg cursor-pointer" onClick={() => copyText(wallet.publicKey)}>
      <p className="text-sm">{truncateMiddle(wallet.publicKey, 45)}</p>
      <p className="w-full text-right">{formatQubicAmount(balance?.balance ?? 0)} QU</p>
    </div>
  );
};

export default WalletInfoLabel;
