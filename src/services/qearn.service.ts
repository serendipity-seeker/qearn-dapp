import { LockInfoPerEpoch } from '@/types';
import { fetchQuerySC } from './rpc.service';
import { base64ToUint8Array, uint8ArrayToBase64 } from '@/utils';
import { createQearnPayload, createSCTx } from './tx.service';

// Lock and Unlock transactions
export const lockQubic = async (seed: string, amount: number, tick: number) => {
  return createSCTx(seed, 9, 1, 0, amount, createQearnPayload(amount, tick), tick);
};

export const unLockQubic = async (seed: string, amount: number, epoch: number, tick: number) => {
  return createSCTx(seed, 9, 2, 12, 0, createQearnPayload(amount, epoch), tick);
};

// Query
export const getLockInfoPerEpoch = async (epoch: number): Promise<LockInfoPerEpoch> => {
  const view = new DataView(new Uint8Array(4).buffer);
  view.setUint32(0, epoch, true);

  const res = await fetchQuerySC({
    contractIndex: 9,
    inputType: 1,
    inputSize: 4,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) {
    return {
      lockAmount: 0,
      bonusAmount: 0,
      currentLockedAmount: 0,
      currentBonusAmount: 0,
      yieldPercentage: 0,
    };
  }

  const responseView = new DataView(base64ToUint8Array(res.responseData).buffer);
  const getValue = (offset: number) => Number(responseView.getBigUint64(offset, true));

  return {
    lockAmount: getValue(0),
    bonusAmount: getValue(8),
    currentLockedAmount: getValue(16),
    currentBonusAmount: getValue(24),
    yieldPercentage: getValue(32),
  };
};

export const getUserLockInfo = async (user: Uint8Array, epoch: number): Promise<number> => {
  const view = new DataView(new Uint8Array(36).buffer);
  user.forEach((byte, index) => view.setUint8(index, byte));
  view.setUint32(32, epoch, true);

  const res = await fetchQuerySC({
    contractIndex: 9,
    inputType: 2,
    inputSize: 36,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) return 0;

  return Number(new DataView(base64ToUint8Array(res.responseData).buffer).getBigUint64(0, true));
};

export const getStateOfRound = async (epoch: number): Promise<{ state: number }> => {
  const view = new DataView(new Uint8Array(4).buffer);
  view.setUint32(0, epoch, true);

  const res = await fetchQuerySC({
    contractIndex: 9,
    inputType: 3,
    inputSize: 4,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) return { state: 0 };

  return { state: new DataView(base64ToUint8Array(res.responseData).buffer).getUint32(0, true) };
};

export const getUserLockStatus = async (user: Uint8Array, currentEpoch: number): Promise<number[]> => {
  const view = new DataView(new Uint8Array(32).buffer);
  user.forEach((byte, index) => view.setUint8(index, byte));

  const res = await fetchQuerySC({
    contractIndex: 9,
    inputType: 4,
    inputSize: 32,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) return [];

  const state = Number(new DataView(base64ToUint8Array(res.responseData).buffer).getBigUint64(0, true));

  return state
    .toString(2)
    .split('')
    .reverse()
    .reduce((epochs, bit, index) => (bit === '1' ? [...epochs, currentEpoch - index] : epochs), [] as number[]);
};

export const getEndedStatus = async (user: Uint8Array): Promise<{ fullUnlockedAmount?: number; fullRewardedAmount?: number; earlyUnlockedAmount?: number; earlyRewardedAmount?: number }> => {
  const view = new DataView(new Uint8Array(32).buffer);
  user.forEach((byte, index) => view.setUint8(index, byte));

  const res = await fetchQuerySC({
    contractIndex: 9,
    inputType: 5,
    inputSize: 32,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) return {};

  const responseView = new DataView(base64ToUint8Array(res.responseData).buffer);
  const getValue = (offset: number) => Number(responseView.getBigUint64(offset, true));

  return {
    fullUnlockedAmount: getValue(0),
    fullRewardedAmount: getValue(8),
    earlyUnlockedAmount: getValue(16),
    earlyRewardedAmount: getValue(24),
  };
};