import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LockHistoryTable from "@/components/LockHistoryTable";
import QearnForm from "@/components/QearnForm";

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
    <div className="mx-auto flex w-full max-w-6xl justify-center px-4">
      <div>
        <div className="relative mb-4 flex gap-3">
          <div
            ref={tabRefs[0]}
            onClick={() => setActiveTab(0)}
            className={`cursor-pointer px-2 py-1 font-medium text-foreground hover:text-primary-30 ${activeTab === 0 ? "text-foreground" : ""}`}
          >
            Locking
          </div>
          <div
            ref={tabRefs[1]}
            onClick={() => setActiveTab(1)}
            className={`cursor-pointer px-2 py-1 font-medium text-foreground hover:text-primary-30 ${activeTab === 1 ? "text-foreground" : ""}`}
          >
            Locking History
          </div>
          <motion.div
            className="absolute bottom-0 h-0.5 bg-foreground"
            animate={{
              left: tabUnderlineLeft,
              width: tabUnderlineWidth,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 0 && <QearnForm />}
            {activeTab === 1 && <LockHistoryTable />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
