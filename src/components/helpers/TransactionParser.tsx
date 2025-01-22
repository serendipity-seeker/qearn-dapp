import { Fragment, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';
import { decodeUint8ArrayTx, generateSeed, uint8ArrayToBase64 } from '@/utils';
import { createTx } from '@/services/tx.service';
import { renderInput, renderOutput } from './common';
import { useAtomValue } from 'jotai';
import { tickInfoAtom } from '@/store/tickInfo';

const qHelper = new QubicHelper();

const initialTxInfo = {
  sourcePublicId: '',
  destinationPublicId: '',
  amount: '',
  tick: 0,
  inputType: 0,
  inputSize: 0,
  payload: '',
  signature: '',
};

export const TransactionParser = () => {
  const [uint8Input, setUint8Input] = useState('');
  const [txInfo, setTxInfo] = useState(initialTxInfo);
  const tickInfo = useAtomValue(tickInfoAtom);

  const generateRandomTx = async () => {
    try {
      const senderSeed = generateSeed();
      const sender = await qHelper.createIdPackage(senderSeed);
      const receiver = await qHelper.createIdPackage(generateSeed());
      const amount = Math.floor(Math.random() * 1000000) + 1;
      const tx = createTx(sender.publicId, receiver.publicId, amount, tickInfo.tick + 5);

      const txUint8 = await tx.build(senderSeed);
      setUint8Input(txUint8.toString());

      toast.success('Random transaction generated and parsed');
    } catch (error) {
      console.error(error);
      toast.error('Error generating random transaction');
    }
  };

  const parseTx = async () => {
    try {
      if (!uint8Input) return toast.error('Please enter a transaction Uint8 Array');

      const uint8Array = new Uint8Array(uint8Input.split(',').map(Number));
      const tx = decodeUint8ArrayTx(uint8Array);

      const sourcePublicId = await qHelper.getIdentity(tx.sourcePublicKey.getPackageData());
      const destinationPublicId = await qHelper.getIdentity(tx.destinationPublicKey.getPackageData());

      setTxInfo({
        sourcePublicId,
        destinationPublicId,
        amount: tx.amount.getNumber().toString(),
        tick: tx.tick,
        inputType: tx.inputType,
        inputSize: tx.inputSize,
        payload: uint8ArrayToBase64(tx.payload.getPackageData()),
        signature: uint8ArrayToBase64(tx.signature.getPackageData()),
      });
    } catch {
      toast.error('Invalid transaction format');
    }
  };

  const cleanStates = () => {
    setUint8Input('');
    setTxInfo(initialTxInfo);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Transaction Parser</h2>
          <Button onClick={cleanStates} className="px-3" label="Clean" />
        </div>

        <div className="space-y-4">
          <Button onClick={generateRandomTx} className="w-full mb-4" variant="primary" label="Generate Random Transaction" />
          {renderInput('Transaction Uint8 Array', uint8Input, setUint8Input, 'Enter transaction Uint8 Array', 3)}
          <Button onClick={parseTx} className="mt-2 w-full" variant="primary" label="Parse Transaction" />

          {Object.entries(txInfo).map(([key, value]) => (
            <Fragment key={key}>
              {renderOutput(key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'), value.toString())}
            </Fragment>
          ))}
        </div>
      </div>
    </Card>
  );
}; 