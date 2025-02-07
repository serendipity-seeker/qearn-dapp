import { DEFAULT_TICK_OFFSET } from "@/constants";
import { atom } from "jotai";

export type Settings = {
  tickOffset: number;
  darkMode: boolean;
  showDeveloperPage: boolean;
  showTransferForm: boolean;
};

export const settingsAtom = atom<Settings>({
  tickOffset: DEFAULT_TICK_OFFSET,
  darkMode: true,
  showDeveloperPage: false,
  showTransferForm: false,
});
