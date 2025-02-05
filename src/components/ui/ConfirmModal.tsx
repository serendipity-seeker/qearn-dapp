import Button from "./Button";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string | React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, onClose, onConfirm, title, description, onCancel }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 rounded-lg bg-background p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-foreground">{title}</h2>
                <IoClose onClick={onClose} className="cursor-pointer text-2xl text-foreground" />
              </div>
              <div className="text-gray-400">{description}</div>
            </div>

            <div className="flex gap-4 py-2">
              <Button
                className="w-1/2"
                onClick={() => {
                  onCancel?.();
                  onClose?.();
                }}
                label={t("modal.Cancel")}
              />
              <Button
                className="w-1/2"
                variant="primary"
                onClick={() => {
                  onConfirm?.();
                  onClose?.();
                }}
                label={t("modal.Confirm")}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
