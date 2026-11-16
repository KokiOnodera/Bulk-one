import { Redirect } from "expo-router";
import { useCallback } from "react";
import { LaunchSplash } from "../components/launch-splash";
import { useApp } from "../state/app-state";
export default function Index() {
  const { authenticated, profileCompleted, launchFinished, setLaunchFinished } =
    useApp();
  const complete = useCallback(
    () => setLaunchFinished(true),
    [setLaunchFinished],
  );
  if (!authenticated && !launchFinished)
    return <LaunchSplash onComplete={complete} />;
  return (
    <Redirect
      href={
        !authenticated ? "/welcome" : profileCompleted ? "/home" : "/profile"
      }
    />
  );
}
