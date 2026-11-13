import { Redirect } from "expo-router";
import { useCallback, useState } from "react";
import { LaunchSplash } from "../components/launch-splash";
import { useApp } from "../state/app-state";
export default function Index() {
  const { authenticated, approved } = useApp();
  const [finished, setFinished] = useState(false);
  const complete = useCallback(() => setFinished(true), []);
  if (!finished) return <LaunchSplash onComplete={complete} />;
  return (
    <Redirect
      href={!authenticated ? "/welcome" : approved ? "/home" : "/profile"}
    />
  );
}
