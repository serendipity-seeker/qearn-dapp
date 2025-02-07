import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LockHistoryTable from "@/pages/home/tabs/LockHistoryTable";
import QearnForm from "@/pages/home/tabs/QearnForm";
import { useTranslation } from "react-i18next";
import TransferForm from "./tabs/TransferForm";
import { useAtom } from "jotai";
import { settingsAtom } from "@/store/settings";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const [settings] = useAtom(settingsAtom);
  const tabRefs = Array(settings.showTransferForm ? 3 : 2)
    .fill(null)
    .map(() => useRef<HTMLDivElement>(null));
  const { t } = useTranslation();

  useEffect(() => {
    const activeTabElement = tabRefs[activeTab].current;
    if (activeTabElement) {
      setTabUnderlineLeft(activeTabElement.offsetLeft);
      setTabUnderlineWidth(activeTabElement.offsetWidth);
    }
  }, [activeTab]);

  return (
    <div className={`mx-auto ${activeTab === 1 ? "w-full md:max-w-6xl" : ""}`}>
      <div className="relative mx-auto mb-4">
        <div className="pb-1">
          <span
            ref={tabRefs[0]}
            onClick={() => setActiveTab(0)}
            className={`cursor-pointer px-2 py-1 font-medium text-foreground hover:text-primary-40 ${activeTab === 0 ? "text-foreground" : ""}`}
          >
            {t("home.Locking")}
          </span>
          <span
            ref={tabRefs[1]}
            onClick={() => setActiveTab(1)}
            className={`cursor-pointer px-2 py-1 font-medium text-foreground hover:text-primary-40 ${activeTab === 1 ? "text-foreground" : ""}`}
          >
            {t("home.Locking History")}
          </span>
          {settings.showTransferForm && (
            <span
              ref={tabRefs[2]}
              onClick={() => setActiveTab(2)}
              className={`cursor-pointer px-2 py-1 font-medium text-foreground hover:text-primary-40 ${activeTab === 2 ? "text-foreground" : ""}`}
            >
              {t("home.Transfer")}
            </span>
          )}
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
          {activeTab === 2 && <TransferForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Home;
