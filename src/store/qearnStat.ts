import { IBurnedAndBoostedStats, ILockInfo } from "@/types";
import { atom } from "jotai";

export interface IQearnStats {
  [epoch: number]: ILockInfo & IBurnedAndBoostedStats;
  totalInitialLockAmount: number;
  totalInitialBonusAmount: number;
  totalLockAmount: number;
  totalBonusAmount: number;
  averageYieldPercentage: number;
}

export const qearnStatsAtom = atom<IQearnStats>({} as IQearnStats);
