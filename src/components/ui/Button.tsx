import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant - primary is the main call to action, secondary is for important but not main actions,
   * tertiary is for least critical actions
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  icon?: React.ReactNode;
}

/**
 * Button component with primary, secondary and tertiary variants
 */
const Button = ({ variant = 'primary', label, className, icon, ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-primary-40 text-black hover:bg-primary-50',
    secondary: 'bg-[rgba(26,222,245,0.1)] text-primary-40 hover:bg-[rgba(26,222,245,0.2)]',
    tertiary: 'bg-transparent text-gray-50 hover:text-primary-40',
  };

  return (
    <button
      type="button"
      className={clsx('p-3 rounded-xl flex items-center justify-center border-none', 'hover:scale-[1.02] active:scale-[0.98] transition-transform', variants[variant], className)}
      {...props}
    >
      {icon}
      {label}
    </button>
  );
};

export default Button;
