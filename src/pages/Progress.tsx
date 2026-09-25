import { useMemo, useState } from "react";
import {
  Camera,
  Gauge,
  Plus,
  Ruler,
  Sparkles,
  Target,
  Trash2,
  TrendingDown,
  Trophy,
} from "lucide-react";
import {
  Button,
  Chip,
  Empty,
  LineChart,
  SectionTitle,
  Sheet,
  Stepper,
  Surface,
  Tag,
  Toast,
} from "../components/ui";
import { PageHead, Reveal, Screen } from "../components/shell";
import { fmtDate, todayISO, useStore } from "../lib/store";
import { MEASUREMENT_FIELDS } from "../lib/hos-data";
import { cn } from "../lib/utils";

export function Progress() {
  const { progress, records, addProgress, deleteProgress, addRecord, deleteRecord } = useStore();
  const [tab, setTab] = useState<"trend" | "measure" | "pr" | "hyrox">("trend");
  const [addMeasure, setAddMeasure] = useState(false);
  const [addPr, setAddPr] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [del, setDel] = useState<null | { kind: "p" | "r"; id: string; label: string }>(null);

  const first = progress[0];
  const last = progress[progress.length - 1];

  const delta = (key: string) => {
    if (!first || !last) return "—";
    const a = first[key as keyof typeof first] as number | null;
    const b = last[key as keyof typeof last] as number | null;
    if (a === null || b === null) return "—";
    const d = Number(b) - Number(a);
    return `${d > 0 ? "+" : ""}${d.toFixed(1)}`;
  };

  return (
    <Screen>
      <PageHead
        eyebrow="My progress"
        title="The work is showing"
        sub="Since your day-one assessment · 11 weeks"
        right={<Trophy size={20} className="mt-2 text-gold" />}
      />

      <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4">
        <Chip active={tab === "trend"} onClick={() => setTab("trend")}>
          Overview
        </Chip>
        <Chip active={tab === "measure"} onClick={() => setTab("measure")}>
          Measurements
        </Chip>
        <Chip active={tab === "pr"} onClick={() => setTab("pr")}>
          PRs
        </Chip>
        <Chip active={tab === "hyrox"} onClick={() => setTab("hyrox")}>
          HYROX
        </Chip>
      </div>

      {tab === "trend" ? <Overview delta={delta} /> : null}
      {tab === "measure" ? (
        <Measurements onAdd={() => setAddMeasure(true)} onDelete={(id, label) => setDel({ kind: "p", id, label })} />
      ) : null}
      {tab === "pr" ? (
        <Records onAdd={() => setAddPr(true)} onDelete={(id, label) => setDel({ kind: "r", id, label })} />
      ) : null}
      {tab === "hyrox" ? <Hyrox /> : null}

      {/* ------------------------------------------------- add measurement */}
      <AddSheet
        open={addMeasure}
        onClose={() => setAddMeasure(false)}
        title="Log measurements"
        eyebrow="New entry"
        confirmLabel="Save entry"
        onSave={async (values, notes) => {
          await addProgress({
            recorded_at: todayISO(),
            weight_kg: num(values.weight_kg),
            body_fat_pct: num(values.body_fat_pct),
            waist_cm: num(values.waist_cm),
            chest_cm: num(values.chest_cm),
            arm_cm: num(values.arm_cm),
            thigh_cm: num(values.thigh_cm),
            notes: notes || null,
          });
          setAddMeasure(false);
          setToast("Measurements saved");
        }}
      />

      {/* ------------------------------------------------------- add a PR */}
      <AddSheet
        open={addPr}
        onClose={() => setAddPr(false)}
        title="Log a personal record"
        eyebrow="Strength"
        confirmLabel="Save record"
        onSave={async (values, notes) => {
          const movement = notes?.trim() || "Custom lift";
          const unit = /time|min|row|run/i.test(movement) ? "sec" : "kg";
          await addRecord({
            movement,
            value: num(values.weight_kg) ?? 0,
            unit,
            recorded_at: todayISO(),
          });
          setAddPr(false);
          setToast("Record saved");
        }}
      />

      {/* --------------------------------------------------------- delete */}
      <Sheet
        open={del !== null}
        onClose={() => setDel(null)}
        eyebrow="Confirm"
        title="Delete this entry?"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" size="lg" onClick={() => setDel(null)} className="flex-1">
              Keep it
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="flex-1"
              onClick={async () => {
                if (del?.kind === "p") await deleteProgress(del.id);
                else if (del?.kind === "r") await deleteRecord(del.id);
                setDel(null);
                setToast("Entry deleted");
              }}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-[14px] leading-relaxed text-mist">
          <span className="text-fog">{del?.label}</span> will be removed from your charts. The
          deletion is recorded in your audit trail.
        </p>
      </Sheet>

      <Toast message={toast} onDone={() => setToast(null)} />
    </Screen>
  );
}

function num(v: string | undefined): number | null {
  if (v === undefined || v.trim() === "") return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

/* --------------------------------------------------------------- overview */

function Overview({ delta }: { delta: (k: string) => string }) {
  const { progress } = useStore();
  if (progress.length < 2) {
    return <Empty title="Not enough data yet" body="Log at least two entries to see your trend lines." />;
  }
  const labels = progress.map((p) => fmtDate(p.recorded_at).split(" ")[0] + " " + fmtDate(p.recorded_at).split(" ")[1]);

  return (
    <div className="space-y-5">
      <Reveal>
        <div className="grid grid-cols-2 gap-3">
          <HeadlineCard
            label="Body weight"
            value={`${Number(progress[progress.length - 1].weight_kg)} kg`}
            delta={delta("weight_kg")}
            good
            icon={<Gauge size={14} />}
            accent="#ff8a5c"
          />
          <HeadlineCard
            label="Body fat"
            value={`${Number(progress[progress.length - 1].body_fat_pct)}%`}
            delta={delta("body_fat_pct")}
            good
            icon={<Target size={14} />}
            accent="#5b8def"
          />
        </div>
      </Reveal>

      <Reveal delay={70}>
        <Surface className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="eyebrow text-mist/70">Body weight</p>
            <span className="text-[11px] text-mist">kg</span>
          </div>
          <LineChart
            values={progress.map((p) => Number(p.weight_kg))}
            labels={labels}
            unit="kg"
            accent="#ff8a5c"
          />
        </Surface>
      </Reveal>

      <Reveal delay={110}>
        <Surface className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="eyebrow text-mist/70">Body fat</p>
            <span className="text-[11px] text-mist">%</span>
          </div>
          <LineChart
            values={progress.map((p) => Number(p.body_fat_pct))}
            labels={labels}
            unit="%"
            accent="#5b8def"
            invert
          />
        </Surface>
      </Reveal>

      <Reveal delay={150}>
        <Surface className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="eyebrow text-mist/70">Waist</p>
            <span className="text-[11px] text-mist">cm</span>
          </div>
          <LineChart
            values={progress.map((p) => Number(p.waist_cm))}
            labels={labels}
            unit="cm"
            accent="#9aa3af"
            invert
          />
        </Surface>
      </Reveal>

      <Reveal delay={190}>
        <Surface className="p-4">
          <p className="eyebrow text-mist/70">Measurements</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {MEASUREMENT_FIELDS.filter((f) => f.key !== "weight_kg" && f.key !== "body_fat_pct").map(
              (f) => (
                <div key={f.key} className="flex items-baseline justify-between border-b border-white/6 pb-2">
                  <span className="text-[12px] text-mist">{f.label}</span>
                  <span className="font-cond text-[15px] tabular-nums text-fog">
                    {progress[progress.length - 1][f.key] ? Number(progress[progress.length - 1][f.key]) : "—"}
                    <span className="ml-0.5 text-[10px] text-mist">{f.unit}</span>
                  </span>
                </div>
              ),
            )}
          </div>
        </Surface>
      </Reveal>
    </div>
  );
}

function HeadlineCard({
  label,
  value,
  delta: d,
  good,
  icon,
  accent,
}: {
  label: string;
  value: string;
  delta: string;
  good?: boolean;
  icon: React.ReactNode;
  accent: string;
}) {
  const isDown = d.trim().startsWith("-");
  return (
    <Surface className="p-4">
      <p className="flex items-center gap-1.5 text-[11px] text-mist/80">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 font-cond text-[30px] font-semibold leading-none tabular-nums" style={{ color: accent }}>
        {value}
      </p>
      <p className={cn("mt-1.5 flex items-center gap-1 text-[12px]", good ? "text-sage" : "text-mist")}>
        <TrendingDown size={12} className={isDown ? "" : "scale-x-[-1]"} />
        {d} from day one
      </p>
    </Surface>
  );
}

/* ----------------------------------------------------------- measurements */

function Measurements({
  onAdd,
  onDelete,
}: {
  onAdd: () => void;
  onDelete: (id: string, label: string) => void;
}) {
  const { progress } = useStore();
  const rows = [...progress].sort((a, b) => b.recorded_at.localeCompare(a.recorded_at));

  return (
    <div>
      <Button size="md" full onClick={onAdd}>
        <Plus size={16} /> Log today&apos;s measurements
      </Button>
      <SectionTitle eyebrow="History" title="Every entry" />
      {rows.length === 0 ? (
        <Empty title="No measurements yet" body="Log your first entry to start tracking." />
      ) : (
        <ul className="space-y-2.5">
          {rows.map((p) => (
            <li key={p.id}>
              <Surface className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-medium text-fog">{fmtDate(p.recorded_at)}</p>
                    <p className="mt-0.5 text-[12px] text-mist">
                      {p.notes ?? "No note"}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Delete entry"
                    onClick={() => onDelete(p.id, fmtDate(p.recorded_at))}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-mist transition-colors hover:border-rust/50 hover:text-rust"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {MEASUREMENT_FIELDS.map((f) => (
                    <div key={f.key} className="rounded-lg neu-sunken p-2 text-center">
                      <p className="text-[9px] tracking-wide text-mist/80">{f.label}</p>
                      <p className="mt-0.5 font-cond text-[14px] tabular-nums text-fog">
                        {p[f.key] === null ? "—" : Number(p[f.key])}
                        <span className="ml-0.5 text-[9px] text-mist">{f.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </Surface>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- records */

function Records({ onAdd, onDelete }: { onAdd: () => void; onDelete: (id: string, label: string) => void }) {
  const { records } = useStore();

  const best = useMemo(() => {
    const map = new Map<string, { value: number; unit: string; date: string; id: string; count: number }>();
    records.forEach((r) => {
      const cur = map.get(r.movement);
      if (!cur) map.set(r.movement, { value: Number(r.value), unit: r.unit, date: r.recorded_at, id: r.id, count: 1 });
      else {
        cur.count += 1;
        const better = r.unit === "min" ? Number(r.value) < cur.value : Number(r.value) > cur.value;
        if (better) {
          cur.value = Number(r.value);
          cur.date = r.recorded_at;
          cur.id = r.id;
        }
      }
    });
    return [...map.entries()].sort((a, b) => b[1].value - a[1].value);
  }, [records]);

  return (
    <div>
      <Button size="md" full onClick={onAdd}>
        <Plus size={16} /> Log a record
      </Button>
      <SectionTitle eyebrow="Personal bests" title="Strongest to date" />
      {best.length === 0 ? (
        <Empty title="No records yet" body="Log your first lift to start a personal-best tracker." />
      ) : (
        <ul className="space-y-2.5">
          {best.map(([movement, v], i) => (
            <li key={movement}>
              <Surface className="flex items-center gap-3.5 p-4">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-cond text-[14px] tabular-nums"
                  style={{
                    color: i === 0 ? "#ff6b3d" : "#a2a29d",
                    background: i === 0 ? "rgba(212,180,131,0.14)" : "rgba(255,255,255,0.05)",
                  }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-fog">{movement}</p>
                  <p className="mt-0.5 text-[11px] text-mist">
                    {fmtDate(v.date)} · {v.count} entries
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="font-cond text-[19px] font-semibold tabular-nums text-gold">
                    {v.value}
                    <span className="ml-0.5 text-[11px] text-mist">{v.unit}</span>
                  </span>
                  <button
                    type="button"
                    aria-label={`Delete latest ${movement} record`}
                    onClick={() => onDelete(v.id, movement)}
                    className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-mist transition-colors hover:border-rust/50 hover:text-rust"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </Surface>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ HYROX */

const HYROX = [
  { name: "Running", current: 2930, best: 2885, unit: "m", delta: "-45s" },
  { name: "SkiErg", current: 278, best: 262, unit: "m", delta: "-16s" },
  { name: "Sled Push", current: 412, best: 400, unit: "m", delta: "-12s" },
  { name: "Sled Pull", current: 508, best: 505, unit: "m", delta: "-3s" },
  { name: "Burpee Broad Jump", current: 14, best: 16, unit: "m", delta: "+2 m" },
  { name: "Rowing", current: 431, best: 420, unit: "m", delta: "-11s" },
  { name: "Farmer's Carry", current: 50, best: 50, unit: "m", delta: "on target" },
  { name: "Lunges", current: 82, best: 88, unit: "reps", delta: "+6 reps" },
  { name: "Wall Balls", current: 102, best: 110, unit: "reps", delta: "+8 reps" },
];

function Hyrox() {
  const [event, setEvent] = useState(0);
  const events = ["Championship Mumbai · Mar 2027", "Signature Race · Jan 2027", "Pune 15K · Finished 1:02:41"];

  return (
    <div className="space-y-4">
      <Reveal>
        <Surface className="grain relative overflow-hidden p-5">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(140deg, rgba(212,180,131,0.16), transparent 60%)" }}
          />
          <div className="relative">
            <p className="eyebrow text-gold">Race target</p>
            <p className="mt-1.5 font-display text-[19px] font-semibold text-fog">54:20 finish</p>
            <p className="mt-1 text-[12px] leading-relaxed text-mist">
              You're 11:21 off pace on your last benchmark. 14 weeks out.
            </p>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {events.map((e, i) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEvent(i)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                    event === i
                      ? "border-gold bg-gold/15 text-gold-soft"
                      : "border-white/10 text-mist",
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </Surface>
      </Reveal>

      <Reveal delay={80}>
        <SectionTitle eyebrow="Stations" title="Benchmark vs best" />
        <ul className="space-y-2.5">
          {HYROX.map((m, i) => (
            <li key={m.name} className="anim-rise" style={{ animationDelay: `${i * 45}ms` }}>
              <Surface className="p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-[14px] font-medium text-fog">{m.name}</p>
                  <p className="shrink-0 text-[11px] text-sage">{m.delta}</p>
                </div>
                <div className="mt-2 flex items-baseline gap-4">
                  <div>
                    <p className="text-[9px] tracking-wide text-mist/80">CURRENT</p>
                    <p className="font-cond text-[22px] font-semibold leading-none tabular-nums text-fog">
                      {m.current}
                      <span className="ml-1 text-[11px] text-mist">{m.unit}</span>
                    </p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <p className="text-[9px] tracking-wide text-mist/80">PERSONAL BEST</p>
                    <p className="font-cond text-[22px] font-semibold leading-none tabular-nums text-gold">
                      {m.best}
                      <span className="ml-1 text-[11px] text-mist">{m.unit}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold"
                    style={{
                      width: `${Math.min(100, (m.current / Math.max(m.best, m.current)) * 100)}%`,
                    }}
                  />
                </div>
              </Surface>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

/* -------------------------------------------------------------- add sheet */

function AddSheet({
  open,
  onClose,
  title,
  eyebrow,
  onSave,
  confirmLabel,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow: string;
  onSave: (values: Record<string, string>, notes: string) => Promise<void>;
  confirmLabel: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={title}
      eyebrow={eyebrow}
      footer={
        <Button
          size="lg"
          full
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await onSave(values, note);
            setValues({});
            setNote("");
            setSaving(false);
          }}
        >
          {saving ? "Saving…" : confirmLabel}
        </Button>
      }
    >
      <div className="space-y-3">
        {MEASUREMENT_FIELDS.map((f) => (
          <Stepper
            key={f.key}
            label={f.label}
            unit={f.unit}
            step={f.step}
            value={values[f.key] ?? ""}
            onChange={(v) => set(f.key, v)}
          />
        ))}
        <label className="block">
          <span className="eyebrow mb-1.5 block text-mist/70">
            {title.toLowerCase().includes("record") ? "Movement name" : "Note (optional)"}
          </span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              title.toLowerCase().includes("record") ? "e.g. Front Squat" : "How are you feeling?"
            }
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[15px] text-fog outline-none placeholder:text-mist/45 focus:border-gold/50"
          />
        </label>
      </div>
    </Sheet>
  );
}

export { Camera, Ruler, Sparkles, Tag };
