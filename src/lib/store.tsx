import { db } from "@broodle/data";
import { MEMBERSHIP, TODAY_PROGRAMME } from "./hos-data";
import { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ types */

export type BookingStatus = "booked" | "completed" | "cancelled" | "no_show";

export type Booking = {
  id: string;
  ref: string;
  session_date: string;
  start_time: string;
  duration_min: number;
  trainer_id: string;
  trainer_name: string;
  session_type: string;
  location: string | null;
  status: BookingStatus;
  notes: string | null;
};

export type ProgressEntry = {
  id: string;
  recorded_at: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  waist_cm: number | null;
  chest_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
  notes: string | null;
};

export type PrRecord = {
  id: string;
  movement: string;
  value: number;
  unit: string;
  recorded_at: string;
};

export type CheckIn = {
  id: string;
  checked_in_at: string;
  method: string;
  ref: string | null;
  studio: string | null;
};

export type Onboarding = {
  completed: boolean;
  signedIn: boolean;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  emergency: string;
  goals: string[];
  prefs: string[];
  experience: string;
  health: string[];
  limitations: string;
  assessed: boolean;
};

export const DEFAULT_ONBOARDING: Onboarding = {
  completed: false,
  signedIn: false,
  name: "",
  dob: "",
  gender: "",
  phone: "",
  email: "",
  emergency: "",
  goals: [],
  prefs: [],
  experience: "",
  health: [],
  limitations: "",
  assessed: false,
};

/* --------------------------------------------------------- date utilities */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function toISO(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayISO(): string {
  return toISO(new Date());
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(iso: string, days: number): string {
  const d = fromISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

export function fmtDate(iso: string): string {
  const d = fromISO(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function fmtDateShort(iso: string): string {
  const d = fromISO(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function fmtMonthYear(iso: string): string {
  const d = fromISO(iso);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((fromISO(toIso).getTime() - fromISO(fromIso).getTime()) / 86400000);
}

export function inr(n: number): string {
  return `\u20b9${n.toLocaleString("en-IN")}`;
}

/* -------------------------------------------------------------- seed data */

const SEED_BOOKINGS: Array<Omit<Booking, "id">> = [
  { ref: "HOS-4471", session_date: addDays(todayISO(), 1), start_time: "07:00", duration_min: 60, trainer_id: "arjun-mehta", trainer_name: "Arjun Mehta", session_type: "1:1 Personal Training", location: "Studio Floor 2", status: "booked", notes: "Lower strength block, week 4." },
  { ref: "HOS-4479", session_date: addDays(todayISO(), 3), start_time: "18:30", duration_min: 60, trainer_id: "arjun-mehta", trainer_name: "Arjun Mehta", session_type: "1:1 Personal Training", location: "Studio Floor 2", status: "booked", notes: null },
  { ref: "HOS-4483", session_date: addDays(todayISO(), 5), start_time: "08:00", duration_min: 75, trainer_id: "maya-rao", trainer_name: "Maya Rao", session_type: "HYROX Group", location: "Performance Bay", status: "booked", notes: "Sled technique focus." },
  { ref: "HOS-4390", session_date: addDays(todayISO(), -2), start_time: "07:00", duration_min: 60, trainer_id: "arjun-mehta", trainer_name: "Arjun Mehta", session_type: "1:1 Personal Training", location: "Studio Floor 2", status: "completed", notes: "Trap bar 3x5 @75. Felt strong." },
  { ref: "HOS-4366", session_date: addDays(todayISO(), -5), start_time: "18:30", duration_min: 60, trainer_id: "arjun-mehta", trainer_name: "Arjun Mehta", session_type: "1:1 Personal Training", location: "Studio Floor 2", status: "completed", notes: null },
  { ref: "HOS-4311", session_date: addDays(todayISO(), -9), start_time: "19:00", duration_min: 60, trainer_id: "maya-rao", trainer_name: "Maya Rao", session_type: "1:1 Personal Training", location: "Studio Floor 2", status: "no_show", notes: "Client reported travel. Credit applied by admin." },
  { ref: "HOS-4250", session_date: addDays(todayISO(), -12), start_time: "07:00", duration_min: 60, trainer_id: "arjun-mehta", trainer_name: "Arjun Mehta", session_type: "1:1 Personal Training", location: "Studio Floor 2", status: "completed", notes: null },
  { ref: "HOS-4190", session_date: addDays(todayISO(), -16), start_time: "08:00", duration_min: 75, trainer_id: "maya-rao", trainer_name: "Maya Rao", session_type: "HYROX Group", location: "Performance Bay", status: "cancelled", notes: "Cancelled by coach — studio maintenance." },
];

const SEED_PROGRESS: Array<Omit<ProgressEntry, "id">> = [
  { recorded_at: addDays(todayISO(), -75), weight_kg: 88.4, body_fat_pct: 26.4, waist_cm: 96, chest_cm: 104, arm_cm: 36.5, thigh_cm: 60, notes: "Day 1 assessment." },
  { recorded_at: addDays(todayISO(), -60), weight_kg: 87.1, body_fat_pct: 25.6, waist_cm: 94.5, chest_cm: 103.5, arm_cm: 36.2, thigh_cm: 59.5, notes: null },
  { recorded_at: addDays(todayISO(), -45), weight_kg: 85.9, body_fat_pct: 24.9, waist_cm: 93, chest_cm: 103, arm_cm: 36.4, thigh_cm: 59, notes: "Sleep improving." },
  { recorded_at: addDays(todayISO(), -30), weight_kg: 84.6, body_fat_pct: 24.1, waist_cm: 91.5, chest_cm: 102.5, arm_cm: 36.8, thigh_cm: 58.5, notes: "Waist measured post-session." },
  { recorded_at: addDays(todayISO(), -14), weight_kg: 83.2, body_fat_pct: 23.4, waist_cm: 90, chest_cm: 102, arm_cm: 37.1, thigh_cm: 58, notes: null },
  { recorded_at: addDays(todayISO(), -3), weight_kg: 82.4, body_fat_pct: 22.8, waist_cm: 88.5, chest_cm: 101.5, arm_cm: 37.4, thigh_cm: 57.5, notes: "Best reading so far." },
];

const SEED_RECORDS: Array<Omit<PrRecord, "id">> = [
  { movement: "Back Squat", value: 120, unit: "kg", recorded_at: addDays(todayISO(), -40) },
  { movement: "Back Squat", value: 125, unit: "kg", recorded_at: addDays(todayISO(), -25) },
  { movement: "Back Squat", value: 130, unit: "kg", recorded_at: addDays(todayISO(), -10) },
  { movement: "Trap Bar Deadlift", value: 150, unit: "kg", recorded_at: addDays(todayISO(), -30) },
  { movement: "Trap Bar Deadlift", value: 160, unit: "kg", recorded_at: addDays(todayISO(), -8) },
  { movement: "Bench Press", value: 82.5, unit: "kg", recorded_at: addDays(todayISO(), -20) },
  { movement: "Bench Press", value: 87.5, unit: "kg", recorded_at: addDays(todayISO(), -6) },
  { movement: "Strict Pull-up", value: 12, unit: "reps", recorded_at: addDays(todayISO(), -14) },
  { movement: "Strict Pull-up", value: 14, unit: "reps", recorded_at: addDays(todayISO(), -2) },
  { movement: "Shoulder Press", value: 45, unit: "kg", recorded_at: addDays(todayISO(), -18) },
  { movement: "Running 5K", value: 24, unit: "min", recorded_at: addDays(todayISO(), -22) },
  { movement: "Running 5K", value: 22, unit: "min", recorded_at: addDays(todayISO(), -5) },
];

/* ----------------------------------------------------------------- store */

type Store = {
  ready: boolean;
  bookings: Booking[];
  progress: ProgressEntry[];
  records: PrRecord[];
  checkIns: CheckIn[];
  version: number;
  onboarding: Onboarding;
  reload: () => Promise<void>;
  createBooking: (b: Omit<Booking, "id" | "status">) => Promise<boolean>;
  setBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  addProgress: (p: Omit<ProgressEntry, "id">) => Promise<void>;
  deleteProgress: (id: string) => Promise<void>;
  addRecord: (r: Omit<PrRecord, "id">) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  checkIn: (ref: string, method: string) => Promise<boolean>;
  toggleLog: (key: string) => void;
  isLogged: (key: string) => boolean;
  saveOnboarding: (o: Onboarding) => void;
  signIn: () => void;
  signOut: () => void;
  enterDemo: () => void;
};

const StoreCtx = createContext<Store | null>(null);

export function useStore(): Store {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

const BOOKING_COLS =
  "id, ref, session_date, start_time, duration_min, trainer_id, trainer_name, session_type, location, status, notes";
const PROGRESS_COLS =
  "id, recorded_at, weight_kg, body_fat_pct, waist_cm, chest_cm, arm_cm, thigh_cm, notes";
const RECORD_COLS = "id, movement, value, unit, recorded_at";
const CHECKIN_COLS = "id, checked_in_at, method, ref, studio";

async function fetchAll() {
  const [b, p, r, c] = await Promise.all([
    db.query<Booking>(`SELECT ${BOOKING_COLS} FROM hos_bookings ORDER BY session_date DESC, start_time DESC`),
    db.query<ProgressEntry>(`SELECT ${PROGRESS_COLS} FROM hos_progress ORDER BY recorded_at ASC`),
    db.query<PrRecord>(`SELECT ${RECORD_COLS} FROM hos_records ORDER BY recorded_at ASC`),
    db.query<CheckIn>(`SELECT ${CHECKIN_COLS} FROM hos_checkins ORDER BY checked_in_at DESC`),
  ]);
  return {
    bookings: b.ok ? b.rows : [],
    progress: p.ok ? p.rows : [],
    records: r.ok ? r.rows : [],
    checkIns: c.ok ? c.rows : [],
  };
}

async function seedIfEmpty(bookings: Booking[], progress: ProgressEntry[], records: PrRecord[]) {
  if (bookings.length === 0) {
    for (const b of SEED_BOOKINGS) {
      await db.query(
        `INSERT INTO hos_bookings (ref, session_date, start_time, duration_min, trainer_id, trainer_name, session_type, location, status, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [b.ref, b.session_date, b.start_time, b.duration_min, b.trainer_id, b.trainer_name, b.session_type, b.location, b.status, b.notes],
      );
    }
  }
  if (progress.length === 0) {
    for (const p of SEED_PROGRESS) {
      await db.query(
        `INSERT INTO hos_progress (recorded_at, weight_kg, body_fat_pct, waist_cm, chest_cm, arm_cm, thigh_cm, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [p.recorded_at, p.weight_kg, p.body_fat_pct, p.waist_cm, p.chest_cm, p.arm_cm, p.thigh_cm, p.notes],
      );
    }
  }
  if (records.length === 0) {
    for (const r of SEED_RECORDS) {
      await db.query(
        "INSERT INTO hos_records (movement, value, unit, recorded_at) VALUES ($1,$2,$3,$4)",
        [r.movement, r.value, r.unit, r.recorded_at],
      );
    }
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [records, setRecords] = useState<PrRecord[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [version, setVersion] = useState(0);
  const [onboarding, setOnboarding] = useState<Onboarding>(DEFAULT_ONBOARDING);
  const logRef = useRef<Set<string>>(new Set());

  const load = useCallback(async () => {
    const first = await fetchAll();
    await seedIfEmpty(first.bookings, first.progress, first.records);
    const all = await fetchAll();
    setBookings(all.bookings);
    setProgress(all.progress);
    setRecords(all.records);
    setCheckIns(all.checkIns);
    setVersion((v) => v + 1);
    setReady(true);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createBooking = useCallback(async (b: Omit<Booking, "id" | "status">) => {
    const res = await db.query(
      `INSERT INTO hos_bookings (ref, session_date, start_time, duration_min, trainer_id, trainer_name, session_type, location, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'booked',$9)`,
      [b.ref, b.session_date, b.start_time, b.duration_min, b.trainer_id, b.trainer_name, b.session_type, b.location, b.notes],
    );
    await load();
    return res.ok;
  }, [load]);

  const setBookingStatus = useCallback(async (id: string, status: BookingStatus) => {
    await db.query("UPDATE hos_bookings SET status = $1 WHERE id = $2", [status, id]);
    await load();
  }, [load]);

  const deleteBooking = useCallback(async (id: string) => {
    await db.query("DELETE FROM hos_bookings WHERE id = $1", [id]);
    await load();
  }, [load]);

  const addProgress = useCallback(async (p: Omit<ProgressEntry, "id">) => {
    await db.query(
      `INSERT INTO hos_progress (recorded_at, weight_kg, body_fat_pct, waist_cm, chest_cm, arm_cm, thigh_cm, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [p.recorded_at, p.weight_kg, p.body_fat_pct, p.waist_cm, p.chest_cm, p.arm_cm, p.thigh_cm, p.notes],
    );
    await load();
  }, [load]);

  const deleteProgress = useCallback(async (id: string) => {
    await db.query("DELETE FROM hos_progress WHERE id = $1", [id]);
    await load();
  }, [load]);

  const addRecord = useCallback(async (r: Omit<PrRecord, "id">) => {
    await db.query("INSERT INTO hos_records (movement, value, unit, recorded_at) VALUES ($1,$2,$3,$4)", [
      r.movement, r.value, r.unit, r.recorded_at,
    ]);
    await load();
  }, [load]);

  const deleteRecord = useCallback(async (id: string) => {
    await db.query("DELETE FROM hos_records WHERE id = $1", [id]);
    await load();
  }, [load]);

  const checkIn = useCallback(async (ref: string, method: string) => {
    const res = await db.query(
      "INSERT INTO hos_checkins (method, ref, studio) VALUES ($1,$2,$3)",
      [method, ref, "House of Sante — Bandra West"],
    );
    const c = await db.query<CheckIn>(`SELECT ${CHECKIN_COLS} FROM hos_checkins ORDER BY checked_in_at DESC`);
    setCheckIns(c.ok ? c.rows : []);
    return res.ok;
  }, []);

  const toggleLog = useCallback((key: string) => {
    if (logRef.current.has(key)) logRef.current.delete(key);
    else logRef.current.add(key);
    setVersion((v) => v + 1);
  }, []);

  const isLogged = useCallback((key: string) => logRef.current.has(key), []);

  const saveOnboarding = useCallback((o: Onboarding) => setOnboarding(o), []);
  const signIn = useCallback(() => setOnboarding((o) => ({ ...o, signedIn: true })), []);
  const signOut = useCallback(() => setOnboarding(DEFAULT_ONBOARDING), []);

  /* "Explore demo" jumps straight to the dashboard: clears both the signedIn and
     completed gates so App's Guard does not bounce the user back to /login. */
  const enterDemo = useCallback(
    () =>
      setOnboarding({
        ...DEFAULT_ONBOARDING,
        signedIn: true,
        completed: true,
        name: "Demo Member",
        email: "demo@houseofsante.in",
        goals: ["Build strength", "Improve mobility"],
        experience: "intermediate",
        assessed: true,
      }),
    [],
  );

  const value: Store = {
    ready, bookings, progress, records, checkIns, version, onboarding,
    reload: load, createBooking, setBookingStatus, deleteBooking,
    addProgress, deleteProgress, addRecord, deleteRecord, checkIn,
    toggleLog, isLogged, saveOnboarding, signIn, signOut, enterDemo,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export { MEMBERSHIP, TODAY_PROGRAMME };
