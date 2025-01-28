import { EChart } from '@kbox-labs/react-echarts';
import Card from '@/components/ui/Card';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts';
import { useAtom } from 'jotai';
import { custom } from '@/data/chart-theme';
import { getBurnedAndBoostedStats } from '@/services/qearn.service';
import { tickInfoAtom } from '@/store/tickInfo';
import { IBurnNBoostedStats } from '@/types';
import { useState, useMemo, useEffect } from 'react';

const BonusAmountAnalyzer: React.FC = () => {
  const [burnNBoostedStats, setBurnNBoostedStats] = useState<IBurnNBoostedStats>({} as IBurnNBoostedStats);
  const [tickInfo] = useAtom(tickInfoAtom);
  const currentEpoch = useMemo(() => tickInfo?.epoch || 142, [tickInfo?.epoch]);

  useEffect(() => {
    getBurnedAndBoostedStats().then(setBurnNBoostedStats);
  }, [currentEpoch]);

  const option: EChartsOption = {
    title: {
      text: 'Bonus Distribution',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'horizontal',
      bottom: '0',
    },
    series: [
      {
        name: 'Bonus Distribution',
        type: 'pie',
        radius: '50%',
        data: [
          { value: burnNBoostedStats?.boostedAmount || 0, name: 'Boosted Bonus' },
          { value: burnNBoostedStats?.burnedAmount || 0, name: 'Burned Bonus' },
          { value: burnNBoostedStats?.rewardedAmount || 0, name: 'Rewarded Bonus' },
        ],
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
      <EChart style={{ width: '400px', height: '400px' }} theme={custom} use={chartComponents} {...option} />
    </Card>
  );
};

export default BonusAmountAnalyzer;
