import TVL from './charts/TVL';
import QearnSummarize from './charts/QearnSummarize';
import BonusAmountAnalyzer from './charts/BonusAmountAnalyzer';

const Dashboard: React.FC = () => {
  return (
    <div className="flex gap-4 flex-wrap">
      <QearnSummarize />
      <TVL />
      <BonusAmountAnalyzer />
    </div>
  );
};

export default Dashboard;
