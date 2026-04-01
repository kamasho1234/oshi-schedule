import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", id, ...props }: InputProps) {
  const inputId = id || label?.replace(/\s/g, "-").toLowerCase();
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-sub"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full radius-input border border-input bg-input px-4 py-2.5 text-body placeholder:text-dim focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:outline-none transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
