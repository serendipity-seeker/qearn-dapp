import clsx from "clsx";
import { ReactNode, MouseEvent } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const Card = ({ children, className, onClick }: CardProps) => {
  return (
    <div className={clsx("rounded-[8px] border-[1px] border-card-border bg-card", className)} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
