import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-base bg-alert text-white h-12 px-5 shadow-soft hover:bg-alert-dark',
};

export function Button({
  variant = 'primary',
  full,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
