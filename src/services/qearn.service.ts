import { ILockInfo } from '@/types';
import { fetchQuerySC } from './rpc.service';
import { base64ToUint8Array, uint8ArrayToBase64 } from '@/utils';
import { createQearnPayload, createSCTx } from './tx.service';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';

const qHelper = new QubicHelper();

// Lock and Unlock transactions
export const lockQubic = async (sourceID: string, amount: number, tick: number) => {
  return await createSCTx(sourceID, 9, 1, 0, amount, tick);
};

export const unLockQubic = async (sourceID: string, amount: number, epoch: number, tick: number) => {
  return await createSCTx(sourceID, 9, 2, 12, 0, tick, createQearnPayload(amount, epoch));
};

// Query
export const getLockInfoPerEpoch = async (epoch: number): Promise<ILockInfo> => {
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

export const getUserLockInfo = async (user: Uint8Array | string, epoch: number): Promise<number> => {
  if (typeof user === 'string') {
    user = qHelper.getIdentityBytes(user);
  }

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

export const getUserLockStatus = async (user: Uint8Array | string, currentEpoch: number): Promise<number[]> => {
  if (typeof user === 'string') {
    user = qHelper.getIdentityBytes(user);
  }

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

export const getEndedStatus = async (user: Uint8Array | string): Promise<{ fullUnlockedAmount?: number; fullRewardedAmount?: number; earlyUnlockedAmount?: number; earlyRewardedAmount?: number }> => {
  if (typeof user === 'string') {
    user = qHelper.getIdentityBytes(user);
  }

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

export const getBurnedAndBoostedStats = async (): Promise<{
  burnedAmount: number;
  averageBurnedPercent: number;
  boostedAmount: number;
  averageBoostedPercent: number;
  rewardedAmount: number;
  averageRewardedPercent: number;
}> => {
  const res = await fetchQuerySC({
    contractIndex: 9,
    inputType: 7,
    inputSize: 0,
    requestData: '',
  });

  if (!res.responseData) return { burnedAmount: 0, averageBurnedPercent: 0, boostedAmount: 0, averageBoostedPercent: 0, rewardedAmount: 0, averageRewardedPercent: 0 };

  const responseView = new DataView(base64ToUint8Array(res.responseData).buffer);
  const getValue = (offset: number) => Number(responseView.getBigUint64(offset, true));

  return {
    burnedAmount: getValue(0),
    averageBurnedPercent: getValue(8),
    boostedAmount: getValue(16),
    averageBoostedPercent: getValue(24),
    rewardedAmount: getValue(32),
    averageRewardedPercent: getValue(40),
  };
};

export const getBurnedAndBoostedStatsPerEpoch = async (
  epoch: number
): Promise<{ burnedAmount: number; burnedPercent: number; boostedAmount: number; boostedPercent: number; rewardedAmount: number; rewardedPercent: number }> => {
  const view = new DataView(new Uint8Array(4).buffer);
  view.setUint32(0, epoch, true);

  const res = await fetchQuerySC({
    contractIndex: 9,
    inputType: 8,
    inputSize: 4,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) return { burnedAmount: 0, burnedPercent: 0, boostedAmount: 0, boostedPercent: 0, rewardedAmount: 0, rewardedPercent: 0 };

  const responseView = new DataView(base64ToUint8Array(res.responseData).buffer);
  const getValue = (offset: number) => Number(responseView.getBigUint64(offset, true));

  return { burnedAmount: getValue(0), burnedPercent: getValue(8), boostedAmount: getValue(16), boostedPercent: getValue(24), rewardedAmount: getValue(32), rewardedPercent: getValue(40) };
};
