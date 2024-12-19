import Card from '@/components/ui/Card';
import { useEffect, useRef } from 'react';
import { useFetchTickInfo } from '@/hooks/useFetchTickInfo';

const Home: React.FC = () => {
  const { data: tickInfo, refetch } = useFetchTickInfo();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      refetch();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetch]);

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
