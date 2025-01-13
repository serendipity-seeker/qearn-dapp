import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';
import { base64ToUint8Array } from '@/utils';
import { toast } from 'react-hot-toast';
import { renderInput, renderOutput } from './common';

const qHelper = new QubicHelper();

export const PublicIdKeyConverter = () => {
  const [publicId, setPublicId] = useState('');
  const [publicKey, setPublicKey] = useState<Uint8Array>(new Uint8Array());

  const validatePublicKey = (key: Uint8Array | string) => {
    if (typeof key === 'string' && key.length !== 60) return false;
    if (key instanceof Uint8Array && key.length !== 32) return false;
    return true;
  };

  const handleError = (message: string) => toast.error(message);

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

  const cleanStates = () => {
    setPublicId('');
    setPublicKey(new Uint8Array());
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Public ID ↔ Key</h2>
          <Button onClick={cleanStates} className="px-3" label="Clean" />
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
  );
}; 