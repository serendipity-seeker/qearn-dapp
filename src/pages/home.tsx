import { useQubicConnect } from '@/components/connect/QubicConnectContext';
import Card from '@/components/ui/Card';
import { useEffect } from 'react';
import { TickInfo } from '@/types';
import { useState } from 'react';

const Home: React.FC = () => {
  const { getTickInfo } = useQubicConnect();
  const [tickInfo, setTickInfo] = useState<TickInfo | null>(null);

  useEffect(() => {
    const fetchTickInfo = async () => {
      const tickInfo = await getTickInfo();
      setTickInfo(tickInfo);
    };
    fetchTickInfo();
  }, [getTickInfo]);

  return (
    <div className="p-4">
      <Card className="max-w-lg mx-auto p-6">
        <div className="space-y-4">
          <h1 className="text-3xl text-center ">Tick Information</h1>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Current Tick</p>
              <p className="text-2xl font-semibold">{tickInfo?.tick || '-'}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-2xl font-semibold">{tickInfo?.duration}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Epoch</p>
              <p className="text-2xl font-semibold">{tickInfo?.epoch || '-'}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Initial Tick</p>
              <p className="text-2xl font-semibold">{tickInfo?.initialTick || '-'}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Home;
