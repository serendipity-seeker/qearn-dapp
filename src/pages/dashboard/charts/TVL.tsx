import { EChart } from '@kbox-labs/react-echarts';
import Card from '@/components/ui/Card';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts';
import { useAtom } from 'jotai';
import { qearnStatsAtom } from '@/store/qearnStat';
import { custom } from '@/data/chart-theme';

const TVL: React.FC = () => {
  const [qearnStats] = useAtom(qearnStatsAtom);

  const data = Object.entries(qearnStats)
    .filter(([epoch]) => Number(epoch))
    .map(([epoch, stats]) => ({
      value: stats?.currentLockedAmount || 0,
      name: `EP${epoch}`,
    }));

  const option: EChartsOption = {
    title: {
      text: 'TVL',
      subtext: 'Locked Amounts per Epoch',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
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
    <Card className="min-w-md p-4">
      <EChart style={{ height: '400px' }} theme={custom} use={chartComponents} {...option} />
    </Card>
  );
};

export default TVL;
