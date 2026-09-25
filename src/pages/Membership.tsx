import { useState } from "react";
import { useNavigate } from "../lib/router";
import {
  Check,
  CreditCard,
  Download,
  Gem,
  History,
  Info,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Button,
  Ring,
  SectionTitle,
  Sheet,
  Surface,
  Tag,
  Toast,
} from "../components/ui";
import { PageHead, Reveal, Screen } from "../components/shell";
import { MEMBERSHIP, daysBetween, fmtDate, fmtMonthYear, inr, todayISO, useStore } from "../lib/store";
import { INVOICES, PACKAGES } from "../lib/hos-data";
import { cn } from "../lib/utils";

export function Membership() {
  const navigate = useNavigate();
  const { bookings } = useStore();
  const [pay, setPay] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const total = MEMBERSHIP.purchased + MEMBERSHIP.bonus;
  const used = MEMBERSHIP.used;
  const remaining = Math.max(0, total - used);
  const daysLeft = daysBetween(todayISO(), MEMBERSHIP.expiryDate);
  const tier = PACKAGES.find((p) => p.name === "Serious");

  return (
    <Screen>
      <PageHead
        eyebrow="Membership"
        title="Your package"
        sub="Session balance, validity and payment history."
      />

      {/* ------------------------------------------------------ balance */}
      <Reveal>
        <Surface className="grain relative overflow-hidden p-5">
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.3), transparent 70%)" }}
          />
          <div className="relative flex items-center gap-5">
            <Ring value={remaining} max={total} label={`${remaining}`} sub="sessions left" size={104} stroke={8} />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-fog">{MEMBERSHIP.name}</p>
              <p className="mt-0.5 text-[12px] text-mist">{MEMBERSHIP.id}</p>
              <div className="mt-3 space-y-1.5">
                <Meter label="Purchased" value={MEMBERSHIP.purchased} accent="#6d28d9" />
                <Meter label="Used" value={used} accent="#a78bfa" />
                {MEMBERSHIP.bonus > 0 ? <Meter label="Bonus" value={MEMBERSHIP.bonus} accent="#4c1d95" /> : null}
              </div>
            </div>
          </div>
          <div className="relative mt-4 flex items-center justify-between border-t border-violet-line pt-4">
            <div>
              <p className="text-[10px] tracking-wide text-mist/90">VALID UNTIL</p>
              <p className="mt-0.5 text-[14px] text-fog">{fmtDate(MEMBERSHIP.expiryDate)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] tracking-wide text-mist/90">REMAINING</p>
              <p className="mt-0.5 font-cond text-[19px] font-semibold tabular-nums text-gold">
                {Math.max(0, daysLeft)} days
              </p>
            </div>
          </div>
        </Surface>
      </Reveal>

      {remaining <= 7 ? (
        <Reveal delay={60}>
          <Surface className="mt-3 border-gold/25 bg-violet-wash p-4">
            <div className="flex items-start gap-3">
              <Sparkles size={16} className="mt-0.5 shrink-0 text-gold" />
              <div>
                <p className="text-[14px] font-medium text-fog">Renew early, keep your rate</p>
                <p className="mt-1 text-[12px] leading-relaxed text-mist">
                  Renewing before expiry locks your current per-session price. Sessions are
                  deducted on completion, not on booking.
                </p>
              </div>
            </div>
          </Surface>
        </Reveal>
      ) : null}

      {/* ------------------------------------------------------ packages */}
      <div className="mt-7">
        <SectionTitle eyebrow="Renew or upgrade" title="Packages" />
        <ul className="space-y-3">
          {PACKAGES.map((p, i) => (
            <li key={p.id} className="anim-rise" style={{ animationDelay: `${i * 60}ms` }}>
              <Surface
                className={cn(
                  "relative overflow-hidden p-4",
                  p.popular && "border-gold/40 bg-violet-wash",
                )}
              >
                {p.popular ? (
                  <span className="absolute right-0 top-0 rounded-bl-xl bg-gold px-3 py-1 text-[10px] font-semibold tracking-wide text-white">
                    MOST POPULAR
                  </span>
                ) : null}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[16px] font-medium text-fog">
                      {p.name}
                      {p.name === "Elite" ? <Gem size={14} className="text-gold" /> : null}
                    </p>
                    <p className="mt-0.5 text-[12px] text-mist">
                      {p.sessions} sessions · {p.validityDays} days validity
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-cond text-[20px] font-semibold leading-none tabular-nums text-gold">
                      {inr(p.price)}
                    </p>
                    <p className="mt-1 text-[10px] text-mist">{inr(p.perSession)} / session</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-[12px] text-mist">
                      <Check size={12} className="mt-0.5 shrink-0 text-sage" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  className="mt-3.5"
                  full
                  onClick={() => setPay(p.id)}
                >
                  {p.name === "Serious" ? "Renew Serious" : `Choose ${p.name}`}
                </Button>
              </Surface>
            </li>
          ))}
        </ul>
      </div>

      {/* ------------------------------------------------------ payments */}
      <div className="mt-7">
        <SectionTitle eyebrow="Billing" title="Payments & invoices" />
        <ul className="space-y-2.5">
          {INVOICES.map((inv, i) => (
            <li key={inv.id} className="anim-rise" style={{ animationDelay: `${i * 55}ms` }}>
              <Surface className="flex items-center gap-3.5 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-line bg-violet-wash text-violet-deep">
                  <CreditCard size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] text-fog">{inv.title}</p>
                  <p className="mt-0.5 text-[11px] text-mist">
                    {fmtMonthYear(inv.date)} · {inv.method}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-cond text-[16px] font-semibold tabular-nums text-fog">
                    {inr(inv.amount)}
                  </p>
                  <Tag tone={inv.status === "Paid" ? "sage" : "rust"}>{inv.status}</Tag>
                </div>
              </Surface>
            </li>
          ))}
        </ul>
        <Button variant="secondary" size="sm" full className="mt-3" onClick={() => setToast("Receipts exported as PDF")}>
          <Download size={15} /> Download all receipts
        </Button>
      </div>

      {/* ------------------------------------------------------ policies */}
      <div className="mt-7">
        <SectionTitle eyebrow="The small print" title="Package rules" />
        <Surface className="divide-y divide-violet-line">
          {[
            { icon: <History size={14} />, k: "Deduction", v: "On completion, not on booking." },
            { icon: <Info size={14} />, k: "No-show", v: "Charged unless your coach cancels." },
            { icon: <ShieldCheck size={14} />, k: "Freeze", v: "Up to 14 days per year, admin approved." },
            { icon: <Gem size={14} />, k: "Bonus", v: "Admin-authorised sessions, fully audited." },
          ].map((r) => (
            <div key={r.k} className="flex items-start gap-3 p-4">
              <span className="mt-0.5 shrink-0 text-gold">{r.icon}</span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-fog">{r.k}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-mist">{r.v}</p>
              </div>
            </div>
          ))}
        </Surface>
      </div>

      {/* ---------------------------------------------------- checkout */}
      <Sheet
        open={pay !== null}
        onClose={() => setPay(null)}
        eyebrow="Secure checkout"
        title="Confirm payment"
        footer={
          <Button
            size="lg"
            full
            onClick={() => {
              const p = PACKAGES.find((x) => x.id === pay);
              setPay(null);
              setToast(`${p?.name} activated — receipt emailed`);
            }}
          >
            Pay {tier ? inr(tier.price) : ""}
          </Button>
        }
      >
        {(() => {
          const p = PACKAGES.find((x) => x.id === pay);
          if (!p) return null;
          return (
            <div className="space-y-4">
              <Surface className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-medium text-fog">{p.name} — {p.sessions} sessions</p>
                    <p className="mt-0.5 text-[12px] text-mist">
                      {p.validityDays} days validity from activation
                    </p>
                  </div>
                  <p className="font-cond text-[20px] font-semibold tabular-nums text-gold">
                    {inr(p.price)}
                  </p>
                </div>
              </Surface>
              <div>
                <p className="eyebrow mb-2 text-mist/70">Pay with</p>
                <div className="space-y-2">
                  {["UPI · ending 4412", "Card · ending 9031", "Net banking"].map((m, i) => (
                    <button
                      key={m}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors",
                        i === 0 ? "border-gold/45 bg-violet-wash" : "border-violet-line bg-white",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                          i === 0 ? "border-gold" : "border-violet-line",
                        )}
                      >
                        {i === 0 ? <span className="h-2 w-2 rounded-full bg-gold" /> : null}
                      </span>
                      <span className="text-[14px] text-fog">{m}</span>
                    </button>
                  ))}
                </div>
              </div>
              <p className="rounded-xl border border-violet-line bg-violet-wash p-3.5 text-[12px] leading-relaxed text-mist">
                <ShieldCheck size={12} className="mr-1 inline text-sage" />
                Payments are processed by a PCI-DSS compliant gateway. Card details never touch
                House of Santè servers. Unused sessions carry forward on renewal.
              </p>
            </div>
          );
        })()}
      </Sheet>

      <Toast message={toast} onDone={() => setToast(null)} />
    </Screen>
  );
}

function Meter({ label, value, accent }: { label: string; value: number; accent: string }) {
  const total = MEMBERSHIP.purchased + MEMBERSHIP.bonus;
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-14 shrink-0 text-[10px] tracking-wide text-mist/90">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-violet-wash">
        <div className="h-full rounded-full" style={{ width: `${(value / total) * 100}%`, background: accent }} />
      </div>
      <span className="w-5 shrink-0 text-right font-cond text-[12px] tabular-nums text-fog">{value}</span>
    </div>
  );
}
