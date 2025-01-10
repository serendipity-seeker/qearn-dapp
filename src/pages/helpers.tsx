import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';
import { decodeUint8ArrayTx, base64ToUint8Array, uint8ArrayToBase64 } from '@/utils';
import { QubicTransaction } from '@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction';

const qHelper = new QubicHelper();

const Helpers: React.FC = () => {
  const [publicId, setPublicId] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [uint8Input, setUint8Input] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [uint8Output, setUint8Output] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [txInfo, setTxInfo] = useState<{
    sourcePublicKey: string;
    destinationPublicKey: string;
    amount: string;
    tick: number;
    inputType: number;
    inputSize: number;
    payload: string;
    signature: string;
  }>({
    sourcePublicKey: '',
    destinationPublicKey: '',
    amount: '',
    tick: 0,
    inputType: 0,
    inputSize: 0,
    payload: '',
    signature: '',
  });

  const getPublicKeyFromId = async () => {
    try {
      if (!publicId) {
        toast.error('Please enter a Public ID');
        return;
      }
      const idPackage = await qHelper.createIdPackage(publicId);
      setPublicKey(uint8ArrayToBase64(idPackage.publicKey));
    } catch (error) {
      toast.error('Invalid Public ID format');
    }
  };

  const getPublicIdFromKey = async () => {
    try {
      if (!publicKey) {
        toast.error('Please enter a Public Key');
        return;
      }
      const pubKeyBytes = base64ToUint8Array(publicKey);
      const id = await qHelper.getIdentity(pubKeyBytes);
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

  const parseTx = () => {
    try {
      if (!uint8Input) {
        toast.error('Please enter a transaction Uint8 Array');
        return;
      }
      const uint8Array = new Uint8Array(uint8Input.split(',').map(Number));
      const tx = decodeUint8ArrayTx(uint8Array);

      setTxInfo({
        sourcePublicKey: uint8ArrayToBase64(tx.sourcePublicKey.getPackageData()),
        destinationPublicKey: uint8ArrayToBase64(tx.destinationPublicKey.getPackageData()),
        amount: tx.amount.toString(),
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">QHelpers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Public ID ↔ Key</h2>

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
                  <p className="font-mono">{publicKey}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Public Key</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary"
                  placeholder="Enter Public Key"
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
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
            <h2 className="text-2xl font-semibold text-center">Uint8 ↔ Base64</h2>

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
            <h2 className="text-2xl font-semibold text-center">Transaction Parser</h2>

            <div className="space-y-4">
              <div>
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
                  <p className="font-mono">{txInfo.sourcePublicKey}</p>
                  <p className="text-sm text-gray-400 mt-2">Destination Public Key:</p>
                  <p className="font-mono">{txInfo.destinationPublicKey}</p>
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
