import { formatQubicAmount } from "@/utils";
import { FaLock as FaLockSolid, FaClock as FaClockSolid, FaPercent as FaPercentSolid } from "react-icons/fa6";
import { closeTimeAtom } from "@/store/closeTime";
import { useAtom } from "jotai";
import { qearnStatsAtom } from "@/store/qearnStat";
import { tickInfoAtom } from "@/store/tickInfo";
import { useTranslation } from "react-i18next";

const InfoBanner: React.FC = () => {
  const [closeTime] = useAtom(closeTimeAtom);
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [tickInfo] = useAtom(tickInfoAtom);
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 border-b-2 border-t-2 border-gray-50 border-opacity-20 p-6 md:flex-row">
      <div>
        <span>
          <FaLockSolid className="mr-1 inline" /> TVL:
        </span>
        <span>{formatQubicAmount(qearnStats?.totalLockAmount || 0)}</span>
      </div>
      <div className="border-opacity-20 px-4 text-center md:border-l-2 md:border-r-2 md:border-gray-50">
        <FaClockSolid className="mr-1 inline" />
        {t("infoBanner.Weekly Locking Closes in {{days}} d {{hours}} h {{minutes}} min", {
          days: closeTime.days,
          hours: closeTime.hours,
          minutes: closeTime.minutes,
        })}
      </div>
      <div>
        <span>
          <FaPercentSolid className="mr-1 inline" /> {t("infoBanner.Current APY")}:
        </span>
        <span>{(qearnStats[tickInfo?.epoch]?.yieldPercentage / 100000 || 0).toFixed(2)}%</span>
      </div>
    </div>
  );
};

export default InfoBanner;
