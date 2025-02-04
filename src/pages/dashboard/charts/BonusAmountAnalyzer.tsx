import { EChart } from "@kbox-labs/react-echarts";
import Card from "@/components/ui/Card";
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";
import { EChartsOption } from "echarts";
import { useAtom } from "jotai";
import { dark, light } from "@/data/chart-theme";
import { getBurnedAndBoostedStats } from "@/services/qearn.service";
import { tickInfoAtom } from "@/store/tickInfo";
import { IBurnNBoostedStats } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { settingsAtom } from "@/store/settings";
import { useTranslation } from "react-i18next";

const BonusAmountAnalyzer: React.FC = () => {
  const [burnNBoostedStats, setBurnNBoostedStats] = useState<IBurnNBoostedStats>({} as IBurnNBoostedStats);
  const [tickInfo] = useAtom(tickInfoAtom);
  const currentEpoch = useMemo(() => tickInfo?.epoch || 142, [tickInfo?.epoch]);
  const [settings] = useAtom(settingsAtom);
  const { t } = useTranslation();

  useEffect(() => {
    getBurnedAndBoostedStats().then(setBurnNBoostedStats);
  }, [currentEpoch]);

  const option: EChartsOption = {
    title: {
      text: t("dashboard.Bonus Distribution"),
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "horizontal",
      bottom: "0",
    },
    series: [
      {
        name: t("dashboard.Bonus Distribution"),
        type: "pie",
        radius: "50%",
        data: [
          { value: burnNBoostedStats?.boostedAmount || 0, name: t("dashboard.Boosted Bonus") },
          { value: burnNBoostedStats?.burnedAmount || 0, name: t("dashboard.Burned Bonus") },
          { value: burnNBoostedStats?.rewardedAmount || 0, name: t("dashboard.Rewarded Bonus") },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const chartComponents = [TitleComponent, TooltipComponent, LegendComponent, PieChart, SVGRenderer, LabelLayout];

  return (
    <Card className="max-w-lg p-4">
      <EChart
        style={{ width: "400px", height: "400px" }}
        key={settings.darkMode ? "dark" : "light"}
        theme={settings.darkMode ? dark : light}
        use={chartComponents}
        {...option}
      />
    </Card>
  );
};

export default BonusAmountAnalyzer;
