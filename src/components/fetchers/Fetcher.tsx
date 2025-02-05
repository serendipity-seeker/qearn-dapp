import { useFetchTickInfo } from "@/hooks/useFetchTickInfo";
import {
  getBurnedAndBoostedStatsPerEpoch,
  getLockInfoPerEpoch,
  getUserLockInfo,
  getUserLockStatus,
} from "@/services/qearn.service";
import { tickInfoAtom } from "@/store/tickInfo";
import { qearnStatsAtom } from "@/store/qearnStat";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { QEARN_START_EPOCH } from "@/data/contants";
import { useQubicConnect } from "@/components/connect/QubicConnectContext";
import { fetchBalance, fetchLatestStats } from "@/services/rpc.service";
import { balancesAtom } from "@/store/balances";
import { closeTimeAtom } from "@/store/closeTime";
import { getTimeToNewEpoch } from "@/utils";
import { userLockInfoAtom } from "@/store/userLockInfo";
import { latestStatsAtom } from "@/store/latestStats";

const Fetcher: React.FC = () => {
  const { refetch: refetchTickInfo } = useFetchTickInfo();
  const intervalRef = useRef<NodeJS.Timeout>();
  const [tickInfo, setTickInfo] = useAtom(tickInfoAtom);

  const epoch = useRef<number>(tickInfo?.epoch);
  const [, setQearnStats] = useAtom(qearnStatsAtom);

  // Fetch tick info every 2 second
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      const { data } = await refetchTickInfo();
      if (data && data?.tick) {
        setTickInfo(data);
        epoch.current = data.epoch;
      }
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchTickInfo, setTickInfo]);

  // Fetch latest stats
  const [, setLatestStats] = useAtom(latestStatsAtom);
  useEffect(() => {
    fetchLatestStats().then(setLatestStats);
  }, []);

  // Update close time
  const [, setCloseTime] = useAtom(closeTimeAtom);
  useEffect(() => {
    setTimeout(() => {
      const timeToNewEpoch = getTimeToNewEpoch();
      setCloseTime(timeToNewEpoch);
    }, 1000);
  }, []);

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
      console.log("burnedAndBoostedStatsResults", burnedAndBoostedStatsResults);
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
  }, [epoch.current]);

  // Wallet Setter
  const { wallet } = useQubicConnect();
  const [balances, setBalance] = useAtom(balancesAtom);

  useEffect(() => {
    const setUserAccount = async () => {
      if (wallet) {
        const balance = await fetchBalance(wallet.publicKey);
        setBalance([balance]);
      }
    };
    setUserAccount();
  }, [wallet]);

  // Fetch user lock data
  const [userLockInfo, setUserLockInfo] = useAtom(userLockInfoAtom);

  useEffect(() => {
    if (!balances.length || !epoch.current) return;
    const fetchUserLockData = async () => {
      const lockEpochs = await getUserLockStatus(balances[0].id, epoch.current);
      lockEpochs.forEach(async (epoch) => {
        const lockedAmount = await getUserLockInfo(balances[0].id, epoch);
        setUserLockInfo({
          ...userLockInfo,
          [balances[0].id]: {
            ...userLockInfo[balances[0].id],
            [epoch]: lockedAmount,
          },
        });
      });
    };
    fetchUserLockData();
  }, [balances, epoch.current]);

  return null;
};

export default Fetcher;
