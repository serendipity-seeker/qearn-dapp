import { PublicKey } from '@qubic-lib/qubic-ts-library/dist/qubic-types/PublicKey';
import { LockInfoPerEpoch } from '@/types';
import { broadcastTx, fetchQuerySC } from './rpc.service';
import { base64ToUint8Array, createDataView, createPayload, uint8ArrayToBase64 } from '@/utils';
import { QubicDefinitions } from '@qubic-lib/qubic-ts-library/dist/QubicDefinitions';
import { DynamicPayload } from '@qubic-lib/qubic-ts-library/dist/qubic-types/DynamicPayload';
import { QubicTransaction } from '@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';
import { qearnSCTx } from './tx.service';

export const lockQubic = async (seed: string, amount: number, tick: number) => {
  return qearnSCTx(seed, 9, 1, 0, amount, {}, tick);
};

export const unLockQubic = async (seed: string, amount: number, epoch: number, tick: number) => {
  return qearnSCTx(seed, 9, 2, 12, 0, { UnlockAmount: amount, LockedEpoch: epoch }, tick);
};

export const getLockInfoPerEpoch = async (epoch: number): Promise<LockInfoPerEpoch> => {
  const { buffer, view } = createDataView(4);
  view.setUint32(0, epoch, true);
  const base64String = uint8ArrayToBase64(new Uint8Array(buffer));

  const res = await fetchQuerySC({
    contractIndex: 9,
    inputType: 1,
    inputSize: 4,
    requestData: base64String,
  });
  if (!res.responseData) {
    return { lockAmount: 0, bonusAmount: 0, currentLockedAmount: 0, currentBonusAmount: 0, yieldPercentage: 0 };
  }

  const responseBuffer = base64ToUint8Array(res.responseData);
  const dataView = new DataView(responseBuffer);
  return {
    lockAmount: Number(dataView.getBigUint64(0, true)),
    bonusAmount: Number(dataView.getBigUint64(8, true)),
    currentLockedAmount: Number(dataView.getBigUint64(16, true)),
    currentBonusAmount: Number(dataView.getBigUint64(24, true)),
    yieldPercentage: Number(dataView.getBigUint64(32, true)),
  };
};

export const getUserLockInfo = async (user: Uint8Array, epoch: number): Promise<number> => {
  const { buffer, view } = createDataView(36);
  user.forEach((byte, index) => view.setUint8(index, byte));
  view.setUint32(32, epoch, true);

  const base64String = uint8ArrayToBase64(new Uint8Array(buffer));
  const res = await fetchQuerySC({
    contractIndex: 9,
    inputType: 2,
    inputSize: 36,
    requestData: base64String,
  });

  if (!res.responseData) return 0;

  const responseBuffer = base64ToUint8Array(res.responseData);
  return Number(new DataView(responseBuffer.buffer).getBigUint64(0, true));
};

export const getStateOfRound = async (epoch: number): Promise<{ state: number }> => {
  const { buffer, view } = createDataView(4);
  view.setUint32(0, epoch, true);

  const base64String = uint8ArrayToBase64(new Uint8Array(buffer));
  const res = await fetchQuerySC({
    contractIndex: 9,
    inputType: 3,
    inputSize: 4,
    requestData: base64String,
  });

  if (!res.responseData) return { state: 0 };

  const responseBuffer = base64ToUint8Array(res.responseData);
  return { state: new DataView(responseBuffer.buffer).getUint32(0, true) };
};

export const getUserLockStatus = async (user: Uint8Array, currentEpoch: number): Promise<number[]> => {
  const { buffer, view } = createDataView(32);
  user.forEach((byte, index) => view.setUint8(index, byte));

  const base64String = uint8ArrayToBase64(new Uint8Array(buffer));
  const res = await fetchQuerySC({
    contractIndex: 9,
    inputType: 4,
    inputSize: 32,
    requestData: base64String,
  });

  if (!res.responseData) return [];

  const responseBuffer = base64ToUint8Array(res.responseData);
  const state = Number(new DataView(responseBuffer.buffer).getBigUint64(0, true));

  return state
    .toString(2)
    .split('')
    .reverse()
    .reduce((epochs, bit, index) => (bit === '1' ? [...epochs, currentEpoch - index] : epochs), [] as number[]);
};

export const getEndedStatus = async (user: Uint8Array): Promise<{ fullUnlockedAmount?: number; fullRewardedAmount?: number; earlyUnlockedAmount?: number; earlyRewardedAmount?: number }> => {
  const { buffer, view } = createDataView(32);
  user.forEach((byte, index) => view.setUint8(index, byte));

  const base64String = uint8ArrayToBase64(new Uint8Array(buffer));
  const res = await fetchQuerySC({
    contractIndex: 9,
    inputType: 5,
    inputSize: 32,
    requestData: base64String,
  });

  if (!res.responseData) return {};
  const responseBuffer = base64ToArrayBuffer(res.responseData);
  const responseView = new DataView(responseBuffer);

  return {
    fullUnlockedAmount: Number(responseView.getBigUint64(0, true)),
    fullRewardedAmount: Number(responseView.getBigUint64(8, true)),
    earlyUnlockedAmount: Number(responseView.getBigUint64(16, true)),
    earlyRewardedAmount: Number(responseView.getBigUint64(24, true)),
  };
};

export const fetchLockInfo = async (epoch: number) => {
  epochInfo[epoch] = await getLockInfoPerEpoch(epoch);
  epochInfo = { ...epochInfo };
  epochInfoSubject.next(epochInfo);
  console.log(epochInfo[epoch]);
};

export const fetchAllLockInfoFromCurrentEpoch = async (epoch: number) => {
  isLoading = true;
  for (let i = 0; i < 52; i++) {
    if (!epochInfo[epoch - i]) await fetchLockInfo(epoch - i);
  }
  isLoading = false;
};

export const calculateRewards = (lockAmount: number, totalLockedAmount: number, currentBonusAmount: number, yieldPercentage: number, currentEpoch: number, lockedEpoch: number) => {
  const fullUnlockPercent = yieldPercentage / 100000;
  const fullUnlockReward = currentBonusAmount * (lockAmount / totalLockedAmount);

  const earlyUnlockPercent = REWARD_DATA.find((data) => data.weekFrom < currentEpoch - lockedEpoch && data.weekTo + 1 >= currentEpoch - lockedEpoch)?.earlyUnlock || 0;
  const earlyUnlockReward = fullUnlockReward * (earlyUnlockPercent / 100);

  return {
    earlyUnlockReward,
    earlyUnlockRewardRatio: (fullUnlockPercent * earlyUnlockPercent) / 100,
    fullUnlockReward,
    fullUnlockRewardRatio: fullUnlockPercent,
  };
};

export const fetchStakeDataPerEpoch = async (publicId: string, epoch: number, currentEpoch: number, update: boolean = false) => {
  if (!epochInfo[epoch] || update) {
    await fetchLockInfo(epoch);
  }

  const pubKey = new PublicKey(publicId).getPackageData();
  const lockAmount = await getUserLockInfo(pubKey, epoch);

  if (!lockAmount) {
    stakeData[publicId] = (stakeData[publicId] || []).filter((data) => data.lockedEpoch !== epoch);
    return;
  }

  if (!stakeData[publicId]) {
    stakeData[publicId] = [];
  }

  const { currentLockedAmount, currentBonusAmount, yieldPercentage } = epochInfo[epoch];
  const rewards = calculateRewards(lockAmount, currentLockedAmount, currentBonusAmount, yieldPercentage, currentEpoch, epoch);

  const stakeData = {
    publicId,
    lockedEpoch: epoch,
    lockedAmount: lockAmount,
    lockedWeeks: Math.max(0, currentEpoch - epoch - 1),
    totalLockedAmountInEpoch: currentLockedAmount,
    currentBonusAmountInEpoch: currentBonusAmount,
    ...rewards,
  };

  const existingDataIndex = stakeData[publicId].findIndex((data) => data.lockedEpoch === epoch);
  if (existingDataIndex !== -1) {
    stakeData[publicId][existingDataIndex] = stakeData;
  } else {
    stakeData[publicId].push(stakeData);
  }
};

export const fetchStakeDataOfPublicId = async (publicId: string, currentEpoch: number) => {
  isLoading = true;
  for (let i = 0; i < 52; i++) {
    if (!this.stakeData[publicId]?.find((data) => data.lockedEpoch === currentEpoch - i)) {
      await this.fetchStakeDataPerEpoch(publicId, currentEpoch - i, currentEpoch);
    }
  }
  this.isLoading = false;
};

export const fetchEndedStakeData = async (publicId: string) => {
  const endedStatus = await this.getEndedStatus(new PublicKey(publicId).getPackageData());
  if (!endedStatus) return;

  if (!this.endedStakeData[publicId]) {
    this.endedStakeData[publicId] = [];
  }

  const updateOrAddStatus = (status: boolean, unLockedAmount: number, rewardedAmount: number) => {
    const index = this.endedStakeData[publicId].findIndex((data) => data.status === status);
    const newData = { unLockedAmount, rewardedAmount, status };

    if (index !== -1) {
      this.endedStakeData[publicId][index] = newData;
    } else {
      this.endedStakeData[publicId].push(newData);
    }
  };

  updateOrAddStatus(true, endedStatus.fullUnlockedAmount ?? 0, endedStatus.fullRewardedAmount ?? 0);
  updateOrAddStatus(false, endedStatus.earlyUnlockedAmount ?? 0, endedStatus.earlyRewardedAmount ?? 0);
};

export const setPendingStake = (pendingStake: PendingStake | null) => {
  this.pendingStake = pendingStake;
};

export const setLoading = (isLoading: boolean) => {
  this.isLoading = isLoading;
};

export const monitorTransaction = (publicId: string, initialLockedAmount: number, epoch: number, currentEpoch: number, type: 'stake' | 'unlock'): Promise<void> => {
  this.us.currentTick
    .pipe(
      filter((tick) => this.pendingStake !== null && tick > this.pendingStake.targetTick),
      take(1)
    )
    .subscribe(async () => {
      await this.fetchStakeDataPerEpoch(publicId, epoch, currentEpoch, true);

      const updatedLockedAmount = this.stakeData[publicId]?.find((data) => data.lockedEpoch === epoch)?.lockedAmount ?? 0;

      const success = initialLockedAmount !== updatedLockedAmount;

      this._snackBar.open(this.transloco.translate(success ? 'qearn.main.txSuccess' : 'qearn.main.txFailed'), this.transloco.translate('general.close'), {
        duration: 0,
        panelClass: success ? 'success' : 'error',
      });

      this.txSuccessSubject.next(this.pendingStake!);
      this.pendingStake = null;
    });
};

export const monitorStakeTransaction = (publicId: string, initialLockedAmount: number, epoch: number): void => {
  monitorTransaction(publicId, initialLockedAmount, epoch, epoch, 'stake');
};

export const monitorUnlockTransaction = (publicId: string, initialLockedAmount: number, currentEpoch: number, lockedEpoch: number): void => {
  monitorTransaction(publicId, initialLockedAmount, lockedEpoch, currentEpoch, 'unlock');
};
