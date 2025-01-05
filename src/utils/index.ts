import { REWARD_DATA } from '@/data/contants';

// format number input to 100,000,000 format
export const formatQubicAmount = (amount: number, seperator = ',') => {
  return amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, seperator)
    .replace('.0', '');
};

export const truncateMiddle = (str: string, charsToRemove: number) => {
  const length = str.length;
  const start = Math.floor((length - charsToRemove) / 2);
  const end = start + charsToRemove;

  return str.slice(0, start) + '...' + str.slice(end);
};

export const sumArray = (arr: any[]) => arr.reduce((acc, curr) => acc + curr, 0);

// Convert Uint8Array to hex string
export const byteArrayToHexString = (byteArray: any[]) => {
  const hexString = Array.from(byteArray, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return hexString;
};

// Basic validation checks
export const isAddressValid = (toAddress: string) => toAddress.length === 60 && /^[A-Z]+$/.test(toAddress);
export const isPositiveNumber = (amount: number) => !isNaN(Number(amount)) && Number(amount) > 0;
export const isAmountValid = (amount: number) => isPositiveNumber(amount) && amount % 1 === 0;

export const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  const binaryString = String.fromCharCode.apply(null, Array.from(uint8Array));
  return btoa(binaryString);
};

export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  return new Uint8Array(binaryString.split('').map((char) => char.charCodeAt(0)));
};

export const createDataView = (size: number): { buffer: ArrayBuffer; view: DataView } => {
  const buffer = new ArrayBuffer(size);
  return { buffer, view: new DataView(buffer) };
};

interface ICreatePayload {
  data: number;
  type: 'uint8' | 'uint16' | 'uint32' | 'bigint64';
}

export const createPayload = (data: ICreatePayload[]) => {
  const TYPE_SIZES = {
    uint8: 1,
    uint16: 2,
    uint32: 4,
    bigint64: 8,
  };

  const totalSize = data.reduce((acc, { type }) => acc + TYPE_SIZES[type], 0);

  const { buffer, view } = createDataView(totalSize);

  let offset = 0;
  const setters = {
    uint8: (v: DataView, o: number, d: number) => {
      v.setUint8(o, d);
      return 1;
    },
    uint16: (v: DataView, o: number, d: number) => {
      v.setUint16(o, d, true);
      return 2;
    },
    uint32: (v: DataView, o: number, d: number) => {
      v.setUint32(o, d, true);
      return 4;
    },
    bigint64: (v: DataView, o: number, d: number) => {
      v.setBigUint64(o, BigInt(d), true);
      return 8;
    },
  };

  data.forEach(({ type, data: value }) => {
    offset += setters[type](view, offset, value);
  });

  return new Uint8Array(buffer);
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
