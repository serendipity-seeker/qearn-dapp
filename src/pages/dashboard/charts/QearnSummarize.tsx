import Card from "@/components/ui/Card";
import { getBurnedAndBoostedStats } from "@/services/qearn.service";
import { qearnStatsAtom } from "@/store/qearnStat";
import { tickInfoAtom } from "@/store/tickInfo";
import { IBurnNBoostedStats } from "@/types";
import { formatQubicAmount } from "@/utils";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const QearnSummarize: React.FC = () => {
  const [burnNBoostedStats, setBurnNBoostedStats] = useState<IBurnNBoostedStats>({} as IBurnNBoostedStats);
  const [tickInfo] = useAtom(tickInfoAtom);
  const currentEpoch = useMemo(() => tickInfo?.epoch || 142, [tickInfo?.epoch]);
  const [qearnStats] = useAtom(qearnStatsAtom);
  const { t } = useTranslation();

  useEffect(() => {
    getBurnedAndBoostedStats().then(setBurnNBoostedStats);
  }, [currentEpoch]);

  return (
    <Card className="min-h-[400px] max-w-lg p-6">
      <div className="space-y-4">
        <h1 className="text-center text-3xl">{t("dashboard.Qearn Summarize")}</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t("dashboard.Total Locked Amount")}</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(qearnStats?.totalLockAmount || 0) || 0}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t("dashboard.Total Bonus Amount")}</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(qearnStats?.totalBonusAmount || 0) || 0}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t("dashboard.Burned Amount")}</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(burnNBoostedStats?.burnedAmount || 0) || 0}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t("dashboard.Boosted Amount")}</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(burnNBoostedStats?.boostedAmount || 0) || 0}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t("dashboard.Rewarded Amount")}</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(burnNBoostedStats?.rewardedAmount || 0) || 0}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t("dashboard.Average Yield Percent")}</p>
            <p className="text-2xl font-semibold">{(qearnStats?.averageYieldPercentage / 100000 || 0).toFixed(2)}%</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t("dashboard.Average Burned Percent")}</p>
            <p className="text-2xl font-semibold">
              {(burnNBoostedStats?.averageBurnedPercent / 100000 || 0).toFixed(2)}%
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t("dashboard.Average Boosted Percent")}</p>
            <p className="text-2xl font-semibold">
              {(burnNBoostedStats?.averageBoostedPercent / 100000 || 0).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QearnSummarize;
