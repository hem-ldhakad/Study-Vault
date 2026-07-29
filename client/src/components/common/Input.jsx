import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full bg-white/80 dark:bg-slate-900/80 border ${error ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/20'
            } ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm transition-all focus:outline-none focus:ring-2 shadow-sm ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-0.5">{error}</span>}
    </div>
  );
};

export default Input;
