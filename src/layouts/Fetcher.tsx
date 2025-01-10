import { useFetchTickInfo } from '@/hooks/useFetchTickInfo';
import { getLockInfoPerEpoch } from '@/services/qearn.service';
import { tickInfoAtom } from '@/store/tickInfo';
import { qearnStatsAtom } from '@/store/qearnStat';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { QEARN_START_EPOCH } from '@/data/contants';
import { useQubicConnect } from '@/components/connect/QubicConnectContext';
import { fetchBalance } from '@/services/rpc.service';
import { balancesAtom } from '@/store/balances';

const Fetcher: React.FC = () => {
  const { refetch: refetchTickInfo } = useFetchTickInfo();
  const intervalRef = useRef<NodeJS.Timeout>();
  const [tickInfo, setTickInfo] = useAtom(tickInfoAtom);

  const epoch = useRef<number>(tickInfo?.epoch || 142);
  const [, setQearnStats] = useAtom(qearnStatsAtom);

  // Fetch tick info every 2 second
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      const { data } = await refetchTickInfo();
      if (data) {
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

  // Fetch epoch data
  useEffect(() => {
    const fetchEpochData = async () => {
      const promises = [];
      for (let i = epoch.current; i >= epoch.current - 52; i--) {
        if (i < QEARN_START_EPOCH) continue;
        promises.push(getLockInfoPerEpoch(i));
      }

      const results = await Promise.all(promises);

      const newStats = results.reduce<Record<number, any>>((acc, epochLockInfo, index) => {
        if (epochLockInfo) {
          acc[epoch.current - index] = epochLockInfo;
        }
        return acc;
      }, {});

      setQearnStats((prev) => ({ ...prev, ...newStats }));
    };

    fetchEpochData();
  }, [epoch.current]);

  const { wallet } = useQubicConnect();
  const [, setBalance] = useAtom(balancesAtom);

  useEffect(() => {
    const setUserAccount = async () => {
      if (wallet) {
        const balance = await fetchBalance(wallet.publicKey);
        setBalance([balance]);
      }
    };
    setUserAccount();
  }, [wallet]);

  return null;
};

export default Fetcher;
