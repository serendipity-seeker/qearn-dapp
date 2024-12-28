export type TickInfo = {
  tick: number;
  duration: number;
  epoch: number;
  initialTick: number;
};

export type Balance = {
  id: string;
  balance: number;
  validForTick: number;
  latestIncomingTransferTick: number;
  latestOutgoingTransferTick: number;
  incomingAmount: number;
  outgoingAmount: number;
  numberOfIncomingTransfers: number;
  numberOfOutgoingTransfers: number;
};

export type Settings = {
  tickOffset: number;
  darkMode: boolean;
  notifications: boolean;
};

export interface IQuerySC {
  contractIndex: number;
  inputType: number;
  inputSize: number;
  requestData: string;
}

export interface IQuerySCResponse {
  responseData: string;
}

export interface LockInfoPerEpoch {
  lockAmount: number;
  bonusAmount: number;
  currentLockedAmount: number;
  currentBonusAmount: number;
  yieldPercentage: number;
}

export interface IStakeStatus {
  publicId: string;
  lockedEpoch: number;
  lockedAmount: number;
  lockedWeeks: number;
  totalLockedAmountInEpoch: number;
  currentBonusAmountInEpoch: number;
  earlyUnlockReward: number;
  fullUnlockReward: number;
  earlyUnlockRewardRatio: number;
  fullUnlockRewardRatio: number;
}

export interface IEndedStakeStatus {
  unLockedAmount: number;
  rewardedAmount: number;
  status?: boolean;
}
