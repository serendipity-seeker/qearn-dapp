import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { toast } from "react-hot-toast";
import { getUserLockInfo } from "@/services/qearn.service";
import { fetchBalance, fetchTxStatus } from "@/services/rpc.service";
import { balancesAtom } from "@/store/balances";
import { IPendingTx, pendingTxAtom } from "@/store/pendingTx";
import { tickInfoAtom } from "@/store/tickInfo";
import { userLockInfoAtom } from "@/store/userLockInfo";
import { useTranslation } from "react-i18next";

const useTxMonitor = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const [pendingTx, setPendingTx] = useAtom(pendingTxAtom);
  const [, setBalance] = useAtom(balancesAtom);
  const [, setUserLockInfo] = useAtom(userLockInfoAtom);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { t } = useTranslation();

  const checkTxResult = async () => {
    if (!isMonitoring || !tickInfo?.tick || !pendingTx?.targetTick) return;

    if (tickInfo.tick > pendingTx.targetTick) {
      if (tickInfo.tick > pendingTx.targetTick + 15) {
        toast.error(t("toast.Transaction failed"));
        setIsMonitoring(false);
        setPendingTx({} as IPendingTx);
        return;
      }

      if (pendingTx.type === "qearn") {
        const lockedAmount = await getUserLockInfo(pendingTx.publicId, pendingTx.epoch);
        if (lockedAmount - pendingTx.initAmount === pendingTx.amount) {
          toast.success(pendingTx.amount > 0 ? t("toast.Locked successfully") : t("toast.Unlocked successfully"));
        } else {
          return;
        }
        const updatedLockAmount = await getUserLockInfo(pendingTx.publicId, pendingTx.epoch);
        if (updatedLockAmount == 0) {
          setUserLockInfo((prev) => {
            const newState = { ...prev };
            const publicIdState = { ...newState[pendingTx.publicId] };
            delete publicIdState[pendingTx.epoch];
            newState[pendingTx.publicId] = publicIdState;
            return newState;
          });
        } else {
          setUserLockInfo((prev) => ({
            ...prev,
            [pendingTx.publicId]: {
              ...prev[pendingTx.publicId],
              [pendingTx.epoch]: updatedLockAmount,
            },
          }));
        }
      } else if (pendingTx.type === "transfer") {
        const txStatus = await fetchTxStatus(pendingTx.txId);
        if (txStatus?.moneyFlew) {
          toast.success(t("toast.Transferred successfully"));
        } else {
          return;
        }
      }
      const updatedBalance = await fetchBalance(pendingTx.publicId);
      setBalance([updatedBalance]);
      setPendingTx({} as IPendingTx);
      setIsMonitoring(false);
    }
  };

  useEffect(() => {
    if (Object.keys(pendingTx).length === 0) return;
    setIsMonitoring(true);
    checkTxResult();
  }, [tickInfo, pendingTx]);

  useEffect(() => {
    let toastId: string;
    if (isMonitoring) {
      toastId = toast.loading(t("toast.Monitoring transaction..."), { position: "bottom-right" });
    }
    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [isMonitoring]);
};

export default useTxMonitor;
