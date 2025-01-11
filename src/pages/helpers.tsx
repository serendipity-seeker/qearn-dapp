import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';
import { decodeUint8ArrayTx, base64ToUint8Array, uint8ArrayToBase64, generateSeed } from '@/utils';
import { createTx } from '@/services/tx.service';
import { useAtomValue } from 'jotai';
import { tickInfoAtom } from '@/store/tickInfo';
import { useQubicConnect } from '@/components/connect/QubicConnectContext';
import { broadcastTx } from '@/services/rpc.service';

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

const initialTxForm = {
  sourceId: '',
  destinationId: '',
  amount: '',
  tick: '',
  inputType: '',
  inputSize: '',
  payload: '',
};

const Helpers: React.FC = () => {
  const [publicId, setPublicId] = useState('');
  const [publicKey, setPublicKey] = useState<Uint8Array>(new Uint8Array());
  const [uint8Input, setUint8Input] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [uint8Output, setUint8Output] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [txInfo, setTxInfo] = useState(initialTxInfo);
  const [txForm, setTxForm] = useState(initialTxForm);

  const tickInfo = useAtomValue(tickInfoAtom);
  const { getSignedTx } = useQubicConnect();

  const handleError = (message: string) => {
    toast.error(message);
    return;
  };

  const validatePublicKey = (key: Uint8Array | string) => {
    if (typeof key === 'string' && key.length !== 60) {
      return false;
    }
    if (key instanceof Uint8Array && key.length !== 32) {
      return false;
    }
    return true;
  };

  const getPublicKeyFromId = async () => {
    try {
      if (!publicId) return handleError('Please enter a Public ID');

      const idPackage = await qHelper.createIdPackage(publicId);
      if (!validatePublicKey(idPackage.publicKey)) {
        return handleError('Invalid public key length - must be 32 bytes');
      }
      setPublicKey(idPackage.publicKey);
    } catch {
      handleError('Invalid Public ID format');
    }
  };

  const getPublicIdFromKey = async () => {
    try {
      if (!publicKey.length) return handleError('Please enter a Public Key');
      if (!validatePublicKey(publicKey)) {
        return handleError('Invalid public key length - must be 32 bytes');
      }
      const id = await qHelper.getIdentity(publicKey);
      setPublicId(id);
    } catch {
      handleError('Invalid Public Key format');
    }
  };

  const handleConversion = async (type: 'toBase64' | 'toUint8') => {
    try {
      if (type === 'toBase64') {
        if (!uint8Input) return handleError('Please enter a Uint8 Array');
        const uint8Array = new Uint8Array(uint8Input.split(',').map(Number));
        setBase64Output(uint8ArrayToBase64(uint8Array));
      } else {
        if (!base64Input) return handleError('Please enter a Base64 string');
        const uint8Array = base64ToUint8Array(base64Input);
        setUint8Output(uint8Array.toString());
      }
    } catch {
      handleError(`Invalid ${type === 'toBase64' ? 'Uint8 Array' : 'Base64'} format`);
    }
  };

  const parseTx = async () => {
    try {
      if (!uint8Input) return handleError('Please enter a transaction Uint8 Array');

      const uint8Array = new Uint8Array(uint8Input.split(',').map(Number));
      const tx = decodeUint8ArrayTx(uint8Array);

      const sourcePublicId = await qHelper.getIdentity(tx.sourcePublicKey.getPackageData());
      const destinationPublicId = await qHelper.getIdentity(tx.destinationPublicKey.getPackageData());

      if (!validatePublicKey(sourcePublicId) || !validatePublicKey(destinationPublicId)) {
        return handleError('Invalid public key length in transaction - must be 60 characters');
      }

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
      handleError('Invalid transaction format');
    }
  };

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
      handleError('Error generating random transaction');
    }
  };

  const handleCreateTx = async () => {
    try {
      if (!txForm.sourceId || !txForm.destinationId || !txForm.amount || !txForm.tick) {
        return handleError('Please fill in required fields');
      }

      const tx = createTx(txForm.sourceId, txForm.destinationId, Number(txForm.amount), Number(txForm.tick));

      if (txForm.inputType) {
        tx.setInputType(Number(txForm.inputType));
      }
      if (txForm.inputSize) {
        tx.setInputSize(Number(txForm.inputSize));
      }
      if (txForm.payload) {
        const payloadBytes = base64ToUint8Array(txForm.payload);
        tx.setPayload(payloadBytes);
      }

      const { tx: signedTx } = await getSignedTx(tx);
      const res = await broadcastTx(signedTx);

      toast.success('Transaction sent successfully! ID: ' + res.transactionId);
    } catch (error) {
      console.error(error);
      handleError('Error creating transaction');
    }
  };

  const cleanStates = {
    publicIdKey: () => {
      setPublicId('');
      setPublicKey(new Uint8Array());
    },
    uint8Base64: () => {
      setUint8Input('');
      setBase64Input('');
      setUint8Output('');
      setBase64Output('');
    },
    txParser: () => {
      setUint8Input('');
      setTxInfo(initialTxInfo);
    },
    txCreator: () => {
      setTxForm(initialTxForm);
    },
  };

  const renderInput = (label: string, value: string, onChange: (value: string) => void, placeholder: string, rows = 1) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {rows > 1 ? (
        <textarea
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );

  const renderOutput = (label: string, value: string) => (
    <div className="mt-2 p-3 bg-gray-800 rounded-lg break-all">
      <p className="text-sm text-gray-400">{label}:</p>
      <p className="font-mono">{value}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">QHelpers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Public ID ↔ Key</h2>
              <Button onClick={cleanStates.publicIdKey} className="px-3" label="Clean" />
            </div>

            <div className="space-y-4">
              {renderInput('Public ID', publicId, setPublicId, 'Enter Public ID')}
              <Button onClick={getPublicKeyFromId} className="mt-2 w-full" primary label="Get Public Key" />
              {renderOutput('Output', publicKey.toString())}

              {renderInput(
                'Public Key',
                publicKey.toString(),
                (value) => {
                  try {
                    setPublicKey(base64ToUint8Array(value));
                  } catch {} // Handle invalid base64 input silently
                },
                'Enter Public Key'
              )}
              <Button onClick={getPublicIdFromKey} className="mt-2 w-full" primary label="Get Public ID" />
              {renderOutput('Output', publicId)}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Uint8 ↔ Base64</h2>
              <Button onClick={cleanStates.uint8Base64} className="px-3" label="Clean" />
            </div>

            <div className="space-y-4">
              {renderInput('Uint8 Array', uint8Input, setUint8Input, 'Enter comma-separated Uint8 Array', 3)}
              <Button onClick={() => handleConversion('toBase64')} className="mt-2 w-full" primary label="Convert to Base64" />
              {renderOutput('Output', base64Output)}

              {renderInput('Base64', base64Input, setBase64Input, 'Enter Base64 string', 3)}
              <Button onClick={() => handleConversion('toUint8')} className="mt-2 w-full" primary label="Convert to Uint8" />
              {renderOutput('Output', uint8Output)}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Transaction Creator</h2>
              <Button onClick={cleanStates.txCreator} className="px-3" label="Clean" />
            </div>

            <div className="space-y-4">
              {renderInput('Source ID *', txForm.sourceId, (value) => setTxForm((prev) => ({ ...prev, sourceId: value })), 'Enter source public ID')}
              {renderInput('Destination ID *', txForm.destinationId, (value) => setTxForm((prev) => ({ ...prev, destinationId: value })), 'Enter destination public ID')}
              {renderInput('Amount *', txForm.amount, (value) => setTxForm((prev) => ({ ...prev, amount: value })), 'Enter amount')}
              {renderInput('Tick *', txForm.tick || String(tickInfo.tick + 5), (value) => setTxForm((prev) => ({ ...prev, tick: value })), 'Enter tick')}
              {renderInput('Input Type', txForm.inputType, (value) => setTxForm((prev) => ({ ...prev, inputType: value })), 'Enter input type')}
              {renderInput('Input Size', txForm.inputSize, (value) => setTxForm((prev) => ({ ...prev, inputSize: value })), 'Enter input size')}
              {renderInput('Payload (Base64)', txForm.payload, (value) => setTxForm((prev) => ({ ...prev, payload: value })), 'Enter payload in Base64', 3)}

              <Button onClick={handleCreateTx} className="mt-2 w-full" primary label="Create & Sign Transaction" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Transaction Parser</h2>
              <Button onClick={cleanStates.txParser} className="px-3" label="Clean" />
            </div>

            <div className="space-y-4">
              <Button onClick={generateRandomTx} className="w-full mb-4" primary label="Generate Random Transaction" />
              {renderInput('Transaction Uint8 Array', uint8Input, setUint8Input, 'Enter transaction Uint8 Array', 3)}
              <Button onClick={parseTx} className="mt-2 w-full" primary label="Parse Transaction" />

              {Object.entries(txInfo).map(([key, value]) => renderOutput(key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'), value.toString()))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Helpers;
