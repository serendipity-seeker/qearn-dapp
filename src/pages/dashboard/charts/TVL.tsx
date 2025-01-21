import { EChart } from '@kbox-labs/react-echarts';
import Card from '@/components/ui/Card';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts';
import { useAtom } from 'jotai';
import { qearnStatsAtom } from '@/store/qearnStat';

const TVL: React.FC = () => {
  const [qearnStats] = useAtom(qearnStatsAtom);
  const data =
    Object.keys(qearnStats).map((epoch) => {
      if (!Number(epoch)) return;
      return {
        value: qearnStats[Number(epoch)]?.currentLockedAmount || 0,
        name: `EP${epoch}`,
      };
    }) || [];

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
        data: data,
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

  return (
    <Card className="min-w-md p-4">
      <EChart
        style={{
          height: '400px',
        }}
        use={[TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout]}
        {...option}
      />
    </Card>
  );
};

export default TVL;
