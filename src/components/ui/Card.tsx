import clsx from 'clsx';
import { ReactNode, MouseEvent } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const Card = ({ children, className, onClick }: CardProps) => {
  return (
    <div className={clsx('bg-card border-card-border border-[1px] rounded-[8px]', className)} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
