import { DEFAULT_TICK_OFFSET } from '@/constants';
import { Settings } from '@/types';
import { atom } from 'jotai';

export const settingsAtom = atom<Settings>({
  tickOffset: DEFAULT_TICK_OFFSET,
  darkMode: false,
  notifications: false,
});
