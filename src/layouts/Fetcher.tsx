import { useFetchTickInfo } from '@/hooks/useFetchTickInfo';
import { getLockInfoPerEpoch } from '@/services/qearn.service';
import { tickInfoAtom } from '@/store/tickInfo';
import { qearnStatsAtom } from '@/store/qearnStat';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';

const Fetcher: React.FC = () => {
  const { refetch: refetchTickInfo } = useFetchTickInfo();
  const intervalRef = useRef<NodeJS.Timeout>();
  const [tickInfo, setTickInfo] = useAtom(tickInfoAtom);

  const epoch = useRef<number>(tickInfo?.epoch || 142);
  const [, setQearnStats] = useAtom(qearnStatsAtom);

  // Fetch tick info every 1 second
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
    }, 1000);

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
        promises.push(getLockInfoPerEpoch(i));
      }

      const results = await Promise.all(promises);
      
      const newStats = results.reduce<Record<number, any>>((acc, epochLockInfo, index) => {
        if (epochLockInfo) {
          acc[epoch.current - index] = epochLockInfo;
        }
        return acc;
      }, {});

      setQearnStats(prev => ({ ...prev, ...newStats }));
    };
    
    fetchEpochData();
  }, [epoch.current]);

  return null;
};

export default Fetcher;
