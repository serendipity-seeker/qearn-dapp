import { useAtom } from 'jotai';
import { tickInfoAtom } from '@/store/tickInfo';

const TickInfoLabel: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);

  return <div>Tick:{tickInfo.tick}</div>;
};

export default TickInfoLabel;
