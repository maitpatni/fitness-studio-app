import { useNavigate, useParams } from "../lib/router";
import { CalendarPlus, Check, MessageSquare, Star, Trophy } from "lucide-react";
import { Avatar, Button, SectionTitle, Surface, Tag } from "../components/ui";
import { PageHead, Screen } from "../components/shell";
import { TRAINERS } from "../lib/hos-data";

export function Trainers() {
  const navigate = useNavigate();
  return (
    <Screen>
      <PageHead
        eyebrow="The team"
        title="Coaches at Santè"
        sub="Every coach here programs your sessions. Pick by specialty, not just availability."
      />
      <ul className="space-y-3">
        {TRAINERS.map((t, i) => (
          <li key={t.id} className="anim-rise" style={{ animationDelay: `${i * 60}ms` }}>
            <button
              type="button"
              onClick={() => navigate(`/trainers/${t.id}`)}
              className="flex w-full items-start gap-3.5 rounded-2xl border border-violet-line bg-white p-4 text-left shadow-[0_1px_2px_rgba(45,20,90,0.04)] transition-colors hover:border-violet-soft"
            >
              <Avatar initials={t.initials} accent={t.accent} size={52} />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-[15px] font-medium text-fog">
                  {t.name}
                  {t.isAssigned ? <Tag tone="gold">Your coach</Tag> : null}
                </p>
                <p className="mt-0.5 text-[12px] text-mist">{t.title}</p>
                <p className="mt-2 flex items-center gap-3 text-[11px] text-mist/90">
                  <span className="flex items-center gap-1">
                    <Star size={11} className="text-gold" /> {t.rating}
                  </span>
                  <span>{t.sessions.toLocaleString("en-IN")} sessions</span>
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  );
}

export function TrainerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const trainer = TRAINERS.find((t) => t.id === id) ?? TRAINERS[0];

  return (
    <Screen onBack={() => navigate("/trainers")} backLabel="Back to coaches">
      <div className="mb-5 flex flex-col items-center text-center">
        <Avatar initials={trainer.initials} accent={trainer.accent} size={84} />
        <h1 className="mt-3 text-[25px] font-semibold tracking-tight text-fog">{trainer.name}</h1>
        <p className="mt-1 text-[13px] text-mist">{trainer.title}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {trainer.specialty.map((s) => (
            <span
              key={s}
              className="rounded-full px-2.5 py-1 text-[11px]"
              style={{ background: `${trainer.accent}18`, color: trainer.accent }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <Surface className="p-4">
        <p className="text-[13px] leading-relaxed text-mist">{trainer.bio}</p>
        <div className="mt-4 flex items-center justify-around border-t border-violet-line pt-4">
          <Stat label="Rating" value={`${trainer.rating}`} />
          <div className="h-8 w-px bg-violet-line" />
          <Stat label="Sessions" value={trainer.sessions.toLocaleString("en-IN")} />
          <div className="h-8 w-px bg-violet-line" />
          <Stat label="At Santè" value="5 yrs" />
        </div>
      </Surface>

      <div className="mt-6">
        <SectionTitle eyebrow="Credentials" title="Certified in" />
        <Surface className="divide-y divide-violet-line">
          {trainer.certifications.map((c) => (
            <div key={c} className="flex items-center gap-3 p-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-sage/30 bg-sage/10 text-sage">
                <Check size={13} />
              </span>
              <span className="text-[14px] text-fog">{c}</span>
            </div>
          ))}
        </Surface>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="secondary" size="lg" onClick={() => navigate("/book")}>
          <CalendarPlus size={16} /> Book
        </Button>
        <Button variant="secondary" size="lg" onClick={() => navigate("/help")}>
          <MessageSquare size={16} /> Ask
        </Button>
      </div>

      {trainer.isAssigned ? (
        <Surface className="mt-4 flex items-start gap-3 border-gold/20 bg-violet-wash p-4">
          <Trophy size={15} className="mt-0.5 shrink-0 text-gold" />
          <p className="text-[12px] leading-relaxed text-mist">
            {trainer.name.split(" ")[0]} is your assigned coach, so they write your programme and
            track your assessments. You can still book other coaches any time.
          </p>
        </Surface>
      ) : null}
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-cond text-[19px] font-semibold leading-none tabular-nums text-gold">
        {value}
      </p>
      <p className="mt-1 text-[10px] tracking-wide text-mist/90">{label}</p>
    </div>
  );
}
