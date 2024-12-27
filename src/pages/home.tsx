import QearnForm from '@/components/QearnForm';
import TickInfoCard from '@/components/TickInfoCard';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <TickInfoCard />
      <QearnForm />
    </div>
  );
};

export default Home;
