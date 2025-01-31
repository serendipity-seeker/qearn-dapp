import { qearnStatsAtom } from "@/store/qearnStat";
import Card from "./ui/Card";
import { useAtom } from "jotai";
import { formatQubicAmount } from "@/utils";
import { useMemo } from "react";

interface ILockStatCardProps {
  currentEpoch: number;
}

const LockStatCard: React.FC<ILockStatCardProps> = ({ currentEpoch }) => {
  const [qearnStats] = useAtom(qearnStatsAtom);

  const currentStats = useMemo(
    () =>
      qearnStats[currentEpoch] || {
        currentBonusAmount: 0,
        currentLockedAmount: 0,
        bonusAmount: 0,
        lockAmount: 0,
        yieldPercentage: 0,
      },
    [qearnStats, currentEpoch],
  );

  return (
    <Card className="max-w-lg p-6">
      <div className="space-y-4">
        <h1 className="text-center text-3xl">Lock Information {currentEpoch}</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Current Locked Amount</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(currentStats.currentBonusAmount)} QU</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Current Bonus Amount</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(currentStats.currentLockedAmount)} QU</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Bonus Amount</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(currentStats.bonusAmount)} QU</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Lock Amount</p>
            <p className="text-2xl font-semibold">{formatQubicAmount(currentStats.lockAmount)} QU</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Yield Percentage</p>
            <p className="text-2xl font-semibold">{(currentStats.yieldPercentage / 1e5).toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LockStatCard;
