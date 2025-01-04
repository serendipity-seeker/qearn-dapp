import { IQearnStats } from '@/types';
import { atom } from 'jotai';

export const qearnStatsAtom = atom<IQearnStats>({} as IQearnStats);
