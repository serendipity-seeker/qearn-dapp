import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { renderInput } from "./helpers/common";
import Button from "./ui/Button";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface UnlockAmountSettingModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  maxAmount: number;
}

const UnlockAmountSettingModal: React.FC<UnlockAmountSettingModalProps> = ({ open, onClose, onConfirm, maxAmount }) => {
  const [amount, setAmount] = useState("");
  const { t } = useTranslation();

  const handleConfirm = () => {
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error(t("modal.Invalid amount"));
      return;
    }
    if (parsedAmount < 10000000) {
      toast.error(t("modal.Unlock amount is less than the minimum amount"));
      return;
    }
    if (parsedAmount > maxAmount) {
      toast.error(t("modal.Unlock amount is greater than the locked amount"));
      return;
    }
    onConfirm(parsedAmount);
    onClose();
  };

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
            className="flex w-full max-w-md flex-col gap-4 rounded-lg bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold">{t("modal.Set Unlock Amount")}</h2>

            {renderInput(t("modal.Amount"), amount, (value) => setAmount(value), t("modal.Enter amount to unlock"))}

            <div className="flex justify-end gap-2">
              <Button onClick={onClose} label={t("modal.Cancel")} />
              <Button onClick={handleConfirm} variant="primary" label={t("modal.Confirm")} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnlockAmountSettingModal;
