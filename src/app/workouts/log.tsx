import { RecordForm } from "../../features/record-form";
import { Redirect } from "expo-router";
import { useApp } from "../../state/app-state";
export default function Log() {
  const { approved } = useApp();
  if (!approved) return <Redirect href="/constraints" />;
  return <RecordForm kind="workout" />;
}
