import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { base64ToUint8Array, uint8ArrayToBase64 } from '@/utils';
import { toast } from 'react-hot-toast';
import { renderInput, renderOutput } from './common';

export const Uint8Base64Converter = () => {
  const [uint8Input, setUint8Input] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [uint8Output, setUint8Output] = useState('');
  const [base64Output, setBase64Output] = useState('');

  const handleError = (message: string) => toast.error(message);

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

  const cleanStates = () => {
    setUint8Input('');
    setBase64Input('');
    setUint8Output('');
    setBase64Output('');
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Uint8 ↔ Base64</h2>
          <Button onClick={cleanStates} className="px-3" label="Clean" />
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
  );
}; 