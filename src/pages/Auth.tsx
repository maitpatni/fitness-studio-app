import { useEffect, useRef, useState } from "react";
import { useNavigate } from "../lib/router";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { Button, Chip, Field, Progress, Sheet } from "../components/ui";
import { StudioArt } from "../components/shell";
import { DEFAULT_ONBOARDING, useStore } from "../lib/store";
import {
  EXPERIENCE_LEVELS,
  GOALS,
  HEALTH_FLAGS,
  TRAINING_PREFS,
} from "../lib/hos-data";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ splash */

export function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          return 100;
        }
        return p + 4;
      });
    }, 34);
    const nav = setTimeout(() => navigate("/", { replace: true }), 2350);
    return () => {
      clearInterval(t);
      clearTimeout(nav);
    };
  }, [navigate]);

  return (
    <div className="grain relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-ink px-8">
      <StudioArt />
      <div className="relative z-10 flex flex-col items-center">
        <div className="anim-fade mb-7 grid h-20 w-20 place-items-center rounded-[26px] border border-gold/30 bg-gradient-to-br from-gold-soft to-gold shadow-[0_20px_60px_-20px_rgba(212,180,131,0.7)]">
          <span className="font-serif text-[40px] font-semibold leading-none text-[#17130c]">S</span>
        </div>
        <h1 className="anim-rise font-serif text-[38px] font-semibold leading-none tracking-wide text-fog">
          House of Santè
        </h1>
        <p
          className="anim-rise eyebrow mt-3 text-gold/70"
          style={{ animationDelay: "120ms" }}
        >
          Personal Training Studio
        </p>
        <div className="mt-10 w-44">
          <Progress value={progress} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- login */

export function Login() {
  const navigate = useNavigate();
  const { signIn, onboarding, saveOnboarding } = useStore();
  const [phone, setPhone] = useState("98765 43210");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(30);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== "otp" || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, seconds]);

  useEffect(() => {
    if (otp.every((d) => d !== "") && step === "otp") {
      const t = setTimeout(() => {
        if (otp.join("") !== "202609") {
          setError("That code doesn't match. Try 202609 for this demo.");
          setOtp(["", "", "", "", "", ""]);
          inputs.current[0]?.focus();
          return;
        }
        signIn();
        navigate(onboarding.completed ? "/" : "/onboarding", { replace: true });
      }, 420);
      return () => clearTimeout(t);
    }
  }, [otp, step, signIn, navigate, onboarding.completed]);

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    setError("");
    if (d && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  return (
    <div className="grain relative flex h-[100dvh] flex-col overflow-hidden bg-ink">
      <StudioArt />
      <button
        type="button"
        onClick={() => navigate("/")}
        className="anim-fade absolute right-4 top-4 z-20 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[12px] text-mist"
      >
        Explore demo
      </button>

      <div className="no-scrollbar relative z-10 flex flex-1 flex-col justify-end overflow-y-auto px-6 pb-10 pt-24">
        <div className="anim-rise mb-8">
          <p className="eyebrow text-gold/70">Welcome back</p>
          <h1 className="mt-1.5 font-serif text-[40px] font-semibold leading-[1.05] text-fog">
            Your training,
            <br />
            one tap away.
          </h1>
          <p className="mt-3 max-w-[32ch] text-[14px] leading-relaxed text-mist">
            Sign in with your mobile number. We'll send a one-time code — no passwords to
            remember.
          </p>
        </div>

        {step === "phone" ? (
          <div className="anim-rise space-y-4" style={{ animationDelay: "100ms" }}>
            <Field
              label="Mobile number"
              value={phone}
              onChange={setPhone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
            />
            <Button
              size="lg"
              full
              onClick={() => {
                if (phone.replace(/\D/g, "").length < 10) {
                  setError("Enter a valid 10-digit mobile number.");
                  return;
                }
                setError("");
                setSeconds(30);
                setStep("otp");
              }}
            >
              Send OTP <ArrowRight size={17} />
            </Button>
            {error ? <p className="text-[13px] text-rust">{error}</p> : null}
            <p className="pt-1 text-center text-[12px] text-mist/70">
                By continuing you agree to the HOS terms, privacy policy and training waiver.
              </p>
          </div>
        ) : (
          <div className="anim-rise space-y-5" style={{ animationDelay: "60ms" }}>
            <p className="text-[14px] text-mist">
              Code sent to <span className="text-fog">+91 {phone}</span>
            </p>
            <div className="flex justify-between gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  value={d}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => onKey(i, e)}
                  inputMode="numeric"
                  aria-label={`Digit ${i + 1}`}
                  className="h-14 w-full rounded-xl border border-white/12 bg-white/[0.05] text-center font-cond text-[22px] tabular-nums text-fog outline-none transition-colors focus:border-gold/60"
                />
              ))}
            </div>
            {error ? <p className="text-[13px] text-rust">{error}</p> : null}
            <Button
              size="lg"
              full
              onClick={() => {
                if (otp.join("") !== "202609") {
                  setError("That code doesn't match. Try 202609 for this demo.");
                  return;
                }
                signIn();
                navigate(onboarding.completed ? "/" : "/onboarding", { replace: true });
              }}
            >
              Verify & continue <ArrowRight size={17} />
            </Button>
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="w-full text-center text-[13px] text-mist underline-offset-4 hover:text-fog hover:underline"
            >
              Change number
            </button>
            <p className="text-center text-[12px] text-mist/70">
              {seconds > 0 ? (
                <>Resend code in {seconds}s</>
              ) : (
                <button
                  type="button"
                  onClick={() => setSeconds(30)}
                  className="text-gold underline-offset-4 hover:underline"
                >
                  Resend code
                </button>
              )}
            </p>
            <p className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-[12px] leading-relaxed text-mist">
              <ShieldCheck size={13} className="mr-1.5 inline text-gold" />
              Demo code is <span className="font-cond text-fog">202609</span>. In production this
              is verified server-side before your session is created.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- onboarding */

const TOTAL = 5;

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { onboarding, saveOnboarding, signIn } = useStore();
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState(false);
  const [consentPhoto, setConsentPhoto] = useState(false);
  const [info, setInfo] = useState(false);

  const o = onboarding;
  const set = (patch: Partial<typeof o>) => saveOnboarding({ ...o, ...patch });

  const toggle = (key: "goals" | "prefs" | "health", value: string) => {
    const list = o[key];
    if (list.includes(value)) {
      set({ [key]: list.filter((v) => v !== value) } as Partial<typeof o>);
    } else {
      set({ [key]: [...list, value] } as Partial<typeof o>);
    }
  };

  const canAdvance = (() => {
    switch (step) {
      case 0:
        return o.name.trim().length > 1 && o.dob.length > 0 && o.gender !== "" && o.phone.replace(/\D/g, "").length >= 10;
      case 1:
        return o.goals.length > 0;
      case 2:
        return o.prefs.length > 0 && o.experience !== "";
      case 3:
        return o.health.length > 0;
      default:
        return true;
    }
  })();

  const finish = () => {
    saveOnboarding({ ...o, completed: true, assessed: true });
    signIn();
    navigate("/", { replace: true });
  };

  const steps = [
    { title: "About you", sub: "We only ask for what your coach genuinely needs." },
    { title: "Your goals", sub: "Pick as many as fit. This shapes your first programme." },
    { title: "Training style", sub: "So we match you with the right coach and format." },
    { title: "Health & readiness", sub: "Every answer here protects you on the floor." },
    { title: "Consent", sub: "Last step before the studio." },
  ];

  return (
    <div className="grain relative flex h-[100dvh] flex-col overflow-hidden bg-ink">
      <div className="flex shrink-0 items-center gap-4 px-5 pt-[max(env(safe-area-inset-top),16px)] pb-3">
        <button
          type="button"
          onClick={() => (step === 0 ? navigate("/") : setStep((s) => s - 1))}
          className="text-[13px] text-mist"
        >
          {step === 0 ? "Cancel" : "Back"}
        </button>
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-300",
                i <= step ? "bg-gold" : "bg-white/12",
              )}
            />
          ))}
        </div>
        <span className="font-cond text-[12px] tabular-nums text-mist">
          {step + 1}/{TOTAL}
        </span>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-4 pt-4">
        <div key={step} className="anim-rise">
          <p className="eyebrow text-gold/70">Step {step + 1}</p>
          <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-tight text-fog">
            {steps[step].title}
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-mist">{steps[step].sub}</p>

          <div className="mt-6 space-y-4">
            {step === 0 ? (
              <>
                <Field label="Full name" value={o.name} onChange={(v) => set({ name: v })} placeholder="Rhea Kapoor" autoComplete="name" />
                <Field label="Date of birth" value={o.dob} onChange={(v) => set({ dob: v })} placeholder="DD / MM / YYYY" />
                <div>
                  <span className="eyebrow mb-2 block text-mist/70">Gender</span>
                  <div className="flex flex-wrap gap-2">
                    {["Female", "Male", "Non-binary", "Prefer not to say"].map((g) => (
                      <Chip key={g} active={o.gender === g} onClick={() => set({ gender: g })}>
                        {g}
                      </Chip>
                    ))}
                  </div>
                </div>
                <Field label="Mobile" value={o.phone} onChange={(v) => set({ phone: v })} placeholder="98765 43210" type="tel" inputMode="tel" autoComplete="tel" />
                <Field label="Email (optional)" value={o.email} onChange={(v) => set({ email: v })} placeholder="you@email.com" type="email" inputMode="email" autoComplete="email" />
                <Field label="Emergency contact" value={o.emergency} onChange={(v) => set({ emergency: v })} placeholder="Name + number" />
              </>
            ) : null}

            {step === 1 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((g) => (
                    <Chip key={g} active={o.goals.includes(g)} onClick={() => toggle("goals", g)}>
                      {g}
                    </Chip>
                  ))}
                </div>
                <div className="rounded-2xl border border-gold/20 bg-gold/[0.07] p-4">
                  <p className="eyebrow text-gold/80">Why we ask</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-mist">
                    Goals set session volume and how hard Arjun pushes you. We revisit them every
                    twelve weeks at your reassessment.
                  </p>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div>
                  <span className="eyebrow mb-2 block text-mist/70">Training preferences</span>
                  <div className="flex flex-wrap gap-2">
                    {TRAINING_PREFS.map((p) => (
                      <Chip key={p} active={o.prefs.includes(p)} onClick={() => toggle("prefs", p)}>
                        {p}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="eyebrow mb-2 block text-mist/70">Training experience</span>
                  <div className="flex flex-wrap gap-2">
                    {EXPERIENCE_LEVELS.map((e) => (
                      <Chip key={e} active={o.experience === e} onClick={() => set({ experience: e })}>
                        {e}
                      </Chip>
                    ))}
                  </div>
                </div>
                <Field
                  label="Anything we should know? (optional)"
                  value={o.limitations}
                  onChange={(v) => set({ limitations: v })}
                  placeholder="Old shoulder injury, knee brace, travel schedule…"
                />
              </>
            ) : null}

            {step === 3 ? (
              <>
                <div>
                  <span className="eyebrow mb-2 block text-mist/70">Anything to flag?</span>
                  <div className="flex flex-wrap gap-2">
                    {HEALTH_FLAGS.map((h) => (
                      <Chip key={h} active={o.health.includes(h)} onClick={() => toggle("health", h)}>
                        {h}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="pr-3">
                    <p className="text-[14px] font-medium text-fog">Book a readiness assessment</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-mist">
                      45 minutes with your coach — movement screen, goals, first programme.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => set({ assessed: !o.assessed })}
                    className={cn(
                      "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                      o.assessed ? "bg-gold" : "bg-white/15",
                    )}
                    aria-label="Toggle readiness assessment"
                  >
                    <span
                      className={cn(
                        "absolute top-1 h-5 w-5 rounded-full bg-ink transition-all",
                        o.assessed ? "left-6" : "left-1",
                      )}
                    />
                  </button>
                </div>
                <div className="rounded-2xl border border-sage/25 bg-sage/[0.08] p-4">
                  <p className="text-[12px] leading-relaxed text-[#b6cbb8]">
                    Only your assigned coach and authorised staff can see health answers. This is
                    never shared with other members.
                  </p>
                </div>
              </>
            ) : null}

            {step === 4 ? (
              <>
                <ToggleRow
                  label="Terms, privacy policy & training waiver"
                  body="Required. Covers liability, data handling and the risks of physical exercise."
                  checked={consent}
                  onChange={setConsent}
                />
                <ToggleRow
                  label="Progress photos"
                  body="Optional. Private to you and your coach. You can delete any photo at any time."
                  checked={consentPhoto}
                  onChange={setConsentPhoto}
                />
                <button
                  type="button"
                  onClick={() => setInfo(true)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left"
                >
                  <p className="text-[14px] font-medium text-fog">How we handle your data</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-mist">
                    Role-based access, encrypted at rest, export on request. Tap to read the full
                    policy.
                  </p>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/8 bg-ink px-5 pb-[max(env(safe-area-inset-bottom),14px)] pt-3">
        {step === 4 && !consent ? (
          <p className="mb-2 text-center text-[12px] text-mist">Accept the waiver to continue.</p>
        ) : null}
        <Button
          size="lg"
          full
          disabled={!canAdvance || (step === 4 && !consent)}
          onClick={() => (step === TOTAL - 1 ? finish() : setStep((s) => s + 1))}
        >
          {step === TOTAL - 1 ? "Finish & enter the studio" : "Continue"}
          {step === TOTAL - 1 ? <Sparkles size={17} /> : <ArrowRight size={17} />}
        </Button>
      </div>

      <Sheet open={info} onClose={() => setInfo(false)} title="Your data at House of Santè" eyebrow="Privacy">
        <div className="space-y-4 text-[13px] leading-relaxed text-mist">
          <p>
            Health answers, measurements and progress photos are visible only to your assigned
            trainer and to authorised studio staff who need them for your session. Other members
            never see your file.
          </p>
          <p>
            Every change to a session record, package balance or measurement is written to an
            audit trail, so a correction can always be traced and reversed.
          </p>
          <p>
            You can export or delete your progress data from Profile → Privacy at any time. Deleting
            your account removes personal records after the statutory retention window.
          </p>
        </div>
      </Sheet>
    </div>
  );
}

function ToggleRow({
  label,
  body,
  checked,
  onChange,
}: {
  label: string;
  body: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left"
    >
      <span
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
          checked ? "border-gold bg-gold text-[#17130c]" : "border-white/20",
        )}
      >
        {checked ? <Check size={13} strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-medium text-fog">{label}</span>
        <span className="mt-0.5 block text-[12px] leading-relaxed text-mist">{body}</span>
      </span>
    </button>
  );
}

export { DEFAULT_ONBOARDING };
