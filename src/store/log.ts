import { atom } from "jotai";
import { IQearnEvent } from "@/hooks/useLog";

export const logAtom = atom<IQearnEvent[]>([]);
