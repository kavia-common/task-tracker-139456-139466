import React from 'react';
import './ocean.css';

// PUBLIC_INTERFACE
export function Button({ children, variant = 'primary', size = 'md', ...props }) {
  /** Styled button component. */
  const cls = `btn btn-${variant} btn-${size}`;
  return <button className={cls} {...props}>{children}</button>;
}

// PUBLIC_INTERFACE
export function Input({ label, error, ...props }) {
  /** Labeled input with error display. */
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <input className={`input ${error ? 'input-error' : ''}`} {...props} />
      {error && <div className="error">{error}</div>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function TextArea({ label, error, ...props }) {
  /** Labeled textarea with error display. */
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <textarea className={`textarea ${error ? 'input-error' : ''}`} {...props} />
      {error && <div className="error">{error}</div>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Select({ label, error, children, ...props }) {
  /** Labeled select with error display. */
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <select className={`select ${error ? 'input-error' : ''}`} {...props}>
        {children}
      </select>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Card({ children }) {
  /** Simple card surface. */
  return <div className="card">{children}</div>;
}

// PUBLIC_INTERFACE
export function Loader({ text = 'Loading...' }) {
  /** Minimal loader. */
  return <div className="loader">{text}</div>;
}
