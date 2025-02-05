import { EChart } from "@kbox-labs/react-echarts";
import Card from "@/components/ui/Card";
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";
import { EChartsOption } from "echarts";
import { useAtom } from "jotai";
import { qearnStatsAtom } from "@/store/qearnStat";
import { dark, light } from "@/data/chart-theme";
import { settingsAtom } from "@/store/settings";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const TVL: React.FC = () => {
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [settings] = useAtom(settingsAtom);
  const { t } = useTranslation();

  const [isMobile] = useState(window.innerWidth < 520);

  const data = Object.entries(qearnStats)
    .filter(([epoch]) => Number(epoch))
    .map(([epoch, stats]) => ({
      value: stats?.currentLockedAmount || 0,
      name: `EP${epoch}`,
    }));

  const option: EChartsOption = {
    title: {
      text: t("dashboard.Total Locked $QUBIC"),
      subtext: t("dashboard.Locked Amounts per Epoch"),
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "horizontal",
      bottom: "5%",
    },
    series: [
      {
        name: t("dashboard.Locked Amounts"),
        type: "pie",
        radius: "50%",
        data,
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
        style={{ width: isMobile ? "280px" : "400px", height: isMobile ? "360px" : "400px" }}
        key={settings.darkMode ? "dark" : "light"}
        theme={settings.darkMode ? dark : light}
        use={chartComponents}
        {...option}
      />
    </Card>
  );
};

export default TVL;
