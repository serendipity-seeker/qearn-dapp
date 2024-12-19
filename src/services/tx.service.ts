import { DEFAULT_TX_SIZE } from '@/constants';
import { QubicTransaction } from '@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction';

export const createTx = (sender: string, receiver: string, amount: number, tick: number) => {
  const tx = new QubicTransaction().setSourcePublicKey(sender).setDestinationPublicKey(receiver).setAmount(amount).setTick(tick);
  return {
    tx: tx.getPackageData(),
    offset: DEFAULT_TX_SIZE,
  };
};
