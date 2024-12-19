import { useState } from 'react';
import { DEFAULT_TICK_OFFSET } from '@/constants';

export const useTickOffset = () => {
  const [tickOffset, setTickOffset] = useState<number>(DEFAULT_TICK_OFFSET);

  return { tickOffset, setTickOffset };
};
