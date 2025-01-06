import { useEffect, useMemo } from 'react';
import { getLockInfoPerEpoch, getUserLockInfo, getStateOfRound, getUserLockStatus, getEndedStatus } from '@/services/qearn.service';
import { PublicKey } from '@qubic-lib/qubic-ts-library/dist/qubic-types/PublicKey';
import LockStatCard from '@/components/LockStatCard';
import { tickInfoAtom } from '@/store/tickInfo';
import { useAtom } from 'jotai';

const Dashboard: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const currentEpoch = useMemo(() => tickInfo?.epoch || 142, [tickInfo?.epoch]);

  const testAPIs = async () => {
    const lockInfo = await getLockInfoPerEpoch(140);
    const userLockInfo = await getUserLockInfo(new PublicKey('TLEIBEQEXQKJLBQXENQJZLKEZIGAKLVXYSTVDHYEAHRPFJPLFWROUWGBJNIB').getPackageData(), 140);
    const stateOfRound = await getStateOfRound(140);
    const userLockStatus = await getUserLockStatus(new PublicKey('TLEIBEQEXQKJLBQXENQJZLKEZIGAKLVXYSTVDHYEAHRPFJPLFWROUWGBJNIB').getPackageData(), 140);
    const endedStatus = await getEndedStatus(new PublicKey('TLEIBEQEXQKJLBQXENQJZLKEZIGAKLVXYSTVDHYEAHRPFJPLFWROUWGBJNIB').getPackageData());
    console.log('Lock Info', lockInfo);
    console.log('User Lock Info', userLockInfo);
    console.log('State Of Round', stateOfRound);
    console.log('User Lock Status', userLockStatus);
    console.log('Ended Status', endedStatus);
  };

  useEffect(() => {
    testAPIs();
  }, []);
  return (
    <div>
      <LockStatCard currentEpoch={currentEpoch} />
    </div>
  );
};

export default Dashboard;
