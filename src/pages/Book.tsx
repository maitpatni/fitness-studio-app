import { useMemo, useState } from "react";
import { useNavigate } from "../lib/router";
import {
  ArrowLeft,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  Avatar,
  Button,
  Chip,
  Empty,
  Sheet,
  Surface,
  Tag,
  Toast,
} from "../components/ui";
import { PageHead, Screen } from "../components/shell";
import { addDays, fromISO, inr, todayISO, useStore } from "../lib/store";
import { SESSION_TYPES, TRAINERS } from "../lib/hos-data";
import { cn } from "../lib/utils";
import { daysLabel, initials } from "./Home";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/** Deterministic pseudo-availability so the same trainer/date always shows the same slots. */
function slotsFor(trainerId: string, dateIso: string, typeId: string): string[] {
  const base = fromISO(dateIso).getDay();
  if (base === 0) return [];
  const all = trainerId === "maya-rao"
    ? ["06:30", "08:00", "09:30", "17:00", "18:30", "20:00"]
    : trainerId === "dev-kapoor"
      ? ["07:00", "09:00", "12:00", "16:30", "19:00"]
      : ["06:00", "07:00", "08:00", "12:30", "17:30", "18:30", "19:30"];
  const filtered = all.filter((_, i) => (i + base + typeId.length) % 3 !== 1);
  return typeId === "hyrox" ? filtered.slice(0, 3) : filtered;
}

export function Book() {
  const navigate = useNavigate();
  const { bookings, createBooking, isLogged, toggleLog } = useStore();

  const [typeId, setTypeId] = useState<string | null>(null);
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const type = SESSION_TYPES.find((t) => t.id === typeId) ?? null;
  const trainer = TRAINERS.find((t) => t.id === trainerId) ?? null;

  // 14-day booking window (configurable per PRD §15)
  const days = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(todayISO(), i)),
    [],
  );

  const slots = useMemo(() => {
    if (!trainerId || !date || !typeId) return [];
    return slotsFor(trainerId, date, typeId);
  }, [trainerId, date, typeId]);

  const conflicts = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.status === "booked" &&
          b.trainer_id === trainerId &&
          b.session_date === date &&
          b.start_time === time,
      ),
    [bookings, trainerId, date, time],
  );

  const myConflicts = useMemo(
    () =>
      bookings.filter(
        (b) => b.status === "booked" && b.session_date === date && b.start_time === time,
      ),
    [bookings, date, time],
  );

  const conflict = conflicts.length > 0 || myConflicts.length > 0;

  const reset = () => {
    setTypeId(null);
    setTrainerId(null);
    setDate(null);
    setTime(null);
  };

  const submit = async () => {
    if (!type || !trainer || !date || !time) return;
    setSaving(true);
    const ref = `HOS-${Math.floor(4000 + Math.random() * 5000)}`;
    const ok = await createBooking({
      ref,
      session_date: date,
      start_time: time,
      duration_min: type.duration,
      trainer_id: trainer.id,
      trainer_name: trainer.name,
      session_type: type.name,
      location: type.id === "hyrox" ? "Performance Bay" : "Studio Floor 2",
      notes: null,
    });
    setSaving(false);
    if (ok) {
      setConfirm(false);
      setToast(`Booked — ${ref}`);
      reset();
      navigate("/sessions");
    }
  };

  /* ------------------------------------------------------------ step one */
  if (!typeId) {
    return (
      <Screen>
        <PageHead
          eyebrow="Step 1 of 3"
          title="What kind of session?"
          sub="1:1 is the default. Duo and HYROX group are lower cost per session."
        />
        <ul className="space-y-3">
          {SESSION_TYPES.map((t, i) => (
            <li key={t.id} className="anim-rise" style={{ animationDelay: `${i * 60}ms` }}>
              <button
                type="button"
                onClick={() => {
                  setTypeId(t.id);
                  setTrainerId(null);
                  setDate(null);
                  setTime(null);
                }}
                className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-gold/35 active:scale-[0.99]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
                  {t.id === "duo" ? <Users size={18} /> : t.id === "hyrox" ? <ShieldCheck size={18} /> : <CalendarCheck size={18} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium text-fog">{t.name}</span>
                  <span className="mt-0.5 block truncate text-[12px] text-mist">{t.blurb}</span>
                  <span className="mt-1.5 flex items-center gap-2 text-[11px] text-mist/80">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {t.duration} min
                    </span>
                    {t.capacity > 1 ? (
                      <span className="flex items-center gap-1">
                        <Users size={11} /> max {t.capacity}
                      </span>
                    ) : null}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-cond text-[17px] font-semibold tabular-nums text-gold">
                    {inr(t.price)}
                  </span>
                  <ChevronRight size={16} className="ml-auto mt-1 text-mist" />
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 rounded-2xl border border-white/8 bg-white/[0.025] p-4 text-[12px] leading-relaxed text-mist">
          Deduction follows the studio rule you have on file: a session is deducted on completion,
          not on booking. No-shows are charged per the cancellation policy.
        </p>
      </Screen>
    );
  }

  /* ------------------------------------------------------------ step two */
  if (!trainerId) {
    return (
      <Screen onBack={reset} backLabel="Back to session types">
        <PageHead
          eyebrow="Step 2 of 3"
          title="Choose your coach"
          sub="Your assigned coach is highlighted. You can book anyone with availability."
        />
        <ul className="space-y-3">
          {TRAINERS.map((t, i) => (
            <li key={t.id} className="anim-rise" style={{ animationDelay: `${i * 55}ms` }}>
              <button
                type="button"
                onClick={() => {
                  setTrainerId(t.id);
                  setDate(null);
                  setTime(null);
                }}
                className="flex w-full items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-gold/35 active:scale-[0.99]"
              >
                <Avatar initials={t.initials} accent={t.accent} size={48} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] font-medium text-fog">{t.name}</span>
                    {t.isAssigned ? <Tag tone="gold">Your coach</Tag> : null}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-mist">{t.title}</span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {t.specialty.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-mist"
                      >
                        {s}
                      </span>
                    ))}
                  </span>
                  <span className="mt-2 flex items-center gap-3 text-[11px] text-mist/80">
                    <span>{t.rating} ★</span>
                    <span>{t.sessions.toLocaleString("en-IN")} sessions</span>
                  </span>
                </span>
                <ChevronRight size={17} className="mt-1 shrink-0 text-mist" />
              </button>
            </li>
          ))}
        </ul>
      </Screen>
    );
  }

  /* ---------------------------------------------------------- step three */
  return (
    <Screen onBack={() => setTrainerId(null)} backLabel="Back to coaches">
      <PageHead
        eyebrow="Step 3 of 3"
        title="Pick a slot"
        sub={`${trainer?.name} · ${type?.name} · next 14 days`}
      />

      <p className="eyebrow mb-2 text-mist/70">Date</p>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {days.map((d) => {
          const dt = fromISO(d);
          const active = date === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDate(d);
                setTime(null);
              }}
              className={cn(
                "flex w-[58px] shrink-0 flex-col items-center gap-1 rounded-2xl border py-3 transition-all",
                active
                  ? "border-gold bg-gold/15 text-gold-soft"
                  : "border-white/10 bg-white/[0.03] text-mist hover:border-white/20",
              )}
            >
              <span className="text-[10px] tracking-wide">
                {d === todayISO() ? "TODAY" : DAYS[dt.getDay()].toUpperCase()}
              </span>
              <span className="font-cond text-[22px] font-semibold leading-none tabular-nums">
                {dt.getDate()}
              </span>
              <span className="text-[10px]">{MONTHS[dt.getMonth()]}</span>
            </button>
          );
        })}
      </div>

      <p className="eyebrow mb-2 mt-6 text-mist/70">Time</p>
      {!date ? (
        <p className="py-6 text-center text-[13px] text-mist">Select a date to see availability.</p>
      ) : slots.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-mist">
          {trainer?.name} is not working on this day. Try another date.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2.5">
          {slots.map((s) => {
            const clash =
              bookings.some(
                (b) =>
                  b.status === "booked" &&
                  b.trainer_id === trainerId &&
                  b.session_date === date &&
                  b.start_time === s,
              ) ||
              bookings.some(
                (b) => b.status === "booked" && b.session_date === date && b.start_time === s,
              );
            const active = time === s;
            return (
              <button
                key={s}
                type="button"
                disabled={clash}
                onClick={() => setTime(s)}
                className={cn(
                  "h-12 rounded-xl border font-cond text-[15px] tabular-nums transition-all",
                  clash
                    ? "cursor-not-allowed border-white/6 bg-white/[0.015] text-mist/30 line-through"
                    : active
                      ? "border-gold bg-gold/15 text-gold-soft"
                      : "border-white/10 bg-white/[0.03] text-fog hover:border-gold/35",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}

      {conflict && time ? (
        <Surface className="mt-5 border-rust/35 bg-rust/10 p-4">
          <p className="text-[13px] font-medium text-[#e8a58c]">Slot already taken</p>
          <p className="mt-1 text-[12px] leading-relaxed text-mist">
            Double bookings are blocked automatically. Pick another time to continue.
          </p>
        </Surface>
      ) : null}

      <Surface className="mt-6 p-4">
        <p className="eyebrow text-mist/70">Summary</p>
        <dl className="mt-2.5 space-y-2 text-[13px]">
          <Row k="Session" v={type?.name ?? "—"} />
          <Row k="Coach" v={trainer?.name ?? "—"} />
          <Row k="When" v={date ? `${daysLabel(date, todayISO())} · ${time ?? "--:--"}` : "Pick a slot"} />
          <Row k="Location" v={type?.id === "hyrox" ? "Performance Bay" : "Studio Floor 2"} />
          <Row k="Duration" v={`${type?.duration} min`} />
        </dl>
        <div className="mt-3 flex items-baseline justify-between border-t border-white/8 pt-3">
          <span className="text-[13px] text-mist">Charged on completion</span>
          <span className="font-cond text-[20px] font-semibold tabular-nums text-gold">
            {inr(type?.price ?? 0)}
          </span>
        </div>
      </Surface>

      <div className="mt-5 flex gap-3">
        <Button variant="secondary" size="lg" onClick={reset} className="flex-1">
          <ArrowLeft size={16} /> Change
        </Button>
        <Button
          size="lg"
          className="flex-[2]"
          disabled={!time || conflict}
          onClick={() => setConfirm(true)}
        >
          Review booking
        </Button>
      </div>

      <Sheet
        open={confirm}
        onClose={() => setConfirm(false)}
        eyebrow="Confirm"
        title="Lock in this session"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" size="lg" onClick={() => setConfirm(false)} className="flex-1">
              Not yet
            </Button>
            <Button size="lg" className="flex-[2]" onClick={submit} disabled={saving}>
              {saving ? "Confirming…" : "Confirm booking"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3.5 rounded-2xl border border-gold/25 bg-gold/[0.07] p-4">
            {trainer ? <Avatar initials={trainer.initials} accent={trainer.accent} size={46} /> : null}
            <div className="min-w-0">
              <p className="truncate text-[15px] font-medium text-fog">{trainer?.name}</p>
              <p className="truncate text-[12px] text-mist">{type?.name}</p>
            </div>
          </div>
          <dl className="space-y-2.5 text-[13px]">
            <Row k="Date" v={date ? `${daysLabel(date, todayISO())}, ${date}` : "—"} />
            <Row k="Time" v={`${time} · ${type?.duration} min`} />
            <Row
              k="Location"
              v={type?.id === "hyrox" ? "Performance Bay" : "Studio Floor 2"}
              icon={<MapPin size={12} />}
            />
            <Row k="Amount" v={inr(type?.price ?? 0)} strong />
          </dl>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[12px] leading-relaxed text-mist">
              <Check size={12} className="mr-1 inline text-sage" />
              Free reschedule up to 12 hours before. Inside that window the session is deducted.
              You'll get a reminder the morning of your session.
            </p>
          </div>
        </div>
      </Sheet>

      <Toast message={toast} onDone={() => setToast(null)} />
    </Screen>
  );
}

/* ------------------------------------------------------------------ parts */

function Row({
  k,
  v,
  strong,
  icon,
}: {
  k: string;
  v: string;
  strong?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="shrink-0 text-mist">{k}</dt>
      <dd
        className={cn(
          "flex items-center gap-1.5 truncate text-right",
          strong ? "font-cond text-[17px] tabular-nums text-gold" : "text-fog",
        )}
      >
        {icon}
        {v}
      </dd>
    </div>
  );
}

export function SessionList() {
  const navigate = useNavigate();
  const { bookings, isLogged, toggleLog } = useStore();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const today = todayISO();

  const upcoming = bookings
    .filter((b) => b.status === "booked" && b.session_date >= today)
    .sort((a, b) =>
      a.session_date === b.session_date
        ? a.start_time.localeCompare(b.start_time)
        : a.session_date.localeCompare(b.session_date),
    );
  const past = bookings
    .filter((b) => !(b.status === "booked" && b.session_date >= today))
    .sort((a, b) =>
      a.session_date === b.session_date
        ? b.start_time.localeCompare(a.start_time)
        : b.session_date.localeCompare(a.session_date),
    );

  const list = tab === "upcoming" ? upcoming : past;
  const totalRemaining = Math.max(0, 11 + 2 - 11);

  return (
    <Screen>
      <PageHead
        eyebrow="My sessions"
        title="Schedule & history"
        sub={`${totalRemaining} sessions remaining in your package`}
      />

      <div className="mb-4 flex gap-2">
        <Chip active={tab === "upcoming"} onClick={() => setTab("upcoming")}>
          Upcoming ({upcoming.length})
        </Chip>
        <Chip active={tab === "past"} onClick={() => setTab("past")}>
          History ({past.length})
        </Chip>
      </div>

      {list.length === 0 ? (
        <Empty
          title="Nothing here yet"
          body={
            tab === "upcoming"
              ? "Book a session and it will appear here with reminders."
              : "Completed, cancelled and no-show sessions are archived here."
          }
          action={
            tab === "upcoming" ? (
              <Button size="sm" onClick={() => navigate("/book")}>
                Book a session
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ul className="space-y-2.5">
          {list.map((b) => {
            const key = `done-${b.id}`;
            return (
              <li key={b.id} className="anim-rise">
                <button
                  type="button"
                  onClick={() => navigate(`/session/${b.id}`)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-gold/25"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-fog">
                        {b.start_time} · {b.session_type}
                      </p>
                      <p className="mt-0.5 text-[12px] text-mist">
                        {b.trainer_name} · {b.location}
                      </p>
                    </div>
                    <StatusTag status={b.status} />
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3">
                    <span className="text-[12px] text-mist">
                      {fmtWhen(b.session_date, today)} · {b.duration_min} min
                    </span>
                    <span className="font-cond text-[12px] tracking-widest text-mist/70">
                      {b.ref}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Screen>
  );
}

export function StatusTag({ status }: { status: string }) {
  const map: Record<string, { label: string; tone: "gold" | "sage" | "rust" | "neutral" }> = {
    booked: { label: "Confirmed", tone: "gold" },
    completed: { label: "Completed", tone: "sage" },
    cancelled: { label: "Cancelled", tone: "neutral" },
    no_show: { label: "No-show", tone: "rust" },
  };
  const m = map[status] ?? { label: status, tone: "neutral" as const };
  return <Tag tone={m.tone}>{m.label}</Tag>;
}

function fmtWhen(iso: string, today: string): string {
  const d = fromISO(iso);
  const base = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  if (iso === today) return `Today · ${base}`;
  return base;
}
