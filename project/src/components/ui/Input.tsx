import { type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactNode;
  readOnly?: boolean;
}

export function Input({ label, leftIcon, readOnly, className = '', ...props }: InputProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
            {leftIcon}
          </span>
        )}
        <input
          className={`input-base ${leftIcon ? 'pl-11' : ''} ${
            readOnly ? 'bg-gray-100 text-ink-soft border-gray-200 cursor-not-allowed' : ''
          } ${className}`}
          readOnly={readOnly}
          {...props}
        />
      </div>
    </label>
  );
}
