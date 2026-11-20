"use client";

import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export function Button({ variant = "primary", size = "md", loading = false, disabled, children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`agency-button agency-button--${variant} agency-button--${size} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}

export function Card({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <section className={`agency-card ${className}`.trim()} {...props}>{children}</section>;
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string };

export function Input({ label, hint, error, id, ...props }: InputProps) {
  const inputId = id ?? React.useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  return (
    <div className="agency-field">
      {label && <label className="agency-label" htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className="agency-input"
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...props}
      />
      {error ? <span id={errorId} role="alert">{error}</span> : hint ? <span id={hintId} className="agency-muted">{hint}</span> : null}
    </div>
  );
}
