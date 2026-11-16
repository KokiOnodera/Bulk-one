import { createContext, PropsWithChildren, useContext, useState } from "react";

export type Form = Record<string, string>;
export type Entry = {
  id: string;
  kind: "meal" | "workout" | "measurement";
  data: Form;
};
const initial: Form = {
  name: "",
  sex: "",
  age: "",
  height: "",
  weight: "",
  fat: "",
  experience: "",
  goal: "",
  target: "",
  period: "",
  priorities: "",
  frequency: "",
  duration: "",
  place: "",
  equipment: "",
  food: "",
  restrictions: "",
  sleep: "",
  work: "",
  notes: "",
};
// UI fixture for an existing account until the profile/active-plan APIs are connected.
const existingDemoProfile: Form = {
  ...initial,
  name: "デモユーザー",
  sex: "男性",
  age: "28",
  height: "175",
  weight: "70",
  experience: "初心者｜これから始めたい",
  goal: "筋肉を増やしたい",
  target: "72",
  period: "3か月",
  priorities: "筋力トレーニング、食事管理",
  frequency: "週2〜3回",
  duration: "45分",
  place: "自宅",
  equipment: "器具なし",
  food: "自炊が多い",
};
function useStore() {
  // Keep launch completion for the app lifetime, including logout/account reset.
  const [launchFinished, setLaunchFinished] = useState(false);
  const [profile, setProfile] = useState<Form>(initial);
  const [authenticated, setAuthenticated] = useState(false);
  const [approved, setApproved] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [activeProfile, setActiveProfile] = useState<Form>({});
  const [entries, setEntries] = useState<Entry[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Form>>({});
  const [reviewDecision, setReviewDecision] = useState("");
  return {
    launchFinished,
    setLaunchFinished,
    signInExistingDemo: () => {
      if (!profileCompleted) {
        setProfile({ ...existingDemoProfile });
        setActiveProfile({ ...existingDemoProfile });
        setEntries([]);
        setDrafts({});
        setReviewDecision("");
        setApproved(true);
      }
      setProfileCompleted(true);
      setAuthenticated(true);
    },
    registerDemo: () => {
      setProfile({ ...initial });
      setActiveProfile({});
      setEntries([]);
      setDrafts({});
      setReviewDecision("");
      setApproved(false);
      setProfileCompleted(false);
      setAuthenticated(true);
    },
    profile,
    profileCompleted,
    completeProfile: () => setProfileCompleted(true),
    activeProfile,
    approvePlan: () => {
      setActiveProfile({ ...profile });
      setApproved(true);
    },
    updateProfile: (v: Form) => setProfile((p) => ({ ...p, ...v })),
    authenticated,
    setAuthenticated,
    approved,
    entries,
    drafts,
    setDraft: (key: string, v: Form) => setDrafts((d) => ({ ...d, [key]: v })),
    save: (kind: Entry["kind"], data: Form, id?: string) => {
      const entry = { kind, data, id: id || `${Date.now()}-${Math.random()}` };
      setEntries((e) => [entry, ...e.filter((x) => x.id !== entry.id)]);
      return entry.id;
    },
    remove: (id: string) => setEntries((e) => e.filter((x) => x.id !== id)),
    reviewDecision,
    setReviewDecision,
    reset: () => {
      setProfile(initial);
      setActiveProfile({});
      setEntries([]);
      setDrafts({});
      setApproved(false);
      setProfileCompleted(false);
      setAuthenticated(false);
      setReviewDecision("");
    },
  };
}
const Context = createContext<ReturnType<typeof useStore> | null>(null);
export function AppProvider({ children }: PropsWithChildren) {
  const store = useStore();
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error("AppProvider is missing");
  return value;
}
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function localTime() {
  return `${localDate()} ${new Date().toTimeString().slice(0, 5)}`;
}
export function isNumber(
  value: string,
  min: number,
  max: number,
  optional = false,
) {
  return (
    (optional && value.trim() === "") ||
    (value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= min &&
      Number(value) <= max)
  );
}
