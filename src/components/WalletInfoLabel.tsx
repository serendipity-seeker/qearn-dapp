import { copyText, formatQubicAmount, truncateMiddle } from '@/utils';
import { useQubicConnect } from './connect/QubicConnectContext';
import { useEffect, useState } from 'react';
import { useFetchBalance } from '@/hooks/useFetchBalance';

const WalletInfoLabel: React.FC = () => {
  const { connected, wallet } = useQubicConnect();
  const [balance, setBalance] = useState<number>(0);
  const { data: balanceData, refetch } = useFetchBalance(wallet?.publicKey ?? '');

  useEffect(() => {
    if (balanceData) {
      setBalance(balanceData.balance);
    }
  }, [balanceData]);

  useEffect(() => {
    if (wallet?.publicKey) {
      refetch();
    }
  }, [wallet?.publicKey, refetch]);

  if (!connected || !wallet) return null;

  return (
    <div className="p-2 rounded-lg cursor-pointer" onClick={() => copyText(wallet.publicKey)}>
      <p className="text-sm">{truncateMiddle(wallet.publicKey, 45)}</p>
      <p className="w-full text-right">{formatQubicAmount(balance)} QU</p>
    </div>
  );
};

export default WalletInfoLabel;
