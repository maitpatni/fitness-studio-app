import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "../lib/router";
import { Bell, ChevronLeft, Home, Dumbbell, CalendarDays, LineChart, User } from "lucide-react";
import { cn } from "../lib/utils";
import { IconButton } from "./ui";

/* ------------------------------------------------------------ phone shell */

export function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-start justify-center bg-shell sm:items-center sm:p-6">
      {/* Soft ambient light behind the device on large screens */}
      <div
        className="pointer-events-none fixed inset-0 hidden sm:block"
        style={{
          background:
            "radial-gradient(60rem 40rem at 50% 0%, rgba(255,138,92,0.12), transparent 60%), radial-gradient(40rem 30rem at 80% 90%, rgba(255,107,61,0.1), transparent 60%)",
        }}
      />
      <div
        className="relative w-full max-w-[440px] overflow-hidden bg-ink sm:rounded-[38px] sm:border sm:border-white/70 sm:shadow-[0_50px_110px_-45px_rgba(29,31,36,0.5)]"
        style={{ minHeight: "100dvh" }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- scroller */

export function Screen({
  children,
  className,
  tabBar = true,
  onBack,
  backLabel = "Back",
}: {
  children: React.ReactNode;
  className?: string;
  tabBar?: boolean;
  onBack?: () => void;
  backLabel?: string;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <header className="z-20 shrink-0 border-b border-violet-line bg-ink/85 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-3 px-4">
          {onBack ? (
            <IconButton label={backLabel} onClick={onBack} className="h-9 w-9">
              <ChevronLeft size={18} />
            </IconButton>
          ) : null}
          <div className="min-w-0 flex-1">
            <Brand />
          </div>
          <IconButton label="Notifications" onClick={() => navigate("/notifications")} badge={3}>
            <Bell size={17} />
          </IconButton>
        </div>
      </header>

      <div
        ref={scrollRef}
        className={cn(
          "no-scrollbar flex-1 overflow-y-auto overscroll-contain px-4 pb-28 pt-4",
          className,
        )}
      >
        {children}
      </div>

      {tabBar && !onBack ? <TabBar /> : null}
    </div>
  );
}

export function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative grid h-8 w-8 shrink-0 place-items-center">
        <span
          className="absolute inset-0 rounded-[10px]"
          style={{ background: "linear-gradient(140deg, #ff8a5c, #e2501f)" }}
        />
        <span className="relative font-serif text-[17px] font-semibold leading-none text-white">
          S
        </span>
      </span>
      <div className="min-w-0 leading-tight">
        <div className="truncate font-serif text-[15px] font-semibold tracking-wide text-fog">
          House of Santè
        </div>
        {!compact ? (
          <div className="eyebrow text-[9px] text-gold">Personal Training</div>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- tab bar */

const TABS = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/training", label: "Training", Icon: Dumbbell },
  { to: "/book", label: "Book", Icon: CalendarDays },
  { to: "/progress", label: "Progress", Icon: LineChart },
  { to: "/profile", label: "You", Icon: User },
];

export function TabBar() {
  const { pathname } = useLocation();
  const hide = pathname.startsWith("/login") || pathname.startsWith("/onboarding") || pathname.startsWith("/splash");
  if (hide) return null;

  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-violet-line bg-ink/92 pb-[max(env(safe-area-inset-bottom),8px)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[440px] items-stretch justify-between px-2 pt-1.5">
        {TABS.map(({ to, label, Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className="group relative flex flex-1 flex-col items-center gap-1 py-1.5"
            >
              <span
                className={cn(
                  "absolute -top-1.5 h-[2px] rounded-full bg-gold transition-all duration-300",
                  active ? "w-7 opacity-100" : "w-0 opacity-0",
                )}
              />
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full transition-all duration-200",
                  active ? "neu-sunken" : "neu-circle",
                )}
              >
                <Icon
                  size={17}
                  strokeWidth={active ? 2.1 : 1.6}
                  className={cn(
                    "transition-colors duration-200",
                    active ? "text-gold" : "text-mist/80 group-hover:text-gold",
                  )}
                />
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium tracking-wide transition-colors",
                  active ? "text-gold" : "text-mist/80",
                )}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------- misc parts */

export function PageHead({
  eyebrow,
  title,
  sub,
  right,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow text-gold">{eyebrow}</p> : null}
        <h1 className="mt-0.5 text-[27px] font-semibold leading-[1.15] tracking-tight text-fog">
          {title}
        </h1>
        {sub ? <p className="mt-1.5 text-[13px] leading-relaxed text-mist">{sub}</p> : null}
      </div>
      {right ? <div className="shrink-0 pt-1">{right}</div> : null}
    </div>
  );
}

/** Ambient brand texture used behind hero cards. */
export function StudioArt({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 80% 0%, rgba(255,138,92,0.3), transparent 62%), radial-gradient(100% 90% at 10% 100%, rgba(255,107,61,0.22), transparent 64%), linear-gradient(150deg, #f2f4f8 0%, #e7eaef 70%)",
        }}
      />
      <svg
        className="absolute -right-6 bottom-0 h-[85%] w-[85%] opacity-[0.24]"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <g stroke="#ff6b3d" strokeWidth="1" fill="none">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx="150" cy="120" r={18 + i * 16} opacity={0.9 - i * 0.12} />
          ))}
        </g>
      </svg>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(233,236,241,0.92) 0%, rgba(233,236,241,0.34) 45%, transparent 80%)",
        }}
      />
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("anim-rise", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
