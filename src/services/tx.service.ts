import { DEFAULT_TX_SIZE } from '@/constants';
import { createPayload } from '@/utils';
import { DynamicPayload } from '@qubic-lib/qubic-ts-library/dist/qubic-types/DynamicPayload';
import { QubicTransaction } from '@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction';
import { QubicDefinitions } from '@qubic-lib/qubic-ts-library/dist/QubicDefinitions';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';

const qHelper = new QubicHelper();

export const createTx = (sender: string, receiver: string, amount: number, tick: number) => {
  const tx = new QubicTransaction().setSourcePublicKey(sender).setDestinationPublicKey(receiver).setAmount(amount).setTick(tick);
  return {
    tx: tx.getPackageData(),
    offset: DEFAULT_TX_SIZE,
  };
};

export const createQearnPayload = (UnlockAmount: number, LockedEpoch: number) => {
  const dynamicPayload = new DynamicPayload(12);
  const buffer = createPayload([
    { data: UnlockAmount, type: 'bigint64' },
    { data: LockedEpoch, type: 'uint32' },
  ]);
  dynamicPayload.setPayload(new Uint8Array(buffer));
  return dynamicPayload;
};

export const createSCTx = async (sourceID: string, contractIndex: number, inputType: number, inputSize: number, amount: number, payload?: DynamicPayload, tick: number) => {
  try {
    const destinationPublicKey = new Uint8Array(QubicDefinitions.PUBLIC_KEY_LENGTH);
    destinationPublicKey.fill(0);
    destinationPublicKey[0] = contractIndex;

    const tx = new QubicTransaction()
      .setSourcePublicKey(sourceID)
      .setDestinationPublicKey(await qHelper.getIdentity(destinationPublicKey))
      .setAmount(amount)
      .setTick(tick + 5)
      .setInputType(inputType)
      .setInputSize(inputSize);
    if (payload) {
      tx.setPayload(payload);
    }
    return tx;
  } catch (error) {
    console.error('Error signing transaction:', error);
  }
};