import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
const Button = ({
  primary = false,
  label,
  className,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'bg-primary-40 text-black' : 'bg-[rgba(26,222,245,0.1)] text-primary-40';
  return (
    <button
      type="button"
      className={clsx('p-4 rounded-lg', mode, className)}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
