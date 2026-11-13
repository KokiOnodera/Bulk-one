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
function useStore() {
  const [profile, setProfile] = useState<Form>(initial);
  const [authenticated, setAuthenticated] = useState(false);
  const [approved, setApproved] = useState(false);
  const [activeProfile, setActiveProfile] = useState<Form>({});
  const [entries, setEntries] = useState<Entry[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Form>>({});
  const [reviewDecision, setReviewDecision] = useState("");
  return {
    profile,
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
