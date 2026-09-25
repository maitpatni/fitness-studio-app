import { useEffect, useRef, useState } from "react";
import { X, Check } from "lucide-react";
import { cn } from "../lib/utils";

/* --------------------------------------------------------------- surfaces */

export function Surface({
  className,
  children,
  as: As = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <As className={cn("rounded-2xl border border-white/70 neu-raised", className)}>
      {children}
    </As>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow text-gold">{eyebrow}</p> : null}
        <h2 className="truncate text-[19px] font-semibold tracking-tight text-fog">{title}</h2>
      </div>
      {action}
    </div>
  );
}

/* ---------------------------------------------------------------- buttons */

type BtnProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  full?: boolean;
};

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  disabled,
  type = "button",
  full,
}: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
        size === "sm" && "h-9 px-4 text-[13px]",
        size === "md" && "h-12 px-6 text-[15px]",
        size === "lg" && "h-14 px-7 text-[16px]",
        variant === "primary" &&
          "bg-gradient-to-b from-gold-soft to-gold text-white shadow-[0_8px_22px_-10px_rgba(226,80,31,0.8)] hover:from-gold hover:to-gold-deep",
        variant === "secondary" && "neu-button text-fog hover:text-gold-deep",
        variant === "ghost" && "text-mist hover:text-gold",
        variant === "danger" && "border border-rust/30 bg-rust/[0.08] text-rust hover:bg-rust/15",
        full && "w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function IconButton({
  children,
  onClick,
  label,
  className,
  badge,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  label: string;
  className?: string;
  badge?: number;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/70 neu-circle text-fog hover:text-gold",
        className,
      )}
    >
      {children}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

/* ----------------------------------------------------------------- chips */

export function Chip({
  children,
  active,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200",
        active
          ? "border-transparent bg-gradient-to-b from-gold-soft to-gold text-white shadow-[0_6px_16px_-8px_rgba(226,80,31,0.85)]"
          : "border-white/70 neu-button text-mist hover:text-gold",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Tag({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gold" | "sage" | "rust";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
        tone === "neutral" && "bg-violet-wash text-mist",
        tone === "gold" && "bg-gold/10 text-gold-deep",
        tone === "sage" && "bg-sage/10 text-sage",
        tone === "rust" && "bg-rust/10 text-rust",
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({
  initials,
  accent = "#ff6b3d",
  size = 44,
}: {
  initials: string;
  accent?: string;
  size?: number;
}) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-cond font-medium tracking-widest"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        color: accent,
        background: `linear-gradient(150deg, ${accent}1f, ${accent}0d)`,
        border: `1px solid ${accent}3d`,
      }}
    >
      {initials}
    </span>
  );
}

/* ----------------------------------------------------------------- sheet */

export function Sheet({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="anim-fade absolute inset-0 bg-fog/35 backdrop-blur-[3px]"
      />
      <div className="anim-sheet relative z-10 flex max-h-[88vh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-3xl border border-white/70 bg-ink shadow-[0_-24px_60px_-24px_rgba(29,31,36,0.4)]">
        <div className="flex items-start justify-between gap-4 border-b border-violet-line bg-bone px-5 pb-4 pt-5">
          <div className="min-w-0">
            {eyebrow ? <p className="eyebrow text-gold">{eyebrow}</p> : null}
            <h3 className="truncate text-[19px] font-semibold tracking-tight text-fog">{title}</h3>
          </div>
          <IconButton label="Close" onClick={onClose} className="h-9 w-9">
            <X size={17} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto bg-ink px-5 py-4">{children}</div>
        {footer ? (
          <div className="border-t border-violet-line bg-bone px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- toast */

export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-4">
      <div className="anim-rise flex items-center gap-2.5 rounded-full border border-white/70 neu-raised px-4 py-2.5 text-[13px] font-medium text-fog">
        <Check size={15} className="text-gold" />
        {message}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ form fields */

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal";
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-1.5 block text-mist/80">{label}</span>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/70 neu-sunken px-4 text-[15px] text-fog outline-none transition-colors placeholder:text-mist/50 focus:border-gold/60"
      />
    </label>
  );
}

export function Stepper({
  label,
  value,
  unit,
  onChange,
  step = 0.1,
}: {
  label: string;
  value: string;
  unit: string;
  onChange: (v: string) => void;
  step?: number;
}) {
  const bump = (dir: 1 | -1) => {
    const base = parseFloat(value);
    const next = (Number.isFinite(base) ? base : 0) + dir * step;
    onChange(String(Math.round(next * 100) / 100));
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/70 neu-raised px-3 py-2.5">
      <span className="text-[14px] text-mist">{label}</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => bump(-1)}
          className="grid h-8 w-8 place-items-center rounded-lg border border-white/70 neu-button text-fog active:scale-95"
        >
          −
        </button>
        <div className="w-20 text-center">
          <span className="font-cond text-[17px] font-medium tabular-nums text-fog">
            {value || "—"}
          </span>
          <span className="ml-1 text-[11px] text-mist">{unit}</span>
        </div>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => bump(1)}
          className="grid h-8 w-8 place-items-center rounded-lg border border-white/70 neu-button text-fog active:scale-95"
        >
          +
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- charts */

export function LineChart({
  values,
  labels,
  height = 150,
  accent = "#ff6b3d",
  unit = "",
  invert,
}: {
  values: number[];
  labels: string[];
  height?: number;
  accent?: string;
  unit?: string;
  invert?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  if (values.length < 2) return null;

  const W = 320;
  const H = height;
  const padX = 8;
  const padY = 18;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const pts = values.map((v, i) => {
    const x = padX + (i * (W - padX * 2)) / (values.length - 1);
    const raw = (v - min) / span;
    const yNorm = invert ? raw : 1 - raw;
    return { x, y: padY + yNorm * (H - padY * 2), v };
  });

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${H - 2} L${pts[0].x.toFixed(1)},${H - 2} Z`;
  const gid = `hos-grad-${accent.replace("#", "")}`;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.26" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gid})`} />
        <path
          d={line}
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {pts.map((p, i) => (
          <g key={i}>
            <rect
              x={p.x - 14}
              y={0}
              width={28}
              height={H}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
            {hover === i ? (
              <circle cx={p.x} cy={p.y} r="4.5" fill={accent} stroke="#ffffff" strokeWidth="2" />
            ) : null}
          </g>
        ))}
      </svg>
      {hover !== null ? (
        <div
          className="pointer-events-none absolute -top-1 rounded-lg border border-white/70 neu-raised px-2.5 py-1.5 text-[11px]"
          style={{
            left: `${(pts[hover].x / W) * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          <span className="font-cond text-[13px] tabular-nums text-fog">
            {values[hover]} {unit}
          </span>
          <span className="ml-1.5 text-mist">{labels[hover]}</span>
        </div>
      ) : null}
      <div className="mt-1 flex justify-between text-[10px] text-mist/70">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}

export function Ring({
  value,
  max,
  size = 92,
  stroke = 7,
  label,
  sub,
  accent = "#ff6b3d",
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  label: string;
  sub?: string;
  accent?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#dfe3e9" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-cond text-[26px] font-semibold leading-none tabular-nums text-fog">{label}</div>
        {sub ? <div className="mt-1 text-[10px] tracking-wide text-mist">{sub}</div> : null}
      </div>
    </div>
  );
}

export function BarRow({
  label,
  value,
  max,
  accent = "#ff6b3d",
  suffix = "",
}: {
  label: string;
  value: number;
  max: number;
  accent?: string;
  suffix?: string;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-[13px] text-mist">{label}</span>
        <span className="font-cond text-[14px] tabular-nums text-fog">
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full neu-track">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: accent }}
        />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- misc */

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-[3px] w-full overflow-hidden rounded-full neu-track">
      <div
        className="h-full rounded-full bg-gradient-to-r from-gold-soft to-gold transition-[width] duration-200 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-violet-line bg-ink px-6 py-10 text-center neu-sunken">
      <p className="font-display text-[16px] font-medium text-fog">{title}</p>
      <p className="max-w-[30ch] text-[13px] leading-relaxed text-mist">{body}</p>
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl neu-sunken", className)} />;
}

/** Counts up to a target on mount — used for the dashboard stat tiles. */
export function useCountUp(target: number, ms = 900) {
  const [n, setN] = useState(0);
  const raf = useRef<number | undefined>(undefined);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, ms]);
  return n;
}
