export type Trainer = {
  id: string;
  name: string;
  title: string;
  initials: string;
  specialty: string[];
  accent: string;
  isAssigned?: boolean;
  rating: number;
  sessions: number;
  bio: string;
  certifications: string[];
};

export const TRAINERS: Trainer[] = [
  {
    id: "arjun-mehta",
    name: "Arjun Mehta",
    title: "Head Coach — Strength",
    initials: "AM",
    specialty: ["Strength", "Powerlifting", "HYROX"],
    accent: "#6d28d9",
    isAssigned: true,
    rating: 4.9,
    sessions: 1240,
    bio: "Fifteen years on the floor and a national-level deadlift in the back pocket. Arjun builds strength that transfers — barbell first, ego last.",
    certifications: ["NSCA-CSCS", "Precision Nutrition L1", "HYROX L2"],
  },
  {
    id: "maya-rao",
    name: "Maya Rao",
    title: "Senior Coach — HYROX & Conditioning",
    initials: "MR",
    specialty: ["HYROX", "Metabolic", "Endurance"],
    accent: "#8b5cf6",
    rating: 4.8,
    sessions: 980,
    bio: "Two HYROX Pro Doubles finishes and a background in rowing. Maya turns engines that die at minute six into engines that last the full distance.",
    certifications: ["HYROX L3", "TRX Suspension", "Altitude Camp"],
  },
  {
    id: "dev-kapoor",
    name: "Dev Kapoor",
    title: "Coach — Mobility & Rehab",
    initials: "DK",
    specialty: ["Mobility", "Rehab", "Posture"],
    accent: "#a78bfa",
    rating: 4.9,
    sessions: 760,
    bio: "A physiotherapist who became a coach. Dev works with members returning from injury and anyone whose desk job is winning.",
    certifications: ["MPT Physiotherapy", "FRC Mobility", "Cupping Therapy"],
  },
  {
    id: "zoya-khan",
    name: "Zoya Khan",
    title: "Coach — Performance & Nutrition",
    initials: "ZK",
    specialty: ["Performance", "Nutrition", "Fat loss"],
    accent: "#4c1d95",
    rating: 4.7,
    sessions: 640,
    bio: "Dietitian by training, competitor by temperament. Zoya pairs the numbers on the bar with the numbers on the plate.",
    certifications: ["Registered Dietitian", "ISSA Nutrition", "PN L2"],
  },
];

export type SessionType = {
  id: string;
  name: string;
  duration: number;
  price: number;
  blurb: string;
  capacity: number;
};

export const SESSION_TYPES: SessionType[] = [
  {
    id: "pt",
    name: "1:1 Personal Training",
    duration: 60,
    price: 1800,
    blurb: "Private coaching, fully programmed around you.",
    capacity: 1,
  },
  {
    id: "pt60",
    name: "1:1 Express",
    duration: 45,
    price: 1400,
    blurb: "A focused 45 minutes. Ideal between meetings.",
    capacity: 1,
  },
  {
    id: "duo",
    name: "Duo Training",
    duration: 60,
    price: 1300,
    blurb: "Train with one other member. Shared energy, split cost.",
    capacity: 2,
  },
  {
    id: "hyrox",
    name: "HYROX Group",
    duration: 75,
    price: 1100,
    blurb: "Race-specific conditioning in a small group of six.",
    capacity: 6,
  },
];

export type Exercise = {
  id: string;
  name: string;
  group: string;
  cue: string;
  sets: number;
  reps: string;
  load: string;
  rest: string;
  coachNote?: string;
};

export type WorkoutBlock = {
  id: string;
  title: string;
  focus: string;
  durationMin: number;
  exercises: Exercise[];
};

export const TODAY_PROGRAMME: WorkoutBlock[] = [
  {
    id: "warmup",
    title: "Warm-Up",
    focus: "Raise temperature, prep hips and thoracic spine",
    durationMin: 10,
    exercises: [
      {
        id: "w1",
        name: "90/90 Hip Flow",
        group: "Mobility",
        cue: "Slow, nose to floor. No bouncing.",
        sets: 2,
        reps: "8 / side",
        load: "Bodyweight",
        rest: "30s",
      },
      {
        id: "w2",
        name: "Band Pull-Apart",
        group: "Warm-up",
        cue: "Pull apart, pause 2s at the top.",
        sets: 2,
        reps: "15",
        load: "Light band",
        rest: "30s",
      },
      {
        id: "w3",
        name: "Leg Swing with T-Spine Rotation",
        group: "Mobility",
        cue: "Reach through the ceiling on every rep.",
        sets: 2,
        reps: "10 / side",
        load: "Bodyweight",
        rest: "30s",
      },
    ],
  },
  {
    id: "strength",
    title: "Strength — Lower",
    focus: "Posterior chain and unilateral strength",
    durationMin: 30,
    exercises: [
      {
        id: "s1",
        name: "Trap Bar Deadlift",
        group: "Primary",
        cue: "Brace hard, push the floor away. Stop when the bar meets your shins.",
        sets: 5,
        reps: "5",
        load: "80 kg",
        rest: "2 min 30",
        coachNote: "Add 10 kg next week if all sets feel like a solid 8.",
      },
      {
        id: "s2",
        name: "Bulgarian Split Squat",
        group: "Unilateral",
        cue: "Front shin vertical, drive the floor away.",
        sets: 3,
        reps: "10 / side",
        load: "20 kg DBs",
        rest: "90s",
        coachNote: "Short foot stride this week — go deeper, not faster.",
      },
      {
        id: "s3",
        name: "Romanian Deadlift",
        group: "Hinge",
        cue: "Squeeze the bar to your legs. Hips travel back.",
        sets: 3,
        reps: "10",
        load: "50 kg",
        rest: "2 min",
      },
      {
        id: "s4",
        name: "Seated Leg Curl",
        group: "Hamstrings",
        cue: "No hip lift. Slow three-second negative.",
        sets: 3,
        reps: "12",
        load: "45 kg",
        rest: "75s",
      },
    ],
  },
  {
    id: "hyrox",
    title: "HYROX Circuit",
    focus: "Race-specific station quality",
    durationMin: 25,
    exercises: [
      {
        id: "h1",
        name: "SkiErg — 1 km",
        group: "Station 1",
        cue: "Ski to the damper, tall arms, no upper body.",
        sets: 1,
        reps: "1 km",
        load: "Damper 6",
        rest: "2 min",
        coachNote: "Your benchmark is 4:38. Today is a pacing run — no sprinting.",
      },
      {
        id: "h2",
        name: "Sled Push — 4 x 12.5 m",
        group: "Station 2",
        cue: "Low body angle, short sharp steps.",
        sets: 4,
        reps: "12.5 m",
        load: "80 kg",
        rest: "60s",
      },
      {
        id: "h3",
        name: "Burpee Broad Jump",
        group: "Station 3",
        cue: "Chest to floor, full hip extension, land soft.",
        sets: 4,
        reps: "10",
        load: "Bodyweight",
        rest: "75s",
      },
      {
        id: "h4",
        name: "Row — 500 m",
        group: "Station 4",
        cue: "Legs, then body, then arms. Reverse on the return.",
        sets: 1,
        reps: "500 m",
        load: "Damper 5",
        rest: "2 min",
      },
    ],
  },
];

export type HyroxMovement = {
  current: number;
  best: number;
  unit: string;
  delta: string;
  higherIsBetter: boolean;
};

export const HYROX_MOVEMENTS: Record<string, HyroxMovement> = {
  Running: { current: 2930, best: 2885, unit: "m", delta: "-45s", higherIsBetter: true },
  SkiErg: { current: 278, best: 262, unit: "m", delta: "-16s", higherIsBetter: true },
  "Sled Push": { current: 412, best: 400, unit: "m", delta: "-12s", higherIsBetter: true },
  "Sled Pull": { current: 508, best: 505, unit: "m", delta: "-3s", higherIsBetter: true },
  "Burpee Broad Jump": {
    current: 14,
    best: 16,
    unit: "m",
    delta: "+2 m",
    higherIsBetter: true,
  },
  Rowing: { current: 431, best: 420, unit: "m", delta: "-11s", higherIsBetter: true },
  "Farmer's Carry": {
    current: 50,
    best: 50,
    unit: "m",
    delta: "on target",
    higherIsBetter: true,
  },
  Lunges: { current: 82, best: 88, unit: "reps", delta: "+6 reps", higherIsBetter: true },
  "Wall Balls": { current: 102, best: 110, unit: "reps", delta: "+8 reps", higherIsBetter: true },
};

export const HYROX_EVENTS = [
  {
    name: "Championship Mumbai",
    date: "Mar 2027",
    status: "Registered",
    accent: "#6d28d9",
  },
  {
    name: "Signature Race",
    date: "Jan 2027",
    status: "In training",
    accent: "#8b5cf6",
  },
  {
    name: "Pune 15K Race",
    date: "Nov 2026",
    status: "Finished 1:02:41",
    accent: "#a78bfa",
  },
];

export type PackageTier = {
  id: string;
  name: string;
  sessions: number;
  price: number;
  perSession: number;
  validityDays: number;
  perks: string[];
  popular?: boolean;
};

export const PACKAGES: PackageTier[] = [
  {
    id: "p-8",
    name: "Foundation",
    sessions: 8,
    price: 12800,
    perSession: 1600,
    validityDays: 90,
    perks: ["1:1 coaching", "Programme refresh every 4 weeks", "Progress tracking"],
  },
  {
    id: "p-16",
    name: "Serious",
    sessions: 16,
    price: 23000,
    perSession: 1437,
    validityDays: 120,
    perks: [
      "1:1 coaching",
      "Priority booking slots",
      "Monthly body composition scan",
      "Nutrition guidance",
    ],
    popular: true,
  },
  {
    id: "p-24",
    name: "Elite",
    sessions: 24,
    price: 31500,
    perSession: 1312,
    validityDays: 180,
    perks: [
      "1:1 coaching",
      "Unlimited reschedules",
      "HYROX race programming",
      "Quarterly assessment",
      "Guest passes",
    ],
  },
];

export type Membership = {
  id: string;
  name: string;
  purchased: number;
  used: number;
  bonus: number;
  startDate: string;
  expiryDate: string;
  status: "Active" | "Expiring" | "Paused";
  price: number;
};

export const MEMBERSHIP: Membership = {
  id: "PKG-2291",
  name: "Serious — 16 Session Package",
  purchased: 16,
  used: 11,
  bonus: 2,
  startDate: "2026-08-02",
  expiryDate: "2026-11-30",
  status: "Active",
  price: 23000,
};

export type Invoice = {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: "Paid" | "Partial" | "Pending";
  method: string;
};

export const INVOICES: Invoice[] = [
  {
    id: "INV-8841",
    title: "Serious — 16 Session Package",
    date: "2026-08-02",
    amount: 23000,
    status: "Paid",
    method: "UPI ending 4412",
  },
  {
    id: "INV-8602",
    title: "Foundation — 8 Session Package",
    date: "2026-05-14",
    amount: 11800,
    status: "Paid",
    method: "Card ending 9031",
  },
  {
    id: "INV-8300",
    title: "HYROX Race Entry — Signature",
    date: "2026-03-02",
    amount: 6500,
    status: "Paid",
    method: "UPI ending 4412",
  },
];

export type NotificationKind =
  | "reminder"
  | "program"
  | "payment"
  | "record"
  | "announcement";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
};

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    kind: "reminder",
    title: "Session in 2 hours",
    body: "Lower body strength with Arjun. Studio Floor 2.",
    time: "09:12",
  },
  {
    id: "n2",
    kind: "program",
    title: "New programme assigned",
    body: "Arjun updated your Lower Strength block. Four exercises changed.",
    time: "Yesterday",
  },
  {
    id: "n3",
    kind: "payment",
    title: "Low session balance",
    body: "You have 7 sessions left. Valid until 30 Nov 2026.",
    time: "2 days ago",
  },
  {
    id: "n4",
    kind: "record",
    title: "New personal best",
    body: "Wall Balls — 102 reps. Previous best 94.",
    time: "4 days ago",
  },
  {
    id: "n5",
    kind: "announcement",
    title: "Studio hours extended",
    body: "We are now open until 9 PM on weekdays from 1 October.",
    time: "1 week ago",
  },
];

export const GOALS = [
  "Lose body fat",
  "Build muscle",
  "Get stronger",
  "Run my first HYROX",
  "Move pain-free",
  "Improve posture",
  "Build consistency",
  "Prepare for an event",
];

export const EXPERIENCE_LEVELS = [
  "Complete beginner",
  "Some gym experience",
  "Regularly trained (1-3 yrs)",
  "Advanced / competitive",
];

export const TRAINING_PREFS = [
  "Barbell strength",
  "Free weights",
  "Functional circuits",
  "Mobility and rehab",
  "Conditioning / intervals",
  "HYROX race prep",
];

export const HEALTH_FLAGS = [
  "Lower back issues",
  "Knee pain",
  "Shoulder impingement",
  "High blood pressure",
  "Recent surgery",
  "None of these",
];

export const MEASUREMENT_FIELDS = [
  { key: "weight_kg", label: "Body weight", unit: "kg", step: 0.1 },
  { key: "body_fat_pct", label: "Body fat", unit: "%", step: 0.1 },
  { key: "waist_cm", label: "Waist", unit: "cm", step: 0.5 },
  { key: "chest_cm", label: "Chest", unit: "cm", step: 0.5 },
  { key: "arm_cm", label: "Arm", unit: "cm", step: 0.5 },
  { key: "thigh_cm", label: "Thigh", unit: "cm", step: 0.5 },
] as const;

export type MeasurementKey = (typeof MEASUREMENT_FIELDS)[number]["key"];

export const FATIGUE_SCALE = [
  { value: 1, label: "Fresh", note: "Rested, ready to go" },
  { value: 2, label: "Light", note: "Slept well" },
  { value: 3, label: "Okay", note: "Average energy" },
  { value: 4, label: "Tired", note: "Late night, hard day" },
  { value: 5, label: "Drained", note: "Modify today please" },
];

export const STUDIO = {
  name: "House of Santè",
  tagline: "Personal Training Studio",
  address: "Level 2, Azad Lane, Bandra West, Mumbai 400050",
  phone: "+91 98200 41122",
  hours: "Mon–Fri 6 AM – 9 PM • Sat–Sun 8 AM – 6 PM",
  email: "studio@houseofsante.in",
};
