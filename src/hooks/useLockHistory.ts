import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userLockInfoAtom } from "@/store/userLockInfo";
import { qearnStatsAtom } from "@/store/qearnStat";
import { tickInfoAtom } from "@/store/tickInfo";
import { pendingTxAtom } from "@/store/pendingTx";
import { settingsAtom } from "@/store/settings";
import { balancesAtom } from "@/store/balances";
import { calculateRewards, decodeUint8ArrayTx } from "@/utils";
import { toast } from "react-hot-toast";
import { unLockQubic } from "@/services/qearn.service";
import { broadcastTx } from "@/services/rpc.service";
import { useTranslation } from "react-i18next";
import { SortingState } from "@tanstack/react-table";
import { useQubicConnect } from "@/components/connect/QubicConnectContext";

interface ITableData {
  lockedEpoch: number;
  lockedAmount: number;
  totalLockedAmountInEpoch: number;
  currentBonusAmountInEpoch: number;
  earlyUnlockReward: { reward: number; ratio: number };
  fullUnlockReward: { reward: number; ratio: number };
}

export const useLockHistory = () => {
  const [selectedAccount, setSelectedAccount] = useState<number>(0);
  const [accounts, setAccounts] = useState<{ label: string; value: string }[]>([]);
  const [userLockInfo] = useAtom(userLockInfoAtom);
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [tableData, setTableData] = useState<ITableData[]>([]);
  const [tickInfo] = useAtom(tickInfoAtom);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [, setPendingTx] = useAtom(pendingTxAtom);
  const [settings] = useAtom(settingsAtom);
  const [balances] = useAtom(balancesAtom);
  const { getSignedTx } = useQubicConnect();
  const { t } = useTranslation();

  useEffect(() => {
    if (balances.length > 0) {
      setAccounts([{ label: `${t("qearnForm.Account")} 1`, value: balances[0].id }]);
    } else {
      setAccounts([]);
    }
  }, [userLockInfo, t, balances]);

  useEffect(() => {
    if (accounts.length < 0 || !qearnStats || !userLockInfo) return;
    setTableData(
      Object.entries(userLockInfo[accounts[selectedAccount]?.value] || {}).map(([epochStr, amount]) => {
        const lockedEpoch = parseInt(epochStr);
        const rewards = calculateRewards(
          amount,
          qearnStats[lockedEpoch]?.currentLockedAmount || 0,
          qearnStats[lockedEpoch]?.currentBonusAmount || 0,
          qearnStats[lockedEpoch]?.yieldPercentage || 0,
          tickInfo.epoch,
          lockedEpoch,
        );
        return {
          lockedEpoch,
          lockedAmount: amount,
          totalLockedAmountInEpoch: qearnStats[lockedEpoch]?.currentLockedAmount || 0,
          currentBonusAmountInEpoch: qearnStats[lockedEpoch]?.currentBonusAmount || 0,
          earlyUnlockReward: { reward: rewards.earlyUnlockReward, ratio: rewards.earlyUnlockRewardRatio },
          fullUnlockReward: { reward: rewards.fullUnlockReward, ratio: rewards.fullUnlockRewardRatio },
        };
      }),
    );
  }, [accounts, qearnStats, userLockInfo, selectedAccount, tickInfo.epoch]);

  const handleUnlockEarly = async (unlockAmount: number) => {
    try {
      const balance = balances.find((balance) => balance.id === accounts[selectedAccount].value);
      if (!balance || balance.balance === "0") {
        return { shouldShowReminder: true };
      }

      const tx = await unLockQubic(
        accounts[selectedAccount].value,
        unlockAmount,
        tableData[selectedIdx || 0].lockedEpoch,
        tickInfo?.tick + settings.tickOffset,
      );
      const { tx: signedTx } = await getSignedTx(tx);
      const decodedTx = decodeUint8ArrayTx(signedTx);
      const res = await broadcastTx(signedTx);

      setPendingTx({
        txId: res.transactionId,
        publicId: accounts[selectedAccount].value,
        initAmount: userLockInfo[accounts[selectedAccount].value]?.[tableData[selectedIdx || 0].lockedEpoch] || 0,
        amount: -tableData[selectedIdx || 0].lockedAmount || 0,
        epoch: tableData[selectedIdx || 0].lockedEpoch,
        targetTick: decodedTx.tick,
        type: "qearn",
      });

      toast.success(t("toast.Transaction sent, it will take some time to be confirmed and executed"));
      return { success: true };
    } catch (err) {
      toast.error(t("toast.Something went wrong"));
      return { success: false };
    }
  };

  return {
    selectedAccount,
    setSelectedAccount,
    accounts,
    tableData,
    sorting,
    setSorting,
    selectedIdx,
    setSelectedIdx,
    handleUnlockEarly,
  };
};
