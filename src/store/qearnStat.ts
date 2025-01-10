import { ILockInfo } from '@/types';
import { atom } from 'jotai';

export interface IQearnStats {
  [epoch: number]: ILockInfo;
}

export const qearnStatsAtom = atom<IQearnStats>({} as IQearnStats);
