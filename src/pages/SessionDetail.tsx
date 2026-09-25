import { useState } from "react";
import { useNavigate, useParams } from "../lib/router";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  Dumbbell,
  MapPin,
  MessageSquare,
  RefreshCw,
  StickyNote,
  X,
} from "lucide-react";
import {
  Avatar,
  Button,
  Sheet,
  Surface,
  Tag,
  Toast,
} from "../components/ui";
import { Screen } from "../components/shell";
import { fmtDate, inr, useStore } from "../lib/store";
import { SESSION_TYPES } from "../lib/hos-data";
import { StatusTag } from "./Book";
import { daysLabel } from "./Home";

export function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, setBookingStatus, deleteBooking, isLogged, toggleLog } = useStore();
  const booking = bookings.find((b) => b.id === id);
  const [sheet, setSheet] = useState<null | "cancel" | "reschedule" | "complete">(null);
  const [toast, setToast] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  if (!booking) {
    return (
      <Screen onBack={() => navigate("/sessions")} backLabel="Back">
        <div className="py-16 text-center">
          <p className="text-[15px] text-fog">Session not found</p>
          <Button className="mt-4" onClick={() => navigate("/sessions")}>
            Back to my sessions
          </Button>
        </div>
      </Screen>
    );
  }

  const unitPrice =
    SESSION_TYPES.find((t) => t.name === booking.session_type)?.price ?? 1800;
  const doneKey = `done-${booking.id}`;
  const done = isLogged(doneKey);

  const act = async (fn: () => Promise<void>, msg: string) => {
    await fn();
    setSheet(null);
    setToast(msg);
  };

  return (
    <Screen onBack={() => navigate(-1)} backLabel="Back">
      <div className="mb-5">
        <p className="eyebrow text-gold/70">{booking.ref}</p>
        <h1 className="mt-1 text-[27px] font-semibold leading-tight tracking-tight text-fog">
          {booking.session_type}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusTag status={booking.status} />
          <Tag>{fmtDate(booking.session_date)}</Tag>
        </div>
      </div>

      {/* ----------------------------------------------------- key facts */}
      <Surface className="p-4">
        <div className="grid grid-cols-2 gap-y-4">
          <Fact label="Time" value={booking.start_time} icon={<CalendarClock size={13} />} />
          <Fact label="Duration" value={`${booking.duration_min} min`} />
          <Fact label="Location" value={booking.location ?? "Studio"} icon={<MapPin size={13} />} />
          <Fact label="Value" value={inr(unitPrice)} />
        </div>
      </Surface>

      {/* --------------------------------------------------------- coach */}
      <div className="mt-3">
        <p className="eyebrow mb-2 text-mist/70">Your coach</p>
        <button
          type="button"
          onClick={() => navigate(`/trainers/${booking.trainer_id}`)}
          className="flex w-full items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-gold/25"
        >
          <Avatar initials={split(booking.trainer_name)} size={46} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium text-fog">{booking.trainer_name}</p>
            <p className="truncate text-[12px] text-mist">View profile & availability</p>
          </div>
        </button>
      </div>

      {/* ------------------------------------------------- session focus */}
      {booking.notes ? (
        <Surface className="mt-3 border-gold/20 bg-gold/[0.05] p-4">
          <p className="eyebrow text-gold/80">Session focus</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-fog">{booking.notes}</p>
        </Surface>
      ) : null}

      {/* ----------------------------------------------- workout log */}
      {booking.status === "completed" ? (
        <>
          <div className="mt-6 mb-3 flex items-center justify-between">
            <h2 className="text-[19px] font-semibold tracking-tight text-fog">Session log</h2>
            <button
              type="button"
              onClick={() => toggleLog(doneKey)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                done
                  ? "border-sage/50 bg-sage/15 text-[#a9c4ac]"
                  : "border-white/12 text-mist"
              }`}
            >
              {done ? <Check size={13} /> : null}
              {done ? "Logged" : "Mark logged"}
            </button>
          </div>
          <ul className="space-y-2">
            {["Trap Bar Deadlift — 5 x 5 @ 80 kg", "Bulgarian Split Squat — 3 x 10", "Sled Push — 4 x 12.5 m"].map(
              (row) => {
                const key = `${booking.id}-${row}`;
                const on = isLogged(key);
                return (
                  <li key={row}>
                    <button
                      type="button"
                      onClick={() => toggleLog(key)}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors ${
                        on
                          ? "border-sage/35 bg-sage/[0.08]"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                          on ? "border-sage bg-sage/80 text-[#0d120e]" : "border-white/20"
                        }`}
                      >
                        {on ? <Check size={12} strokeWidth={3} /> : null}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] text-fog">{row}</span>
                    </button>
                  </li>
                );
              },
            )}
          </ul>
        </>
      ) : null}

      {/* ------------------------------------------------------ actions */}
      <div className="mt-7 space-y-2.5">
        {booking.status === "booked" ? (
          <>
            <Button size="lg" full variant="secondary" onClick={() => setSheet("reschedule")}>
              <RefreshCw size={16} /> Reschedule
            </Button>
            <Button size="lg" full variant="secondary" onClick={() => setShowNote(true)}>
              <StickyNote size={16} /> Add a note for your coach
            </Button>
            <Button size="lg" full variant="danger" onClick={() => setSheet("cancel")}>
              <X size={16} /> Cancel session
            </Button>
          </>
        ) : null}
        {booking.status === "cancelled" || booking.status === "no_show" ? (
          <Button size="lg" full onClick={() => navigate("/book")}>
            Book another slot
          </Button>
        ) : null}
        {booking.status === "completed" ? (
          <Button size="lg" full variant="secondary" onClick={() => navigate("/training")}>
            <Dumbbell size={16} /> View today's programme
          </Button>
        ) : null}
      </div>

      {/* -------------------------------------------------------- policy */}
      <Surface className="mt-6 p-4">
        <p className="eyebrow text-mist/70">Studio policy</p>
        <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-mist">
          <li>• Reschedule free up to 12 hours before your slot.</li>
          <li>• Inside 12 hours, the session is deducted on completion.</li>
          <li>• No-shows are charged unless a coach cancels.</li>
        </ul>
      </Surface>

      {/* --------------------------------------------------------- sheets */}
      <Sheet
        open={sheet === "cancel"}
        onClose={() => setSheet(null)}
        eyebrow="Please confirm"
        title="Cancel this session?"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" size="lg" onClick={() => setSheet(null)} className="flex-1">
              Keep it
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="flex-1"
              onClick={() => act(() => deleteBooking(booking.id), "Session cancelled")}
            >
              Cancel session
            </Button>
          </div>
        }
      >
        <p className="text-[14px] leading-relaxed text-mist">
          {daysLabel(booking.session_date, new Date().toISOString().slice(0, 10)) === "Today"
            ? "This session is today. Cancelling inside 12 hours will deduct a session from your package."
            : "You're outside the 12-hour window, so this cancellation is free and no session is deducted."}
        </p>
      </Sheet>

      <Sheet
        open={sheet === "reschedule"}
        onClose={() => setSheet(null)}
        eyebrow="Pick a new slot"
        title="Reschedule"
        footer={
          <Button
            size="lg"
            full
            onClick={() => act(() => setBookingStatus(booking.id, "cancelled"), "Slot released — book a new time")}
          >
            Release this slot
          </Button>
        }
      >
        <p className="text-[14px] leading-relaxed text-mist">
          We'll release {booking.start_time} on {fmtDate(booking.session_date)} and take you straight
          to live availability. Your session balance is untouched.
        </p>
        <Button
          className="mt-4"
          size="lg"
          full
          onClick={() => {
            setSheet(null);
            navigate("/book");
          }}
        >
          See available slots
        </Button>
      </Sheet>

      <Sheet
        open={showNote}
        onClose={() => setShowNote(false)}
        eyebrow="For your coach"
        title="Add a session note"
        footer={
          <Button
            size="lg"
            full
            onClick={() => {
              setShowNote(false);
              setToast(note ? "Note sent to your coach" : "Note cleared");
            }}
          >
            <MessageSquare size={16} /> Save note
          </Button>
        }
      >
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
          placeholder="Knee felt tight on lunges last week, please scale back…"
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] p-4 text-[14px] text-fog outline-none placeholder:text-mist/45 focus:border-gold/50"
        />
        <p className="mt-2 text-[12px] text-mist">
          Your coach sees this before your session starts.
        </p>
      </Sheet>

      <Toast message={toast} onDone={() => setToast(null)} />
    </Screen>
  );
}

function Fact({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] text-mist/80">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 truncate text-[14px] text-fog">{value}</p>
    </div>
  );
}

function split(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export { ArrowLeft };
