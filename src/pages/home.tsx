import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LockHistoryTable from '@/components/LockHistoryTable';
import QearnForm from '@/components/QearnForm';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  useEffect(() => {
    const activeTabElement = tabRefs[activeTab].current;
    if (activeTabElement) {
      setTabUnderlineLeft(activeTabElement.offsetLeft);
      setTabUnderlineWidth(activeTabElement.offsetWidth);
    }
  }, [activeTab]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex gap-3 mb-4 relative">
        <div
          ref={tabRefs[0]}
          onClick={() => setActiveTab(0)}
          className={`px-2 py-1 font-medium text-gray-400 hover:text-white cursor-pointer
              ${activeTab === 0 ? 'text-white' : ''}`}
        >
          Locking
        </div>
        <div
          ref={tabRefs[1]}
          onClick={() => setActiveTab(1)}
          className={`px-2 py-1 font-medium text-gray-400 hover:text-white cursor-pointer
              ${activeTab === 1 ? 'text-white' : ''}`}
        >
          Locking History
        </div>
        <motion.div
          className="absolute bottom-0 h-0.5 bg-white"
          animate={{
            left: tabUnderlineLeft,
            width: tabUnderlineWidth,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Home;
