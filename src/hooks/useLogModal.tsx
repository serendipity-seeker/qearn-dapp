import { logAtom } from "@/store/log";
import { useAtom } from "jotai";
import { IQearnEvent } from "./useLog";

export const useLogModal = () => {
  const [, setLogData] = useAtom(logAtom);

  const openModal = (logs: IQearnEvent[]) => {
    setLogData(logs);
  };

  const closeModal = () => {
    setLogData([]);
  };

  return {
    openModal,
    closeModal,
  };
};

export default useLogModal;
