import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { createPayload, uint8ArrayToBase64 } from '@/utils';
import { renderInput, renderOutput, renderSelect } from './common';

const initialPayloadField = {
  data: '',
  type: 'uint8',
};

const initialPayloadForm = {
  fields: [initialPayloadField],
};

export const PayloadCreator = () => {
  const [payloadForm, setPayloadForm] = useState(initialPayloadForm);
  const [output, setOutput] = useState({ payload: '', inputType: '', inputSize: '' });

  const addPayloadField = () => {
    setPayloadForm((prev) => ({
      fields: [...prev.fields, initialPayloadField],
    }));
  };

  const removePayloadField = (index: number) => {
    setPayloadForm((prev) => ({
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const updatePayloadField = (index: number, field: typeof initialPayloadField) => {
    setPayloadForm((prev) => ({
      fields: prev.fields.map((f, i) => (i === index ? field : f)),
    }));
  };

  const handleCreatePayload = () => {
    try {
      const invalidFields = payloadForm.fields.some((field) => !field.data || !field.type);
      if (invalidFields) {
        return toast.error('Please fill in all payload fields');
      }

      const payload = createPayload(
        payloadForm.fields.map((field) => ({
          data: field.data.startsWith('0x') ? parseInt(field.data, 16) : Number(field.data),
          type: field.type as 'uint8' | 'uint16' | 'uint32' | 'bigint64',
        }))
      );

      setOutput({
        payload: uint8ArrayToBase64(payload),
        inputType: '1',
        inputSize: payload.length.toString(),
      });

      toast.success('Payload created successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error creating payload');
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Payload Creator</h2>
          <Button onClick={() => setPayloadForm(initialPayloadForm)} className="px-3" label="Clean" />
        </div>

        <div className="space-y-4">
          {payloadForm.fields.map((field, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Field {index + 1}</h3>
                {index > 0 && <Button onClick={() => removePayloadField(index)} className="px-3" label="Remove" />}
              </div>
              {renderInput('Data (decimal or hex)', field.data, (value) => updatePayloadField(index, { ...field, data: value }), 'Enter data (e.g. 123 or 0xFF)')}
              {renderSelect('Type', field.type, (value) => updatePayloadField(index, { ...field, type: value }), ['uint8', 'uint16', 'uint32', 'bigint64'])}
            </div>
          ))}

          <Button onClick={addPayloadField} className="w-full" label="Add Field" />
          <Button onClick={handleCreatePayload} className="mt-4 w-full" variant="primary" label="Create Combined Payload" />

          {output.payload && (
            <>
              {renderOutput('Combined Payload (Base64)', output.payload)}
              {renderOutput('Input Type', output.inputType)}
              {renderOutput('Input Size', output.inputSize)}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}; 