import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Error404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-90">
      <h1 className="text-7xl font-bold">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <div className="mt-6">
        <Button label="Go back to Home" onClick={() => navigate('/')} />
      </div>
    </div>
  );
};

export default Error404;
