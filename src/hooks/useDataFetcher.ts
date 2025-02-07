import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { tickInfoAtom } from "@/store/tickInfo";
import { qearnStatsAtom } from "@/store/qearnStat";
import { latestStatsAtom } from "@/store/latestStats";
import { balancesAtom } from "@/store/balances";
import { closeTimeAtom } from "@/store/closeTime";
import { userLockInfoAtom } from "@/store/userLockInfo";
import { useQubicConnect } from "@/components/connect/QubicConnectContext";
import { useFetchTickInfo } from "@/hooks/useFetchTickInfo";
import {
  fetchBalance,
  fetchLatestStats,
} from "@/services/rpc.service";
import {
  getBurnedAndBoostedStatsPerEpoch,
  getLockInfoPerEpoch,
  getUserLockInfo,
  getUserLockStatus,
} from "@/services/qearn.service";
import { getTimeToNewEpoch } from "@/utils";
import { QEARN_START_EPOCH } from "@/data/contants";

const useDataFetcher = () => {
  const { refetch: refetchTickInfo } = useFetchTickInfo();
  const intervalRef = useRef<NodeJS.Timeout>();
  const [tickInfo, setTickInfo] = useAtom(tickInfoAtom);
  const epoch = useRef<number>(tickInfo?.epoch);
  const [, setQearnStats] = useAtom(qearnStatsAtom);
  const [, setLatestStats] = useAtom(latestStatsAtom);
  const [, setCloseTime] = useAtom(closeTimeAtom);
  const [, setUserLockInfo] = useAtom(userLockInfoAtom);
  const [balances, setBalance] = useAtom(balancesAtom);
  const { wallet } = useQubicConnect();

  // Fetch tick info every 2 seconds
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const { data } = await refetchTickInfo();
      if (data && data?.tick) {
        setTickInfo(data);
        epoch.current = data.epoch;
      }
    }, 2000);

    return () => clearInterval(intervalRef.current!);
  }, [refetchTickInfo, setTickInfo]);

  // Fetch latest stats once on mount
  useEffect(() => {
    fetchLatestStats().then(setLatestStats);
  }, [setLatestStats]);

  // Update close time every second
  useEffect(() => {
    setTimeout(() => {
      setCloseTime(getTimeToNewEpoch());
    }, 1000);
  }, [setCloseTime]);

  // Fetch epoch lock data
  useEffect(() => {
    const fetchEpochData = async () => {
      const lockInfoPromises = [];
      for (let i = epoch.current; i >= epoch.current - 52; i--) {
        if (i < QEARN_START_EPOCH) continue;
        lockInfoPromises.push(getLockInfoPerEpoch(i));
      }

      const lockInfoResults = await Promise.all(lockInfoPromises);

      const burnedAndBoostedStatsPromises = [];
      for (let i = epoch.current; i >= epoch.current - 52; i--) {
        if (i < QEARN_START_EPOCH) continue;
        burnedAndBoostedStatsPromises.push(getBurnedAndBoostedStatsPerEpoch(i));
      }

      const burnedAndBoostedStatsResults = await Promise.all(burnedAndBoostedStatsPromises);

      const newStats = lockInfoResults.reduce<
        Record<number, any> & {
          totalInitialLockAmount: number;
          totalInitialBonusAmount: number;
          totalLockAmount: number;
          totalBonusAmount: number;
          averageYieldPercentage: number;
        }
      >(
        (acc, epochLockInfo, index) => {
          if (epochLockInfo) {
            acc[epoch.current - index] = { ...epochLockInfo, ...burnedAndBoostedStatsResults[index] };
            acc.totalInitialLockAmount += epochLockInfo.lockAmount;
            acc.totalInitialBonusAmount += epochLockInfo.bonusAmount;
            acc.totalLockAmount += epochLockInfo.currentLockedAmount;
            acc.totalBonusAmount += epochLockInfo.currentBonusAmount;
            if (index !== 0)
              acc.averageYieldPercentage =
                ((acc.averageYieldPercentage || 0) * (index - 1) + epochLockInfo.yieldPercentage) / index;
          }
          return acc;
        },
        {
          totalInitialLockAmount: 0,
          totalInitialBonusAmount: 0,
          totalLockAmount: 0,
          totalBonusAmount: 0,
          averageYieldPercentage: 0,
        },
      );

      setQearnStats((prev) => ({
        ...prev,
        ...newStats,
      }));
    };

    fetchEpochData();
  }, [epoch.current, setQearnStats]);

  // Fetch wallet balance when wallet changes
  useEffect(() => {
    const setUserAccount = async () => {
      if (wallet) {
        const balance = await fetchBalance(wallet.publicKey);
        setBalance([balance]);
      }
    };
    setUserAccount();
  }, [wallet, setBalance]);

  // Fetch user lock data
  useEffect(() => {
    if (!balances.length || !epoch.current) return;
    const fetchUserLockData = async () => {
      const lockEpochs = await getUserLockStatus(balances[0].id, epoch.current);
      lockEpochs.forEach(async (epoch) => {
        const lockedAmount = await getUserLockInfo(balances[0].id, epoch);
        setUserLockInfo((prev) => ({
          ...prev,
          [balances[0].id]: {
            ...prev[balances[0].id],
            [epoch]: lockedAmount,
          },
        }));
      });
    };
    fetchUserLockData();
  }, [balances, epoch.current, setUserLockInfo]);
};

export default useDataFetcher;
