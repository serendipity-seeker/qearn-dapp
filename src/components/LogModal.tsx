import { logAtom } from "@/store/log";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegClock, FaTags, FaArrowRight, FaArrowLeft, FaDollarSign, FaInfoCircle } from "react-icons/fa";
import useLogModal from "@/hooks/useLogModal";
import Button from "@/components/ui/Button";
import { truncateMiddle } from "@/utils";

const LogModal: React.FC = () => {
  const [logData] = useAtom(logAtom);
  const { t } = useTranslation();
  const { closeModal } = useLogModal();

  console.log("logData", logData);

  if (logData.length === 0 || !logData) return null;


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-4 rounded-lg bg-background p-6 shadow-lg w-[400px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-foreground">{t("modal.Transaction Log")}</h2>
            <IoClose onClick={closeModal} className="cursor-pointer text-2xl text-foreground" />
          </div>

          {logData.length > 0 ? (
            <div className="custom-scrollbar max-h-[65vh] overflow-y-auto pr-2">
              {logData.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-4 rounded-xl p-5"
                >
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
                    <FaRegClock className="text-primary mt-1 text-lg" />
                    <div>
                      <span className="text-sm font-medium text-gray-400">{t("modal.Tick")}</span>
                      <a
                        href={`https://explorer.qubic.org/network/tick/${log.tick}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-primary-40 hover:underline"
                      >
                        {log.tick}
                      </a>
                    </div>

                    <FaTags className="text-primary mt-1 text-lg" />
                    <div>
                      <span className="text-sm font-medium text-gray-400">{t("modal.Type")}</span>
                      <p className="ml-2 inline text-foreground">{log.type}</p>
                    </div>

                    <FaArrowRight className="text-primary mt-1 text-lg" />
                    <div>
                      <span className="text-sm font-medium text-gray-400">{t("modal.Source")}</span>
                      <a
                        href={`https://explorer.qubic.org/network/address/${log.sourceId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-primary-40 hover:underline"
                      >
                        {truncateMiddle(log.sourceId, 36)}
                      </a>
                    </div>

                    <FaArrowLeft className="text-primary mt-1 text-lg" />
                    <div>
                      <span className="text-sm font-medium text-gray-400">{t("modal.Destination")}</span>
                      <a
                        href={`https://explorer.qubic.org/network/address/${log.destinationId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-primary-40 hover:underline"
                      >
                        {truncateMiddle(log.destinationId, 36)}
                      </a>
                    </div>

                    <FaDollarSign className="text-primary mt-1 text-lg" />
                    <div>
                      <span className="text-sm font-medium text-gray-400">{t("modal.Amount")}</span>
                      <p className="ml-2 inline font-semibold text-foreground">{log.amount}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-16 text-center text-gray-400">
              <FaInfoCircle className="mb-4 animate-pulse text-5xl text-gray-300" />
              <p className="text-lg">{t("modal.NoLogs")}</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={closeModal}
              variant="primary"
              label={t("modal.Confirm")}
              className="shadow-primary/20 hover:shadow-primary/30 transition-all hover:shadow-xl active:scale-95"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LogModal;
