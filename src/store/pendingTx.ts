import { atom } from 'jotai';

export interface IPendingTx {
  txId: string;
  publicId: string;
  initAmount: number;
  amount: number;
  epoch: number;
  targetTick: number;
  type: string;
}

export const pendingTxAtom = atom<IPendingTx>({} as IPendingTx);
