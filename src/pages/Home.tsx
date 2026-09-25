import { useMemo, useState } from "react";
import { useNavigate } from "../lib/router";
import {
  CalendarPlus,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  QrCode,
  TrendingUp,
} from "lucide-react";
import { Button, Ring, Sheet, Surface, Tag, Toast, useCountUp } from "../components/ui";
import { PageHead, Reveal, Screen, StudioArt } from "../components/shell";
import {
  MEMBERSHIP,
  daysBetween,
  fmtDate,
  inr,
  todayISO,
  useStore,
  type Booking,
} from "../lib/store";
import { TRAINERS } from "../lib/hos-data";
import { cn } from "../lib/utils";

export function Home() {
  const navigate = useNavigate();
  const { bookings, progress, checkIns, ready, checkIn, onboarding } = useStore();
  const [qr, setQr] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const today = todayISO();
  const member = onboarding.name || "Rhea Kapoor";

  const upcoming = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "booked" && b.session_date >= today)
        .sort((a, b) =>
          a.session_date === b.session_date
            ? a.start_time.localeCompare(b.start_time)
            : a.session_date.localeCompare(b.session_date),
        ),
    [bookings, today],
  );

  const next = upcoming[0];
  const lastProgress = progress[progress.length - 1];
  const firstProgress = progress[0];

  const remaining = Math.max(0, MEMBERSHIP.purchased + MEMBERSHIP.bonus - MEMBERSHIP.used);
  const daysLeft = daysBetween(today, MEMBERSHIP.expiryDate);

  const streak = useMemo(() => {
    const done = bookings
      .filter((b) => b.status === "completed")
      .map((b) => b.session_date)
      .sort();
    if (done.length === 0) return 0;
    let streakCount = 0;
    let cursor = today;
    // walk back from today counting completed sessions on distinct days
    const setDays = new Set(done);
    let d = todayISO();
    for (let i = 0; i < 60; i += 1) {
      if (setDays.has(d)) streakCount += 1;
      else if (i > 0) break;
      d = daysBack(d, 1);
    }
    cursor = d;
    return streakCount || 3;
  }, [bookings, today]);

  const weightDelta =
    lastProgress?.weight_kg && firstProgress?.weight_kg
      ? Number(lastProgress.weight_kg) - Number(firstProgress.weight_kg)
      : 0;

  const doCheckIn = async () => {
    if (!next) return;
    setBusy(true);
    const ok = await checkIn(next.ref, "qr");
    setBusy(false);
    setQr(false);
    if (ok) {
      setToast(`Checked in for ${next.start_time} with ${next.trainer_name}`);
    }
  };

  return (
    <Screen>
      <PageHead
        eyebrow={`Good ${greeting()}, ${member.split(" ")[0]}`}
        title="Your training today"
        sub={next ? `Next up ${next.start_time} · ${next.trainer_name}` : "No session booked — pick a slot."}
        right={
          <div className="mt-1 h-9 w-9 rounded-full border border-gold/25 bg-gradient-to-br from-violet-soft/60 to-white" />
        }
      />

      {/* ---------------------------------------------------- next session */}
      <Reveal delay={40}>
        {next ? (
          <button
            type="button"
            onClick={() => navigate(`/session/${next.id}`)}
            className="grain relative w-full overflow-hidden rounded-3xl border border-violet-line bg-bone text-left shadow-[0_1px_2px_rgba(45,20,90,0.04),0_16px_40px_-28px_rgba(45,20,90,0.45)]"
          >
            <StudioArt />
            <div className="relative z-10 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow text-gold">Next session</p>
                <Tag tone="sage">{daysLabel(next.session_date, today)}</Tag>
              </div>
              <h2 className="mt-2 font-serif text-[30px] font-semibold leading-none text-fog">
                {next.start_time}
              </h2>
              <p className="mt-1.5 text-[14px] text-mist">
                {fmtDate(next.session_date)} · {next.duration_min} min
              </p>

              <div className="mt-4 flex items-center gap-3 border-t border-violet-line pt-4">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/25 bg-gold/10 text-[12px] font-cond tracking-widest text-gold">
                  {initials(next.trainer_name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-fog">{next.trainer_name}</p>
                  <p className="truncate text-[12px] text-mist">{next.session_type}</p>
                </div>
                <ChevronRight size={18} className="shrink-0 text-mist" />
              </div>
            </div>
          </button>
        ) : (
          <Surface className="p-6 text-center">
            <p className="font-display text-[17px] font-medium text-fog">No upcoming sessions</p>
            <p className="mx-auto mt-1.5 max-w-[30ch] text-[13px] text-mist">
              Book your next slot — real-time availability, no double bookings.
            </p>
            <Button className="mt-4" onClick={() => navigate("/book")}>
              <CalendarPlus size={16} /> Book a session
            </Button>
          </Surface>
        )}
      </Reveal>

      {/* ------------------------------------------------------ stat strip */}
      <Reveal delay={90}>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <StatCard
            label="Sessions left"
            value={`${remaining}`}
            sub={`of ${MEMBERSHIP.purchased + MEMBERSHIP.bonus}`}
            accent="#ff6b3d"
          />
          <StatCard
            label="Package ends"
            value={`${Math.max(0, daysLeft)}`}
            sub="days"
            accent="#ff8a5c"
          />
          <StatCard label="Streak" value={`${streak}`} sub="weeks" accent="#e2501f" />
        </div>
      </Reveal>

      {/* ----------------------------------------------------- quick action */}
      <Reveal delay={130}>
        <Button
          size="lg"
          full
          className="mt-4"
          onClick={() => setQr(true)}
        >
          <QrCode size={18} /> Check in at the studio
        </Button>
      </Reveal>

      {/* -------------------------------------------------------- next up */}
      {upcoming.length > 1 ? (
        <Reveal delay={170}>
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[19px] font-semibold tracking-tight text-fog">Coming up</h2>
              <button
                type="button"
                onClick={() => navigate("/sessions")}
                className="text-[13px] text-gold"
              >
                All sessions
              </button>
            </div>
            <ul className="space-y-2">
              {upcoming.slice(1, 4).map((b) => (
                <SessionRow key={b.id} booking={b} today={today} onOpen={() => navigate(`/session/${b.id}`)} />
              ))}
            </ul>
          </div>
        </Reveal>
      ) : null}

      {/* ------------------------------------------------------- progress */}
      <Reveal delay={210}>
        <div className="mt-7">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-[19px] font-semibold tracking-tight text-fog">Progress</h2>
            <button type="button" onClick={() => navigate("/progress")} className="text-[13px] text-gold">
              Details
            </button>
          </div>
          <Surface className="p-4">
            <div className="flex items-center gap-4">
              <Ring
                value={lastProgress?.body_fat_pct ? Number(lastProgress.body_fat_pct) : 23}
                max={30}
                label={lastProgress?.body_fat_pct ? `${Number(lastProgress.body_fat_pct)}%` : "23%"}
                sub="body fat"
                accent="#ff6b3d"
                size={84}
              />
              <div className="min-w-0 flex-1 space-y-2.5">
                <Metric
                  icon={<Dumbbell size={13} />}
                  label="Body weight"
                  value={lastProgress?.weight_kg ? `${Number(lastProgress.weight_kg)} kg` : "—"}
                  delta={weightDelta ? `${weightDelta.toFixed(1)} kg` : "—"}
                  good
                />
                <Metric
                  icon={<TrendingUp size={13} />}
                  label="Waist"
                  value={lastProgress?.waist_cm ? `${Number(lastProgress.waist_cm)} cm` : "—"}
                  delta={firstProgress?.waist_cm && lastProgress?.waist_cm ? `${(Number(lastProgress.waist_cm) - Number(firstProgress.waist_cm)).toFixed(1)} cm` : "—"}
                  good
                />
                <Metric
                  icon={<Flame size={13} />}
                  label="Sessions done"
                  value={`${bookings.filter((b) => b.status === "completed").length}`}
                  delta="all time"
                />
              </div>
            </div>
          </Surface>
        </div>
      </Reveal>

      {/* -------------------------------------------------------- coaches */}
      <Reveal delay={250}>
        <div className="mt-7 mb-3 flex items-end justify-between">
          <h2 className="text-[19px] font-semibold tracking-tight text-fog">Your coach</h2>
          <button type="button" onClick={() => navigate("/trainers")} className="text-[13px] text-gold">
            All coaches
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {TRAINERS.slice(0, 4).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate(`/trainers/${t.id}`)}
              className="w-[136px] shrink-0 rounded-2xl border border-violet-line bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(45,20,90,0.04)] transition-colors hover:border-violet-soft"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-full font-cond text-[15px] tracking-widest"
                style={{
                  color: t.accent,
                  background: `linear-gradient(150deg, ${t.accent}22, ${t.accent}08)`,
                  border: `1px solid ${t.accent}44`,
                }}
              >
                {t.initials}
              </span>
              <p className="mt-2.5 truncate text-[13px] font-medium text-fog">{t.name}</p>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-mist">
                {t.specialty.slice(0, 2).join(" · ")}
              </p>
            </button>
          ))}
        </div>
      </Reveal>

      {/* --------------------------------------------------------- renewal */}
      {remaining <= 7 ? (
        <Reveal delay={290}>
          <Surface className="mt-7 border-gold/25 bg-violet-wash p-4">
            <div className="flex items-start gap-3">
              <Clock size={16} className="mt-0.5 shrink-0 text-gold" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-fog">Time to think about renewal</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-mist">
                  {remaining} sessions left, valid until {fmtDate(MEMBERSHIP.expiryDate)}.
                </p>
              </div>
            </div>
            <Button size="sm" className="mt-3" onClick={() => navigate("/membership")}>
              View packages
            </Button>
          </Surface>
        </Reveal>
      ) : null}

      {ready && checkIns.length > 0 ? (
        <p className="mt-7 text-center text-[11px] text-mist/50">
          Last check-in {new Date(checkIns[0].checked_in_at).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          via {checkIns[0].method.toUpperCase()}
        </p>
      ) : null}

      <Sheet
        open={qr}
        onClose={() => setQr(false)}
        eyebrow="Entry pass"
        title="Scan to check in"
        footer={
          <Button size="lg" full onClick={doCheckIn} disabled={busy || !next}>
            {busy ? "Checking in…" : "Simulate scan"}
          </Button>
        }
      >
        <div className="flex flex-col items-center py-2">
          <div className="relative grid h-56 w-56 place-items-center rounded-3xl border border-gold/25 bg-violet-wash">
            <div className="grid grid-cols-9 gap-1 p-5" aria-hidden="true">
              {Array.from({ length: 81 }).map((_, i) => {
                const on =
                  (i * 7 + Math.floor(i / 9) * 13) % 5 < 2 ||
                  i % 9 === 0 ||
                  Math.floor(i / 9) === 0 ||
                  i === 80;
                return (
                  <span
                    key={i}
                    className={cn("h-2 w-2 rounded-[2px]", on ? "bg-fog" : "bg-transparent")}
                  />
                );
              })}
            </div>
            <span className="absolute inset-0 rounded-3xl anim-pulse-ring" />
          </div>
          <p className="mt-4 text-center text-[13px] text-mist">
            Show this at the front desk, or let reception scan it.
          </p>
          {next ? (
            <p className="mt-2 text-center text-[12px] text-mist/70">
              Pass {next.ref} · {next.start_time} · {next.trainer_name}
            </p>
          ) : null}
        </div>
      </Sheet>

      <Toast message={toast} onDone={() => setToast(null)} />
    </Screen>
  );
}

/* ------------------------------------------------------------- fragments */

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-violet-line bg-white p-3 shadow-[0_1px_2px_rgba(45,20,90,0.04)]">
      <p className="text-[10px] leading-tight tracking-wide text-mist/90">{label}</p>
      <p
        className="mt-1 font-cond text-[26px] font-semibold leading-none tabular-nums"
        style={{ color: accent }}
      >
        {value}
      </p>
      <p className="mt-1 text-[10px] text-mist/70">{sub}</p>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  delta,
  good,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  good?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-violet-wash text-violet-deep">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-mist/90">{label}</p>
        <p className="font-cond text-[15px] leading-tight tabular-nums text-fog">{value}</p>
      </div>
      <span
        className={cn(
          "shrink-0 text-[11px] font-medium",
          good ? "text-sage" : "text-mist/70",
        )}
      >
        {delta}
      </span>
    </div>
  );
}

function SessionRow({
  booking,
  today,
  onOpen,
}: {
  booking: Booking;
  today: string;
  onOpen: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 rounded-2xl border border-violet-line bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(45,20,90,0.04)] transition-colors hover:border-violet-soft"
      >
        <div className="w-11 shrink-0 text-center">
          <p className="font-cond text-[11px] tracking-wide text-mist">
            {fmtDate(booking.session_date).split(" ")[0].toUpperCase()}
          </p>
          <p className="font-cond text-[19px] font-semibold leading-none tabular-nums text-fog">
            {fmtDate(booking.session_date).split(" ")[1]}
          </p>
        </div>
        <div className="h-9 w-px shrink-0 bg-violet-line" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] text-fog">
            {booking.start_time} · {booking.trainer_name}
          </p>
          <p className="truncate text-[12px] text-mist">{booking.session_type}</p>
        </div>
        <Tag tone={daysLabel(booking.session_date, today).includes("Today") ? "gold" : "neutral"}>
          {daysLabel(booking.session_date, today)}
        </Tag>
      </button>
    </li>
  );
}

/* ------------------------------------------------------------------ utils */

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function daysBack(iso: string, n: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}-${`${d.getDate()}`.padStart(2, "0")}`;
}

export function daysLabel(dateIso: string, todayIso: string): string {
  if (dateIso === todayIso) return "Today";
  if (dateIso === daysBack(todayIso, -1)) return "Tomorrow";
  const diff = daysBetween(todayIso, dateIso);
  if (diff > 1 && diff < 7) return `In ${diff} days`;
  return fmtDate(dateIso).split(" ")[0];
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export { inr };
