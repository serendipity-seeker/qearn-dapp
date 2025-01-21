import Card from '@/components/ui/Card';
import { getBurnedAndBoostedStats } from '@/services/qearn.service';
import { qearnStatsAtom } from '@/store/qearnStat';
import { tickInfoAtom } from '@/store/tickInfo';
import { IBurnNBoostedStats } from '@/types';
import { formatQubicAmount } from '@/utils';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';

const QearnSummarize: React.FC = () => {
  const [burnNBoostedStats, setBurnNBoostedStats] = useState<IBurnNBoostedStats>({} as IBurnNBoostedStats);
  const [tickInfo] = useAtom(tickInfoAtom);
  const currentEpoch = useMemo(() => tickInfo?.epoch || 142, [tickInfo?.epoch]);
  const [qearnStats] = useAtom(qearnStatsAtom);

  useEffect(() => {
    getBurnedAndBoostedStats().then(setBurnNBoostedStats);
  }, [currentEpoch]);

  return (
    <Card className="max-w-lg p-6">
      <div className="space-y-4">
        <h1 className="text-3xl text-center ">Qearn Summarize</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Locked Amount</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(qearnStats?.totalLockAmount || 0) || 0}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Bonus Amount</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(qearnStats?.totalBonusAmount || 0) || 0}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Burned Amount</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(burnNBoostedStats?.burnedAmount || 0) || 0}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Boosted Amount</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(burnNBoostedStats?.boostedAmount || 0) || 0}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Rewarded Amount</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(burnNBoostedStats?.rewardedAmount || 0) || 0}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Average Yield Percent</p>
            <p className="text-2xl font-semibold">{(qearnStats?.averageYieldPercentage / 100000 || 0).toFixed(2)}%</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Average Burned Percent</p>
            <p className="text-2xl font-semibold">{(burnNBoostedStats?.averageBurnedPercent / 100000 || 0).toFixed(2)}%</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Average Boosted Percent</p>
            <p className="text-2xl font-semibold">{(burnNBoostedStats?.averageBoostedPercent / 100000 || 0).toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QearnSummarize;
