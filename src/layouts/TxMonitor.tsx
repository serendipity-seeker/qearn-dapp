import { getUserLockInfo } from '@/services/qearn.service';
import { fetchTxStatus } from '@/services/rpc.service';
import { IPendingTx, pendingTxAtom } from '@/store/pendingTx';
import { tickInfoAtom } from '@/store/tickInfo';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const TxMonitor: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const [pendingTx, setPendingTx] = useAtom(pendingTxAtom);

  useEffect(() => {
    if (Object.keys(pendingTx).length == 0) return;

    const checkTxResult = async () => {
      if (tickInfo?.tick > pendingTx.targetTick) {

        // this is correct way for exact checking SC, but we can just check tx status only

        // if (pendingTx.type == 'qearn') {
        //   const updatedBalance = await getUserLockInfo(pendingTx.publicId, pendingTx.epoch);
        //   if (updatedBalance - pendingTx.initAmount == pendingTx.amount) {
        //     if (pendingTx.amount > 0) {
        //       toast.success('Locked successfully');
        //     } else {
        //       toast.success('Unlocked successfully');
        //     }
        //   } else {
        //     toast.error('Transaction failed');
        //   }
        // } else {
        try {
          const txStatus = await fetchTxStatus(pendingTx.txId);
          if (txStatus.moneyFlew) {
            toast.success('Locked successfully');
          } else {
            toast.error('Unlocked successfully');
          }
        } catch (error) {
          toast.error('Transaction failed');
        }
        // }
        setPendingTx({} as IPendingTx);
      }
    };
    checkTxResult();
  }, [tickInfo, pendingTx]);

  return null;
};

export default TxMonitor;
