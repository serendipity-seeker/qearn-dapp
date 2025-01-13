import { atom } from 'jotai';

export const closeTimeAtom = atom<{ days: number; hours: number; minutes: number }>({ days: 0, hours: 0, minutes: 0 });
