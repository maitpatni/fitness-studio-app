import { useState } from "react";
import { useNavigate } from "../lib/router";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Download,
  HelpCircle,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { Button, SectionTitle, Sheet, Surface, Tag, Toast } from "../components/ui";
import { PageHead, Reveal, Screen } from "../components/shell";
import { useStore } from "../lib/store";
import { NOTIFICATIONS, STUDIO, TRAINERS } from "../lib/hos-data";
import { cn } from "../lib/utils";

const TABS = ["Bell", "User", "Settings"] as const;

export function Profile() {
  const navigate = useNavigate();
  const { onboarding, signOut, bookings, checkIns } = useStore();
  const [sheet, setSheet] = useState<null | "edit" | "help" | "privacy">(null);
  const [toast, setToast] = useState<string | null>(null);
  const [prefs, setPrefs] = useState({ reminders: true, marketing: false, whatsapp: true });

  const trainer = TRAINERS.find((t) => t.isAssigned);
  const name = onboarding.name || "Rhea Kapoor";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Screen>
      <PageHead eyebrow="Profile" title={name} sub={`${trainer?.name ?? "Arjun Mehta"} · since Aug 2026`} />

      {/* ------------------------------------------------------- identity */}
      <Reveal>
        <Surface className="p-4">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-gold/30 bg-gradient-to-br from-violet-soft/60 to-white font-cond text-[22px] tracking-widest text-gold">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[17px] font-semibold text-fog">{name}</p>
              <p className="mt-0.5 truncate text-[12px] text-mist">
                {onboarding.phone ? `+91 ${onboarding.phone}` : "+91 98765 43210"}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Tag tone="gold">{onboarding.experience || "Active member"}</Tag>
                {onboarding.goals.slice(0, 2).map((g) => (
                  <Tag key={g}>{g}</Tag>
                ))}
              </div>
            </div>
            <button
              type="button"
              aria-label="Edit profile"
              onClick={() => setSheet("edit")}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-violet-line bg-violet-wash text-violet-deep"
            >
              <Settings size={15} />
            </button>
          </div>
        </Surface>
      </Reveal>

      {/* --------------------------------------------------------- stats */}
      <Reveal delay={60}>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <Mini label="Sessions" value={String(bookings.filter((b) => b.status === "completed").length)} />
          <Mini label="Check-ins" value={String(checkIns.length)} />
          <Mini label="Goals" value={String(onboarding.goals.length)} />
        </div>
      </Reveal>

      {/* ---------------------------------------------------------- menu */}
      <div className="mt-7">
        <SectionTitle eyebrow="Account" title="Settings" />
        <Surface className="divide-y divide-violet-line">
          <Row icon={<User size={15} />} k="Personal details" onClick={() => setSheet("edit")} />
          <Row icon={<ShieldCheck size={15} />} k="Health & readiness" sub="Visible to your coach only" onClick={() => setSheet("privacy")} />
          <Row icon={<CreditCard size={15} />} k="Membership & payments" onClick={() => navigate("/membership")} />
          <Row icon={<Download size={15} />} k="Export my data" onClick={() => setToast("Export request queued — check your email")} />
        </Surface>
      </div>

      <div className="mt-6">
        <SectionTitle eyebrow="Preferences" title="Notifications" />
        <Surface className="divide-y divide-violet-line">
          {[
            { k: "Session reminders", v: "Two hours before each booked session", key: "reminders" as const },
            { k: "WhatsApp updates", v: "Confirmations, reschedules and receipts", key: "whatsapp" as const },
            { k: "Offers & events", v: "Workshops, challenges and new programmes", key: "marketing" as const },
          ].map((row) => (
            <button
              key={row.k}
              type="button"
              onClick={() => setPrefs((p) => ({ ...p, [row.key]: !p[row.key] }))}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-violet-line bg-violet-wash text-violet-deep">
                <Bell size={14} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] text-fog">{row.k}</span>
                <span className="mt-0.5 block truncate text-[12px] text-mist">{row.v}</span>
              </span>
              <span
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  prefs[row.key] ? "bg-gold" : "bg-violet-line",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all",
                    prefs[row.key] ? "left-[22px]" : "left-0.5",
                  )}
                />
              </span>
            </button>
          ))}
        </Surface>
      </div>

      <div className="mt-6">
        <SectionTitle eyebrow="Studio" title="Find us" />
        <Surface className="space-y-3 p-4">
          <a href={`tel:${STUDIO.phone.replace(/\s/g, "")}`} className="flex items-start gap-3">
            <MapPin size={15} className="mt-0.5 shrink-0 text-gold" />
            <span className="min-w-0">
              <span className="block text-[14px] text-fog">{STUDIO.address}</span>
              <span className="mt-0.5 block text-[12px] text-mist">{STUDIO.hours}</span>
            </span>
          </a>
          <a href={`tel:${STUDIO.phone.replace(/\s/g, "")}`} className="flex items-center gap-3">
            <Phone size={15} className="shrink-0 text-gold" />
            <span className="text-[14px] text-fog">{STUDIO.phone}</span>
          </a>
          <a href={`mailto:${STUDIO.email}`} className="flex items-center gap-3">
            <Mail size={15} className="shrink-0 text-gold" />
            <span className="text-[14px] text-fog">{STUDIO.email}</span>
          </a>
        </Surface>
      </div>

      <Button
        variant="secondary"
        size="lg"
        full
        className="mt-6"
        onClick={() => {
          signOut();
          navigate("/login", { replace: true });
        }}
      >
        <LogOut size={16} /> Sign out
      </Button>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-mist/50">
        House of Santè · Version 1.0
        <br />
        Your data belongs to you and to the studio.
      </p>

      {/* --------------------------------------------------------- sheets */}
      <EditSheet open={sheet === "edit"} onClose={() => setSheet(null)} />
      <Sheet
        open={sheet === "privacy"}
        onClose={() => setSheet(null)}
        eyebrow="Restricted"
        title="Health & readiness"
      >
        <div className="space-y-4">
          <div>
            <p className="eyebrow mb-2 text-mist/70">Goals</p>
            <div className="flex flex-wrap gap-2">
              {(onboarding.goals.length ? onboarding.goals : ["Not set"]).map((g) => (
                <Tag key={g} tone="gold">
                  {g}
                </Tag>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-2 text-mist/70">Training preferences</p>
            <div className="flex flex-wrap gap-2">
              {(onboarding.prefs.length ? onboarding.prefs : ["Not set"]).map((p) => (
                <Tag key={p}>{p}</Tag>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-2 text-mist/70">Health flags</p>
            <div className="flex flex-wrap gap-2">
              {(onboarding.health.length ? onboarding.health : ["None recorded"]).map((h) => (
                <Tag key={h} tone="rust">
                  {h}
                </Tag>
              ))}
            </div>
          </div>
          <p className="rounded-xl border border-sage/25 bg-sage/[0.07] p-3.5 text-[12px] leading-relaxed text-sage">
            Only {trainer?.name ?? "your coach"} and authorised staff can read this. It is never
            shown to other members.
          </p>
        </div>
      </Sheet>

      <Toast message={toast} onDone={() => setToast(null)} />
    </Screen>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-violet-line bg-white p-3 text-center shadow-[0_1px_2px_rgba(45,20,90,0.04)]">
      <p className="font-cond text-[24px] font-semibold leading-none tabular-nums text-gold">
        {value}
      </p>
      <p className="mt-1 text-[10px] text-mist/90">{label}</p>
    </div>
  );
}

function Row({
  icon,
  k,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  k: string;
  sub?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 p-4 text-left">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-violet-line bg-violet-wash text-violet-deep">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] text-fog">{k}</span>
        {sub ? <span className="mt-0.5 block truncate text-[11px] text-mist">{sub}</span> : null}
      </span>
      <ChevronRight size={16} className="shrink-0 text-mist" />
    </button>
  );
}

function EditSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { onboarding, saveOnboarding } = useStore();
  const [name, setName] = useState(onboarding.name);
  const [phone, setPhone] = useState(onboarding.phone);
  const [email, setEmail] = useState(onboarding.email);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow="Account"
      title="Personal details"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" size="lg" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={() => {
              saveOnboarding({ ...onboarding, name, phone, email });
              onClose();
              setToast("Details updated");
            }}
          >
            Save
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <label className="block">
          <span className="eyebrow mb-1.5 block text-mist/70">Full name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-xl border border-violet-line bg-white px-4 text-[15px] text-fog outline-none focus:border-violet-mid focus:ring-4 focus:ring-violet-wash"
          />
        </label>
        <label className="block">
          <span className="eyebrow mb-1.5 block text-mist/70">Mobile</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            className="h-12 w-full rounded-xl border border-violet-line bg-white px-4 text-[15px] text-fog outline-none focus:border-violet-mid focus:ring-4 focus:ring-violet-wash"
          />
        </label>
        <label className="block">
          <span className="eyebrow mb-1.5 block text-mist/70">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl border border-violet-line bg-white px-4 text-[15px] text-fog outline-none focus:border-violet-mid focus:ring-4 focus:ring-violet-wash"
          />
        </label>
      </div>
      <Toast message={toast} onDone={() => setToast(null)} />
    </Sheet>
  );
}

/* --------------------------------------------------------- notifications */

export function Notifications() {
  const navigate = useNavigate();
  return (
    <Screen onBack={() => navigate(-1)} backLabel="Back">
      <PageHead eyebrow="Inbox" title="Notifications" sub="Reminders, programme updates and studio news." />
      <ul className="space-y-2.5">
        {NOTIFICATIONS.map((n, i) => (
          <li key={n.id} className="anim-rise" style={{ animationDelay: `${i * 55}ms` }}>
            <Surface className="flex items-start gap-3 p-4">
              <span
                className={cn(
                  "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                  n.kind === "reminder" && "bg-gold",
                  n.kind === "record" && "bg-sage",
                  n.kind === "payment" && "bg-rust",
                  (n.kind === "program" || n.kind === "announcement") && "bg-violet-soft",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-fog">{n.title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-mist">{n.body}</p>
              </div>
              <span className="shrink-0 text-[10px] text-mist/70">{n.time}</span>
            </Surface>
          </li>
        ))}
      </ul>
    </Screen>
  );
}

/* ------------------------------------------------------------------ help */

export function Help() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const faqs = [
    { q: "When is a session deducted?", a: "On completion, not on booking. Reschedules more than 12 hours ahead are always free." },
    { q: "Can I book any coach?", a: "Yes — you can book any coach with availability, though your programme is written by your assigned coach." },
    { q: "How do I freeze my package?", a: "Request it from reception. Freezes are up to 14 days per year and need admin approval." },
    { q: "Who can see my progress photos?", a: "Only you and your assigned coach. They are never shown to other members or on studio screens." },
    { q: "What if my coach cancels?", a: "You are never charged. Pick a new slot from the app and your balance stays untouched." },
  ];
  const filtered = faqs.filter((f) =>
    `${f.q} ${f.a}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Screen onBack={() => navigate(-1)} backLabel="Back">
      <PageHead eyebrow="Support" title="How can we help?" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search help topics"
        className="mb-5 h-12 w-full rounded-xl border border-violet-line bg-white px-4 text-[15px] text-fog outline-none placeholder:text-mist/50 focus:border-violet-mid focus:ring-4 focus:ring-violet-wash"
      />
      <ul className="space-y-2.5">
        {filtered.map((f) => (
          <li key={f.q}>
            <details className="group rounded-2xl border border-violet-line bg-white p-4">
              <summary className="flex cursor-pointer list-none items-center gap-3 text-[14px] text-fog">
                <HelpCircle size={15} className="shrink-0 text-gold" />
                <span className="min-w-0 flex-1">{f.q}</span>
                <ChevronRight
                  size={15}
                  className="shrink-0 text-mist transition-transform group-open:rotate-90"
                />
              </summary>
              <p className="mt-2.5 pl-6 text-[12px] leading-relaxed text-mist">{f.a}</p>
            </details>
          </li>
        ))}
      </ul>
      <Surface className="mt-6 p-4">
        <p className="eyebrow text-mist/70">Still stuck?</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-mist">
          Call reception on {STUDIO.phone} or message us on WhatsApp — we answer between 6 AM and
          9 PM.
        </p>
      </Surface>
    </Screen>
  );
}

export { TABS, X };
