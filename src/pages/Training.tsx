import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  PlayCircle,
  RotateCcw,
  Sparkles,
  Timer,
} from "lucide-react";
import {
  Button,
  Empty,
  Ring,
  Sheet,
  Surface,
  Tag,
  Toast,
} from "../components/ui";
import { PageHead, Reveal, Screen } from "../components/shell";
import { TODAY_PROGRAMME, isLogged, toggleLog, useStore } from "../lib/store";
import type { Exercise } from "../lib/hos-data";
import { cn } from "../lib/utils";

export function Training() {
  const { isLogged, toggleLog } = useStore();
  const [openEx, setOpenEx] = useState<Exercise | null>(null);
  const [tab, setTab] = useState<"today" | "history">("today");
  const [toast, setToast] = useState<string | null>(null);

  const all = useMemo(
    () => TODAY_PROGRAMME.flatMap((b) => b.exercises.map((e) => ({ block: b, ex: e }))),
    [],
  );
  const doneCount = all.filter(({ ex }) => isLogged(ex.id)).length;
  const pct = Math.round((doneCount / all.length) * 100);
  const totalMin = TODAY_PROGRAMME.reduce((s, b) => s + b.durationMin, 0);

  if (tab === "history") return <TrainingHistory />;

  return (
    <Screen>
      <PageHead
        eyebrow="My training"
        title="Lower strength — week 4"
        sub="Programmed by Arjun Mehta · updated yesterday"
        right={
          <button
            type="button"
            onClick={() => setTab("history")}
            className="rounded-full border border-violet-line bg-violet-wash px-3 py-1.5 text-[12px] text-violet-deep"
          >
            History
          </button>
        }
      />

      {/* ------------------------------------------------------- hero */}
      <Reveal>
        <Surface className="grain relative overflow-hidden p-5">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.28), transparent 70%)" }}
          />
          <div className="relative flex items-center gap-4">
            <Ring value={doneCount} max={all.length} label={`${pct}%`} sub="done" size={92} />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-fog">
                {doneCount === 0
                  ? "Fresh session"
                  : doneCount === all.length
                    ? "Session complete"
                    : "Good work, keep going"}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-mist">
                {all.length} exercises · ~{totalMin} min · 3 blocks
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Tag tone="gold">Strength</Tag>
                <Tag tone="sage">HYROX</Tag>
                <Tag>Mobility</Tag>
              </div>
            </div>
          </div>
        </Surface>
      </Reveal>

      {/* ------------------------------------------------------ blocks */}
      <div className="mt-6 space-y-5">
        {TODAY_PROGRAMME.map((block, bi) => {
          const done = block.exercises.filter((e) => isLogged(e.id)).length;
          return (
            <Reveal key={block.id} delay={80 + bi * 70}>
              <div className="mb-2.5 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[17px] font-semibold tracking-tight text-fog">
                    {block.title}
                  </h2>
                  <p className="mt-0.5 truncate text-[12px] text-mist">{block.focus}</p>
                </div>
                <span className="shrink-0 font-cond text-[12px] tabular-nums text-mist">
                  {done}/{block.exercises.length} · {block.durationMin}m
                </span>
              </div>

              <ul className="space-y-2">
                {block.exercises.map((ex) => {
                  const on = isLogged(ex.id);
                  return (
                    <li key={ex.id}>
                      <div
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border p-3.5 transition-colors",
                          on
                            ? "border-sage/30 bg-sage/[0.07]"
                            : "border-violet-line bg-white",
                        )}
                      >
                        <button
                          type="button"
                          aria-label={on ? `Unmark ${ex.name}` : `Mark ${ex.name} complete`}
                          onClick={() => toggleLog(ex.id)}
                          className={cn(
                            "grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all active:scale-90",
                            on
                              ? "border-sage bg-sage text-white"
                              : "border-violet-line text-transparent",
                          )}
                        >
                          <Check size={14} strokeWidth={3} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenEx(ex)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p
                            className={cn(
                              "truncate text-[14px] font-medium",
                              on ? "text-mist line-through" : "text-fog",
                            )}
                          >
                            {ex.name}
                          </p>
                          <p className="mt-0.5 truncate text-[12px] text-mist">
                            {ex.sets} × {ex.reps} · {ex.load} · rest {ex.rest}
                          </p>
                        </button>
                        <button
                          type="button"
                          aria-label={`Open ${ex.name}`}
                          onClick={() => setOpenEx(ex)}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-violet-line text-mist"
                        >
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          );
        })}
      </div>

      {/* --------------------------------------------------- coach note */}
      <Reveal delay={320}>
        <Surface className="mt-6 border-gold/20 bg-violet-wash p-4">
          <div className="flex items-start gap-3">
            <Sparkles size={16} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="text-[13px] font-medium text-fog">Note from Arjun</p>
              <p className="mt-1 text-[12px] leading-relaxed text-mist">
                Trap bar stays at 80 kg this week — I want five clean reps before we climb. If the
                short-foot split squat feels unstable, drop the dumbbells and own the tempo.
              </p>
            </div>
          </div>
        </Surface>
      </Reveal>

      <Button
        size="lg"
        full
        className="mt-5"
        onClick={() => {
          all.forEach(({ ex }) => {
            if (!isLogged(ex.id)) toggleLog(ex.id);
          });
          setToast("Session marked complete");
        }}
      >
        <Flame size={17} /> Finish session
      </Button>

      {/* ------------------------------------------------- exercise sheet */}
      <Sheet
        open={openEx !== null}
        onClose={() => setOpenEx(null)}
        eyebrow={openEx?.group}
        title={openEx?.name ?? ""}
        footer={
          <Button
            size="lg"
            full
            onClick={() => {
              if (openEx) toggleLog(openEx.id);
              setOpenEx(null);
            }}
          >
            {openEx && isLogged(openEx.id) ? "Mark as not done" : "Mark this set complete"}
          </Button>
        }
      >
        {openEx ? (
          <div className="space-y-4">
            <div className="grid aspect-video place-items-center rounded-2xl border border-violet-line bg-gradient-to-br from-violet-wash to-white">
              <span className="flex flex-col items-center gap-2 text-mist">
                <PlayCircle size={30} strokeWidth={1.4} />
                <span className="text-[11px]">Exercise demo</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Metric label="Sets" value={String(openEx.sets)} />
              <Metric label="Reps" value={openEx.reps} />
              <Metric label="Load" value={openEx.load} />
            </div>
            <div>
              <p className="eyebrow text-mist/70">Coaching cue</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-fog">{openEx.cue}</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-violet-line bg-violet-wash px-3.5 py-3">
              <Timer size={14} className="shrink-0 text-mist" />
              <span className="text-[12px] text-mist">Rest between sets: {openEx.rest}</span>
            </div>
            {openEx.coachNote ? (
              <div className="rounded-xl border border-gold/20 bg-violet-wash p-3.5">
                <p className="text-[12px] leading-relaxed text-violet-deep">{openEx.coachNote}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Sheet>

      <Toast message={toast} onDone={() => setToast(null)} />
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-violet-line bg-white p-3 text-center">
      <p className="text-[10px] tracking-wide text-mist/90">{label}</p>
      <p className="mt-0.5 truncate font-cond text-[15px] tabular-nums text-fog">{value}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- history */

const HISTORY = [
  { date: "−2 days", title: "Lower strength", detail: "Trap bar 3×5 @75 kg · 62 min", rpe: 8 },
  { date: "−5 days", title: "Upper pull", detail: "Weighted pull-up 4×5 @12.5 kg · 58 min", rpe: 7 },
  { date: "−9 days", title: "Full body", detail: "Skipped — no show", rpe: 0 },
  { date: "−12 days", title: "Lower strength", detail: "Trap bar 4×5 @70 kg · 65 min", rpe: 8 },
  { date: "−16 days", title: "HYROX group", detail: "Cancelled by coach", rpe: 0 },
  { date: "−19 days", title: "Upper push", detail: "Bench 5×3 @85 kg · 60 min", rpe: 9 },
];

export function TrainingHistory() {
  return (
    <Screen onBack={() => window.history.back()} backLabel="Back to training">
      <PageHead
        eyebrow="Training history"
        title="Every session, logged"
        sub="Your completed work with coach notes attached."
      />
      <ul className="space-y-2.5">
        {HISTORY.map((h, i) => (
          <li key={i} className="anim-rise" style={{ animationDelay: `${i * 50}ms` }}>
            <Surface className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] tracking-wide text-mist/80">{h.date}</p>
                  <p className="mt-0.5 truncate text-[15px] font-medium text-fog">{h.title}</p>
                  <p className="mt-0.5 truncate text-[12px] text-mist">{h.detail}</p>
                </div>
                {h.rpe > 0 ? (
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] tracking-wide text-mist/80">RPE</p>
                    <p className="font-cond text-[20px] font-semibold leading-none tabular-nums text-gold">
                      {h.rpe}
                    </p>
                  </div>
                ) : (
                  <Tag tone="neutral">—</Tag>
                )}
              </div>
            </Surface>
          </li>
        ))}
      </ul>
    </Screen>
  );
}

export { Clock, Dumbbell, RotateCcw, Empty };
