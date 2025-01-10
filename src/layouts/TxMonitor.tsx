import { getUserLockInfo } from '@/services/qearn.service';
import { fetchBalance } from '@/services/rpc.service';
import { balancesAtom } from '@/store/balances';
import { IPendingTx, pendingTxAtom } from '@/store/pendingTx';
import { tickInfoAtom } from '@/store/tickInfo';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const TxMonitor: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const [pendingTx, setPendingTx] = useAtom(pendingTxAtom);
  const [, setBalance] = useAtom(balancesAtom);

  useEffect(() => {
    if (Object.keys(pendingTx).length == 0) return;

    const checkTxResult = async () => {
      if (tickInfo?.tick > pendingTx.targetTick) {
        const lockedAmount = await getUserLockInfo(pendingTx.publicId, pendingTx.epoch);
        if (lockedAmount - pendingTx.initAmount == pendingTx.amount) {
          if (pendingTx.amount > 0) {
            toast.success('Locked successfully');
          } else {
            toast.success('Unlocked successfully');
          }
        } else {
          toast.error('Transaction failed');
        }
        const updatedBalance = await fetchBalance(pendingTx.publicId);
        setBalance([updatedBalance]);
        setPendingTx({} as IPendingTx);
      }
    };
    checkTxResult();
  }, [tickInfo, pendingTx]);

  return null;
};

export default TxMonitor;
