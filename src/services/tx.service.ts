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

export const qearnSCTx = async (seed: string, contractIndex: number, inputType: number, inputSize: number, amount: number, payload: any, tick: number) => {
  try {
    const idPackage = await qHelper.createIdPackage(seed);

    const destinationPublicKey = new Uint8Array(QubicDefinitions.PUBLIC_KEY_LENGTH);
    destinationPublicKey.fill(0);
    destinationPublicKey[0] = contractIndex;

    const dynamicPayload = new DynamicPayload(inputSize);
    const { buffer } = createPayload([
      { data: payload.UnlockAmount, type: 'bigint64' },
      { data: payload.LockedEpoch, type: 'uint32' },
    ]);
    dynamicPayload.setPayload(new Uint8Array(buffer));

    const tx = new QubicTransaction()
      .setSourcePublicKey(idPackage.publicId)
      .setDestinationPublicKey(await qHelper.getIdentity(destinationPublicKey))
      .setAmount(amount)
      .setTick(tick + 5)
      .setInputType(inputType)
      .setInputSize(inputSize);
    if (dynamicPayload.getPackageSize() > 0) {
      tx.setPayload(dynamicPayload);
    }
    const res = await tx.build(seed);
    const txResult = await broadcastTx(res);
    return {
      txResult,
    };
  } catch (error) {
    console.error('Error signing transaction:', error);
    throw new Error('Failed to sign and broadcast transaction.');
  }
};
