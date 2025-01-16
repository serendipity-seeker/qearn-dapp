import { getUserLockInfo } from '@/services/qearn.service';
import { fetchBalance, fetchTxStatus } from '@/services/rpc.service';
import { balancesAtom } from '@/store/balances';
import { IPendingTx, pendingTxAtom } from '@/store/pendingTx';
import { tickInfoAtom } from '@/store/tickInfo';
import { userLockInfoAtom } from '@/store/userLockInfo';
import { TxStatus } from '@/types';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const TxMonitor: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const [pendingTx, setPendingTx] = useAtom(pendingTxAtom);
  const [, setBalance] = useAtom(balancesAtom);
  const [userLockInfo, setUserLockInfo] = useAtom(userLockInfoAtom);

  const checkTxResult = async () => {
    if (tickInfo?.tick > pendingTx.targetTick) {
      if (tickInfo?.tick > pendingTx.targetTick + 15) {
        toast.error('Transaction failed');
        setPendingTx({} as IPendingTx);
        return;
      }
      const lockedAmount = await getUserLockInfo(pendingTx.publicId, pendingTx.epoch);
      console.log(lockedAmount, pendingTx.initAmount, pendingTx.amount);
      if (lockedAmount - pendingTx.initAmount == pendingTx.amount) {
        if (pendingTx.amount > 0) {
          toast.success('Locked successfully');
        } else {
          toast.success('Unlocked successfully');
        }
      } else {
        return;
      }
      const updatedLockAmount = await getUserLockInfo(pendingTx.publicId, pendingTx.epoch);
      setUserLockInfo((prev) => ({
        ...prev,
        [pendingTx.publicId]: {
          ...prev[pendingTx.publicId],
          [pendingTx.epoch]: updatedLockAmount,
        },
      }));
      const updatedBalance = await fetchBalance(pendingTx.publicId);
      setBalance([updatedBalance]);
      setPendingTx({} as IPendingTx);
    }
  };

  // const checkTxResult = async () => {
  //   if (tickInfo?.tick > pendingTx.targetTick) {
  //     const txStatus = await fetchTxStatus(pendingTx.txId);
  //     if (tickInfo?.tick > pendingTx.targetTick + 15) {
  //       toast.error('Transaction failed');
  //       setPendingTx({} as IPendingTx);
  //       return;
  //     }
  //     if (txStatus?.txId == undefined || txStatus?.txId.length == 0) return;
  //     if (pendingTx.amount > 0) {
  //       toast.success('Locked successfully');
  //     } else {
  //       toast.success('Unlocked successfully');
  //     }
  //     const updatedBalance = await fetchBalance(pendingTx.publicId);
  //     setBalance([updatedBalance]);
  //     setPendingTx({} as IPendingTx);
  //   }
  // };

  useEffect(() => {
    if (Object.keys(pendingTx).length == 0) return;
    checkTxResult();
  }, [tickInfo, pendingTx]);

  return null;
};

export default TxMonitor;
