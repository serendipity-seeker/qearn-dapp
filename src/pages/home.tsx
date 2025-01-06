import AccountInfo from '@/components/AccountInfo';
import QearnForm from '@/components/QearnForm';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 justify-center">
      <QearnForm />
      <AccountInfo />
    </div>
  );
};

export default Home;
