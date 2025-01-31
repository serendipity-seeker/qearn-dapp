import { motion, AnimatePresence } from "framer-motion";
import qubicCoin from "@/assets/qubic-coin.svg";
import { formatQubicAmount } from "@/utils";
import { useAtom } from "jotai";
import { tickInfoAtom } from "@/store/tickInfo";

interface UnlockModalProps {
  open: boolean;
  unlockInfo?: any;
  data?: {
    currentReward: number;
    lockedAmount: number;
    apy: number;
    epoch: number;
  };
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const UnlockModal: React.FC<UnlockModalProps> = ({ open, onClose, onConfirm, data }) => {
  const [tickInfo] = useAtom(tickInfoAtom);

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
            className="flex min-w-[440px] flex-col gap-3 divide-y divide-gray-700 rounded-lg bg-gray-80 p-8 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2">
              <div className="flex flex-1 items-center justify-between gap-3">
                <img src={qubicCoin} alt="Qubic Coin" className="h-9 w-9" />
                <div className="flex flex-1 flex-col">
                  <div className="text-gray-500">Earned Rewards</div>
                  <div className="text-2xl text-white">{formatQubicAmount(data?.currentReward || 0)}</div>
                </div>
              </div>
              <div
                onClick={() => {
                  onConfirm?.();
                  onClose?.();
                }}
                className="flex cursor-pointer items-center justify-center"
              >
                <div className="px-3 text-primary-40">Unlock Early</div>
              </div>
            </div>

            <div className="flex gap-4 py-2">
              <div className="flex flex-1 flex-col">
                <div className="text-gray-500">Locked Balance</div>
                <div className="text-xl text-white">{formatQubicAmount(data?.lockedAmount || 0)}</div>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="text-gray-500">Earning Ratio</div>
                <div className="text-xl text-white">{data?.apy || 0}% APY</div>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="text-gray-500">Unlocks In</div>
                <div className="text-xl text-white">{52 - tickInfo?.epoch + (data?.epoch || 0)} Weeks</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnlockModal;
