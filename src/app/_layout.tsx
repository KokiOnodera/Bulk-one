import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider, useApp } from "../state/app-state";
function Navigation() {
  const { authenticated, profileCompleted } = useApp();
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          contentStyle: { backgroundColor: "#04090b" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Protected guard={!authenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={authenticated}>
          <Stack.Screen name="(onboarding)" />
          <Stack.Protected guard={profileCompleted}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="records" />
            <Stack.Screen name="workouts" />
            <Stack.Screen name="meals" />
            <Stack.Screen name="progress" />
            <Stack.Screen name="reviews" />
            <Stack.Screen name="settings" />
          </Stack.Protected>
        </Stack.Protected>
      </Stack>
    </>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Navigation />
      </AppProvider>
    </SafeAreaProvider>
  );
}
