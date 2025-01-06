import { useAtom } from 'jotai';
import Card from './ui/Card';
import Button from './ui/Button';
import Dropdown from './ui/Dropdown';
import { tickInfoAtom } from '@/store/tickInfo';
import { settingsAtom } from '@/store/settings';
import { useEffect, useState } from 'react';
import { truncateMiddle } from '@/utils';
import { useQubicConnect } from './connect/QubicConnectContext';
import { lockQubic } from '@/services/qearn.service';
import { broadcastTx, fetchBalance } from '@/services/rpc.service';
import { FaLock, FaWallet, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const QearnForm: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const [settings] = useAtom(settingsAtom);
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [accounts, setAccounts] = useState<{ label: string; value: string }[]>([]);
  const { wallet, getSignedTx } = useQubicConnect();

  useEffect(() => {
    if (wallet) {
      setAccounts([{ label: truncateMiddle(wallet.publicKey, 45), value: wallet.publicKey }]);
    }
  }, [wallet]);

  const [formData, setFormData] = useState({
    amount: '',
    targetTick: '',
  });

  useEffect(() => {
    if (tickInfo) {
      const newTargetTick = String(tickInfo.tick + settings.tickOffset);
      if (newTargetTick !== formData.targetTick) {
        setFormData((prev) => ({
          ...prev,
          targetTick: newTargetTick,
        }));
      }
    }
  }, [tickInfo?.tick, settings.tickOffset]);

  const validateForm = async (): Promise<boolean> => {
    if (!formData.amount || !formData.targetTick) {
      toast.error('All fields must be filled');
      return false;
    }

    const amount = Number(formData.amount);
    const targetTick = Number(formData.targetTick);
    const currentTick = tickInfo?.tick || 0;
    const walletBalance = (await fetchBalance(accounts[selectedAccount].value)) || 0;

    if (amount > walletBalance.balance) {
      toast.error('Amount exceeds wallet balance');
      return false;
    }

    if (amount < 10_000_000) {
      toast.error('Amount must be at least 10M');
      return false;
    }

    if (targetTick <= currentTick) {
      toast.error('Target tick must be greater than current tick');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(await validateForm())) {
      return;
    }

    try {
      const tx = await lockQubic(accounts[selectedAccount].value, Number(formData.amount), Number(formData.targetTick));
      // temp build for getting uint8array type of tx because QubicTransaction doesn't return uint8array before it is built
      const tmpTx = await tx?.build('0'.repeat(55))!;
      // 64 is the length of the signature
      const { tx: signedTx } = await getSignedTx(tmpTx, tmpTx.length - 64);

      const res = await broadcastTx(signedTx);
      console.log(await res.json());
    } catch (err) {
      toast.error('Transaction failed');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, amount: e.target.value }));
  };

  return (
    <Card className="max-w-lg p-8 bg-gradient-to-br from-gray-90 to-gray-80">
      <div className="space-y-6">
        <div className="flex items-center justify-center space-x-3">
          <FaLock className="text-3xl text-primary" />
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Qearn</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <FaWallet className="text-gray-400" />
              <span className="text-gray-300">Select Account</span>
            </div>
            <Dropdown label="Select Account" options={accounts} selected={selectedAccount} setSelected={setSelectedAccount} />
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FaLock className="text-gray-400" />
              <label htmlFor="amount" className="text-gray-300">
                Lock Amount
              </label>
            </div>
            <input
              id="amount"
              type="number"
              className="w-full p-4 bg-gray-80 border-2 border-gray-70 text-white rounded-lg placeholder-gray-500 focus:border-primary transition-colors outline-none"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleAmountChange}
            />
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FaClock className="text-gray-400" />
              <label htmlFor="targetTick" className="text-gray-300">
                Target Tick
              </label>
            </div>
            <input
              id="targetTick"
              type="number"
              className="w-full p-4 bg-gray-80 border-2 border-gray-70 text-white rounded-lg placeholder-gray-500 cursor-not-allowed opacity-75"
              placeholder="Enter target tick"
              value={formData.targetTick}
              disabled={true}
            />
          </div>

          <Button
            label="Lock Funds"
            className="w-full py-4 text-lg font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            type="submit"
            primary={true}
            icon={<FaLock className="mr-2" />}
          />
        </form>
      </div>
    </Card>
  );
};

export default QearnForm;
