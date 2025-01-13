import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { generateSeed } from '@/utils';
import { toast } from 'react-hot-toast';
import { renderOutput } from './common';

export const RandomSeedGenerator = () => {
  const [randomSeed, setRandomSeed] = useState('');

  const handleGenerateRandomSeed = () => {
    const seed = generateSeed();
    setRandomSeed(seed);
    toast.success('Random seed generated');
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Random Seed Generator</h2>
          <Button onClick={() => setRandomSeed('')} className="px-3" label="Clean" />
        </div>

        <div className="space-y-4">
          <Button onClick={handleGenerateRandomSeed} className="w-full" primary label="Generate Random Seed" />
          {randomSeed && renderOutput('Generated Seed', randomSeed)}
        </div>
      </div>
    </Card>
  );
}; 