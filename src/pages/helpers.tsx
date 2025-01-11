import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';
import { decodeUint8ArrayTx, base64ToUint8Array, uint8ArrayToBase64, generateSeed } from '@/utils';
import { QubicTransaction } from '@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction';
import { createTx } from '@/services/tx.service';
import { useAtomValue } from 'jotai';
import { tickInfoAtom } from '@/store/tickInfo';

const qHelper = new QubicHelper();

const Helpers: React.FC = () => {
  const [publicId, setPublicId] = useState('');
  const [publicKey, setPublicKey] = useState<Uint8Array>(new Uint8Array());
  const [uint8Input, setUint8Input] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [uint8Output, setUint8Output] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [txInfo, setTxInfo] = useState<{
    sourcePublicId: string;
    destinationPublicId: string;
    amount: string;
    tick: number;
    inputType: number;
    inputSize: number;
    payload: string;
    signature: string;
  }>({
    sourcePublicId: '',
    destinationPublicId: '',
    amount: '',
    tick: 0,
    inputType: 0,
    inputSize: 0,
    payload: '',
    signature: '',
  });

  const tickInfo = useAtomValue(tickInfoAtom);

  const getPublicKeyFromId = async () => {
    try {
      if (!publicId) {
        toast.error('Please enter a Public ID');
        return;
      }
      const idPackage = await qHelper.createIdPackage(publicId);
      if (idPackage.publicKey.length !== 32) {
        toast.error('Invalid public key length - must be 32 bytes');
        return;
      }
      setPublicKey(idPackage.publicKey);
    } catch (error) {
      toast.error('Invalid Public ID format');
    }
  };

  const getPublicIdFromKey = async () => {
    try {
      if (!publicKey.length) {
        toast.error('Please enter a Public Key');
        return;
      }
      if (publicKey.length !== 32) {
        toast.error('Invalid public key length - must be 32 bytes');
        return;
      }
      const id = await qHelper.getIdentity(publicKey);
      setPublicId(id);
    } catch (error) {
      toast.error('Invalid Public Key format');
    }
  };

  const convertToBase64 = () => {
    try {
      if (!uint8Input) {
        toast.error('Please enter a Uint8 Array');
        return;
      }
      const uint8Array = new Uint8Array(uint8Input.split(',').map(Number));
      const base64 = uint8ArrayToBase64(uint8Array);
      setBase64Output(base64);
    } catch (error) {
      toast.error('Invalid Uint8 Array format');
    }
  };

  const convertToUint8 = () => {
    try {
      if (!base64Input) {
        toast.error('Please enter a Base64 string');
        return;
      }
      const uint8Array = base64ToUint8Array(base64Input);
      setUint8Output(uint8Array.toString());
    } catch (error) {
      toast.error('Invalid Base64 format');
    }
  };

  const parseTx = async () => {
    try {
      if (!uint8Input) {
        toast.error('Please enter a transaction Uint8 Array');
        return;
      }
      const uint8Array = new Uint8Array(uint8Input.split(',').map(Number));
      const tx = decodeUint8ArrayTx(uint8Array);

      const sourcePublicId = await qHelper.getIdentity(tx.sourcePublicKey.getPackageData());
      const destinationPublicId = await qHelper.getIdentity(tx.destinationPublicKey.getPackageData());

      if (sourcePublicId.length !== 60 || destinationPublicId.length !== 60) {
        toast.error('Invalid public key length in transaction - must be 60 characters');
        return;
      }

      setTxInfo({
        sourcePublicId: sourcePublicId,
        destinationPublicId: destinationPublicId,
        amount: tx.amount.getNumber().toString(),
        tick: tx.tick,
        inputType: tx.inputType,
        inputSize: tx.inputSize,
        payload: uint8ArrayToBase64(tx.payload.getPackageData()),
        signature: uint8ArrayToBase64(tx.signature.getPackageData()),
      });
    } catch (error) {
      toast.error('Invalid transaction format');
    }
  };

  const generateRandomTx = async () => {
    try {
      const senderSeed = generateSeed();
      const sender = await qHelper.createIdPackage(senderSeed);
      const receiver = await qHelper.createIdPackage(generateSeed());
      const amount = Math.floor(Math.random() * 1000000) + 1;
      const currentTick = tickInfo.tick;
      const tx = createTx(sender.publicId, receiver.publicId, amount, currentTick + 5);

      const txUint8 = await tx.build(senderSeed);
      setUint8Input(txUint8.toString());

      toast.success('Random transaction generated and parsed');
    } catch (error) {
      console.log(error);
      toast.error('Error generating random transaction');
    }
  };

  const cleanPublicIdKey = () => {
    setPublicId('');
    setPublicKey(new Uint8Array());
  };

  const cleanUint8Base64 = () => {
    setUint8Input('');
    setBase64Input('');
    setUint8Output('');
    setBase64Output('');
  };

  const cleanTxParser = () => {
    setUint8Input('');
    setTxInfo({
      sourcePublicId: '',
      destinationPublicId: '',
      amount: '',
      tick: 0,
      inputType: 0,
      inputSize: 0,
      payload: '',
      signature: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">QHelpers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Public ID ↔ Key</h2>
              <Button onClick={cleanPublicIdKey} className="px-3" label="Clean" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Public ID</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary"
                  placeholder="Enter Public ID"
                  value={publicId}
                  onChange={(e) => setPublicId(e.target.value)}
                />
                <Button onClick={getPublicKeyFromId} className="mt-2 w-full" primary label="Get Public Key" />
                <div className="mt-2 p-3 bg-gray-800 rounded-lg break-all">
                  <p className="text-sm text-gray-400">Output:</p>
                  <p className="font-mono">{publicKey.toString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Public Key</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary"
                  placeholder="Enter Public Key"
                  value={publicKey.toString()}
                  onChange={(e) => {
                    try {
                      setPublicKey(base64ToUint8Array(e.target.value));
                    } catch (error) {
                      // Handle invalid base64 input silently
                    }
                  }}
                />
                <Button onClick={getPublicIdFromKey} className="mt-2 w-full" primary label="Get Public ID" />
                <div className="mt-2 p-3 bg-gray-800 rounded-lg break-all">
                  <p className="text-sm text-gray-400">Output:</p>
                  <p className="font-mono">{publicId}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Uint8 ↔ Base64</h2>
              <Button onClick={cleanUint8Base64} className="px-3" label="Clean" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Uint8 Array</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary"
                  placeholder="Enter comma-separated Uint8 Array"
                  value={uint8Input}
                  onChange={(e) => setUint8Input(e.target.value)}
                  rows={3}
                />
                <Button onClick={convertToBase64} className="mt-2 w-full" primary label="Convert to Base64" />
                <div className="mt-2 p-3 bg-gray-800 rounded-lg break-all">
                  <p className="text-sm text-gray-400">Output:</p>
                  <p className="font-mono">{base64Output}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Base64</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary"
                  placeholder="Enter Base64 string"
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  rows={3}
                />
                <Button onClick={convertToUint8} className="mt-2 w-full" primary label="Convert to Uint8" />
                <div className="mt-2 p-3 bg-gray-800 rounded-lg break-all">
                  <p className="text-sm text-gray-400">Output:</p>
                  <p className="font-mono">{uint8Output}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Transaction Parser</h2>
              <Button onClick={cleanTxParser} className="px-3" label="Clean" />
            </div>

            <div className="space-y-4">
              <div>
                <Button onClick={generateRandomTx} className="w-full mb-4" primary label="Generate Random Transaction" />

                <label className="block text-sm font-medium mb-2">Transaction Uint8 Array</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary"
                  placeholder="Enter transaction Uint8 Array"
                  value={uint8Input}
                  onChange={(e) => setUint8Input(e.target.value)}
                  rows={3}
                />
                <Button onClick={parseTx} className="mt-2 w-full" primary label="Parse Transaction" />
                <div className="mt-2 p-3 bg-gray-800 rounded-lg break-all">
                  <p className="text-sm text-gray-400">Source Public Key:</p>
                  <p className="font-mono">{txInfo.sourcePublicId}</p>
                  <p className="text-sm text-gray-400 mt-2">Destination Public Key:</p>
                  <p className="font-mono">{txInfo.destinationPublicId}</p>
                  <p className="text-sm text-gray-400 mt-2">Amount:</p>
                  <p className="font-mono">{txInfo.amount}</p>
                  <p className="text-sm text-gray-400 mt-2">Tick:</p>
                  <p className="font-mono">{txInfo.tick}</p>
                  <p className="text-sm text-gray-400 mt-2">Input Type:</p>
                  <p className="font-mono">{txInfo.inputType}</p>
                  <p className="text-sm text-gray-400 mt-2">Input Size:</p>
                  <p className="font-mono">{txInfo.inputSize}</p>
                  <p className="text-sm text-gray-400 mt-2">Payload:</p>
                  <p className="font-mono">{txInfo.payload}</p>
                  <p className="text-sm text-gray-400 mt-2">Signature:</p>
                  <p className="font-mono">{txInfo.signature}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Helpers;
