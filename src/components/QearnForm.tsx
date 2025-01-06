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
import { broadcastTx } from '@/services/rpc.service';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isAmountValid = formData.amount !== '';
    const isTargetTickValid = formData.targetTick !== '';

    if (isAmountValid && isTargetTickValid) {
      const tx = await lockQubic(accounts[selectedAccount].value, Number(formData.amount), Number(formData.targetTick));
      // temp build for getting uint8array type of tx because QubicTransaction doesn't return uint8array before it is built
      const tmpTx = await tx?.build('0'.repeat(55))!;
      // 64 is the length of the signature
      const { tx: signedTx } = await getSignedTx(tmpTx, tmpTx.length - 64);

      const res = await broadcastTx(signedTx);
      console.log(await res.json());
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, amount: e.target.value }));
  };

  return (
    <Card className="max-w-lg p-6">
      <div className="space-y-4">
        <h1 className="text-3xl text-center">Qearn</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Dropdown label="Select Account" options={accounts} selected={selectedAccount} setSelected={setSelectedAccount} />
          </div>

          <div>
            <label htmlFor="amount" className="block text-white mb-2">
              Lock Amount
            </label>
            <input
              id="amount"
              type="number"
              className="w-full p-4 bg-gray-80 border border-gray-70 text-white rounded-lg placeholder-gray-500"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleAmountChange}
            />
          </div>

          <div>
            <label htmlFor="targetTick" className="block text-white mb-2">
              Target Tick
            </label>
            <input
              id="targetTick"
              type="number"
              className="w-full p-4 bg-gray-80 border border-gray-70 text-white rounded-lg placeholder-gray-500"
              placeholder="Enter target tick"
              value={formData.targetTick}
              disabled={true}
            />
          </div>

          <Button label="Lock" className="w-full" type="submit" primary={true} />
        </form>
      </div>
    </Card>
  );
};

export default QearnForm;
