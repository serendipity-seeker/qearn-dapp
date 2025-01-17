import { useState } from 'react';
import LockHistoryTable from '@/components/LockHistoryTable';
import QearnForm from '@/components/QearnForm';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex space-x-8 mb-4">
        <div
          onClick={() => setActiveTab(0)}
          className={`px-2 py-1 font-medium text-gray-400 hover:text-white cursor-pointer
              ${activeTab === 0 ? 'text-white' : ''}`}
        >
          Lock
        </div>
        <div
          onClick={() => setActiveTab(1)}
          className={`px-2 py-1 font-medium text-gray-400 hover:text-white cursor-pointer
              ${activeTab === 1 ? 'text-white' : ''}`}
        >
          History
        </div>
      </div>
      <div>
        {activeTab === 0 && (
          <div className="flex justify-center">
            <QearnForm />
          </div>
        )}
        {activeTab === 1 && (
          <div className="flex justify-center">
            <LockHistoryTable />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
