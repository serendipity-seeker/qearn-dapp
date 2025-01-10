import { DEFAULT_TICK_OFFSET } from '@/constants';
import { atom } from 'jotai';

export type Settings = {
  tickOffset: number;
  darkMode: boolean;
  notifications: boolean;
};

export const settingsAtom = atom<Settings>({
  tickOffset: DEFAULT_TICK_OFFSET,
  darkMode: false,
  notifications: false,
});
