"use client";

import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export function Button({ variant = "primary", size = "md", loading = false, disabled, type = "button", children, className = "", ...props }: ButtonProps) {
  return <button className={`agency-button agency-button--${variant} agency-button--${size} ${className}`.trim()} type={type} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>{loading ? "Loading…" : children}</button>;
}

export function Card({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <section className={`agency-card ${className}`.trim()} {...props}>{children}</section>;
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string };
export function Input({ label, hint, error, id, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, ...props }: InputProps) {
  const inputId = id ?? React.useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const messageId = error ? errorId : hint ? hintId : undefined;
  const ariaDescribedBy = [describedBy, messageId].filter(Boolean).join(" ") || undefined;
  return <div className="agency-field">
    {label && <label className="agency-label" htmlFor={inputId}>{label}</label>}
    <input id={inputId} className="agency-input" aria-invalid={error ? true : ariaInvalid} aria-describedby={ariaDescribedBy} {...props} />
    {error ? <span id={errorId} role="alert">{error}</span> : hint ? <span id={hintId} className="agency-muted">{hint}</span> : null}
  </div>;
}

export type AvatarProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  name: string;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  decorative?: boolean;
};
function initials(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join("");
}
export function Avatar({ name, src, alt, size = "md", decorative = false, className = "", "aria-hidden": ariaHidden, ...props }: AvatarProps) {
  return <span className={`agency-avatar agency-avatar--${size} ${className}`.trim()} aria-hidden={decorative || ariaHidden || undefined} {...props}>
    {src ? <img src={src} alt={decorative ? "" : (alt ?? name)} /> : decorative ? initials(name) : <span role="img" aria-label={name}>{initials(name)}</span>}
  </span>;
}

export type BadgeProps = {
  max?: number;
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
  className?: string;
} & (
  | { dot: true; label: string; value?: never }
  | { dot?: false; value: number | string; label?: string }
);
export function Badge({ value, label, max = 99, tone = "neutral", dot = false, className = "" }: BadgeProps) {
  const visibleValue = typeof value === "number" && value > max ? `${max}+` : value;
  return <span className={`agency-badge agency-badge--${tone} ${dot ? "agency-badge--dot" : ""} ${className}`.trim()} aria-label={label}>
    {dot ? <span className="agency-badge-dot" aria-hidden="true" /> : visibleValue}
  </span>;
}

export type TagProps = React.HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "blue" | "green" | "amber" | "red" };
export function Tag({ tone = "neutral", className = "", children, ...props }: TagProps) {
  return <span className={`agency-tag agency-tag--${tone} ${className}`.trim()} {...props}>{children}</span>;
}

export type InlineMessageProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: "info" | "success" | "warning" | "error";
  title?: string;
};
const messageIcons = { info: "i", success: "✓", warning: "!", error: "!" } as const;
export function InlineMessage({ tone = "info", title, className = "", children, ...props }: InlineMessageProps) {
  const role = tone === "error" ? "alert" : "status";
  return <div className={`agency-message agency-message--${tone} ${className}`.trim()} role={role} aria-live={role === "status" ? "polite" : undefined} {...props}>
    <span className="agency-message-icon" aria-hidden="true">{messageIcons[tone]}</span>
    <span className="agency-message-content">{title && <strong>{title}</strong>}<span>{children}</span></span>
  </div>;
}

export type LayoutPrimitiveProps = React.HTMLAttributes<HTMLDivElement> & { gap?: string | number };
function layoutGap(gap: string | number) {
  return typeof gap === "number" || /^\d+$/.test(gap)
    ? `var(--agency-space-${gap}, ${Number(gap) * 4}px)`
    : gap;
}
export function Stack({ gap = 3, className = "", style, ...props }: LayoutPrimitiveProps) {
  return <div className={`agency-stack ${className}`.trim()} style={{ "--agency-layout-gap": layoutGap(gap), ...style } as React.CSSProperties} {...props} />;
}
export type InlineProps = LayoutPrimitiveProps & { wrap?: boolean };
export function Inline({ gap = 2, wrap = true, className = "", style, ...props }: InlineProps) {
  return <div className={`agency-inline ${wrap ? "agency-inline--wrap" : ""} ${className}`.trim()} style={{ "--agency-layout-gap": layoutGap(gap), ...style } as React.CSSProperties} {...props} />;
}
