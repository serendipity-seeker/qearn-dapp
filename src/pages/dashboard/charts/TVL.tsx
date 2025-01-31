import { EChart } from '@kbox-labs/react-echarts';
import Card from '@/components/ui/Card';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts';
import { useAtom } from 'jotai';
import { qearnStatsAtom } from '@/store/qearnStat';
import { dark, light } from '@/data/chart-theme';
import { settingsAtom } from '@/store/settings';

const TVL: React.FC = () => {
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [settings] = useAtom(settingsAtom);

  const data = Object.entries(qearnStats)
    .filter(([epoch]) => Number(epoch))
    .map(([epoch, stats]) => ({
      value: stats?.currentLockedAmount || 0,
      name: `EP${epoch}`,
    }));

  const option: EChartsOption = {
    title: {
      text: 'Total Locked $QUBIC',
      subtext: 'Locked Amounts per Epoch',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
    },
    series: [
      {
        name: 'Locked Amounts',
        type: 'pie',
        radius: '50%',
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const chartComponents = [TitleComponent, TooltipComponent, LegendComponent, PieChart, SVGRenderer, LabelLayout];

  return (
    <Card className="max-w-lg p-4">
      <EChart style={{ width: '400px', height: '400px' }} key={settings.darkMode ? 'dark' : 'light'} theme={settings.darkMode ? dark : light} use={chartComponents} {...option} />
    </Card>
  );
};

export default TVL;
