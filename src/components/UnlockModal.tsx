import { motion, AnimatePresence } from 'framer-motion';
import qubicCoin from '@/assets/qubic-coin.svg';
import { formatQubicAmount } from '@/utils';

interface UnlockModalProps {
  open: boolean;
  unlockInfo?: any;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const UnlockModal: React.FC<UnlockModalProps> = ({ open, onClose, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex justify-center items-center bg-black/50" onClick={onClose}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-w-[440px] bg-gray-80 p-8 rounded-lg shadow-lg flex flex-col gap-3 divide-y divide-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2">
              <div className="flex flex-1 gap-3 justify-between items-center">
                <img src={qubicCoin} alt="Qubic Coin" className="w-9 h-9" />
                <div className="flex flex-1 flex-col">
                  <div className="text-gray-500">Earned Rewards</div>
                  <div className="text-white text-2xl">{formatQubicAmount(100000)}</div>
                </div>
              </div>
              <div onClick={onConfirm} className="flex justify-center items-center cursor-pointer">
                <div className="text-primary-40 px-3">Unlock Early</div>
              </div>
            </div>

            <div className="flex py-2 gap-4">
              <div className="flex flex-1 flex-col">
                <div className="text-gray-500">Locked Balance</div>
                <div className="text-white text-xl">{formatQubicAmount(10442000000)}</div>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="text-gray-500">Earning Ratio</div>
                <div className="text-white text-xl">9.8% APY</div>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="text-gray-500">Unlocks In</div>
                <div className="text-white text-xl">48 Weeks</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnlockModal;
