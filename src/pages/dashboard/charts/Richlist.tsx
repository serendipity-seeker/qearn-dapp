import { EChart } from "@kbox-labs/react-echarts";
import Card from "@/components/ui/Card";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";
import { EChartsOption } from "echarts";
import { useAtom, useAtomValue } from "jotai";
import { latestStatsAtom } from "@/store/latestStats";
import { useState, useEffect } from "react";
import { fetchRichList } from "@/services/rpc.service";
import { LABELS } from "@/data/labels";
import { dark, light } from "@/data/chart-theme";
import { settingsAtom } from "@/store/settings";
import { useTranslation } from "react-i18next";
import { qearnStatsAtom } from "@/store/qearnStat";

const Richlist: React.FC = () => {
  const [richlist, setRichlist] = useState<{ identity: string; balance: number }[]>([]);
  const [qearnStats] = useAtom(qearnStatsAtom);
  const latestStats = useAtomValue(latestStatsAtom);
  const [settings] = useAtom(settingsAtom);
  const { t } = useTranslation();
  const [isMobile] = useState(window.innerWidth < 520);

  useEffect(() => {
    if (!latestStats) return;
    fetchRichList(1, 15).then((res) => {
      const entries = res?.richList?.entities.map((entity) => ({
        identity: LABELS[entity.identity as keyof typeof LABELS] || `User ${entity.identity.slice(0, 4)}`,
        balance: Number(entity.balance),
      }));
      const qearnAddress = entries.find(item=> item.identity == "QEarn")!;
      qearnAddress.balance = qearnStats.totalLockAmount;
      
      const totalAmount = entries.reduce((acc, curr) => acc + curr.balance, 0);
      entries.push({
        identity: t("dashboard.Others"),
        balance: Number(latestStats.circulatingSupply) - totalAmount,
      });
      setRichlist(entries);
    });
  }, [latestStats]);

  const option: EChartsOption = {
    title: {
      text: t("dashboard.Qubic Richlist"),
      left: "center",
      textAlign: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    series: [
      {
        name: t("dashboard.Distribution"),
        type: "pie",
        radius: "60%",
        center: ["40%", "50%"],
        data: richlist.map((item) => ({
          value: item.balance,
          name: item.identity,
          percentage: (item.balance * 100) / Number(latestStats.circulatingSupply),
        })),
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

  const chartComponents = [
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    PieChart,
    SVGRenderer,
    LabelLayout,
  ];

  return (
    <Card className="max-w-lg p-4">
      <EChart
        style={{ width: isMobile ? "280px" : "400px", height: isMobile ? "320px" : "400px" }}
        key={settings.darkMode ? "dark" : "light"}
        theme={settings.darkMode ? dark : light}
        use={chartComponents}
        {...option}
      />
    </Card>
  );
};

export default Richlist;
