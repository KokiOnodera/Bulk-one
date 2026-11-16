import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from './ui';

/** S-001-01: a brief branded introduction, not a simulated loading percentage. */
export function LaunchSplash({ onComplete }: { onComplete: () => void }) {
  const [imageReady, setImageReady] = useState(false);
  useEffect(() => {
    if (!imageReady) return;
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [imageReady, onComplete]);

  return (
    <View style={styles.screen} testID="launch-splash">
      <StatusBar style="light" />
      <ImageBackground
        source={require("../../assets/splash-gym.png")}
        style={styles.background}
        resizeMode="cover"
        onLoadEnd={() => setImageReady(true)}
        accessible={false}
      />
      <LinearGradient
        colors={[
          "rgba(4,9,11,0.12)",
          "rgba(4,9,11,0.06)",
          "rgba(4,9,11,0.68)",
          "#04090b",
        ]}
        locations={[0, 0.35, 0.72, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <SafeAreaView style={styles.safe}>
        <View style={styles.identity}>
          <View
            accessible
            accessibilityLabel="BULK ONE"
            accessibilityRole="header"
            style={styles.wordmark}
          >
            <Text maxFontSizeMultiplier={1.3} style={styles.bulk}>
              BULK
            </Text>
            <Text maxFontSizeMultiplier={1.3} style={styles.one}>
              ONE
            </Text>
          </View>
          <Text style={styles.tagline}>理想の身体へ、{"\n"}迷わず進める。</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.description}>トレーニング × 食事 × 体組成</Text>
          <Text style={styles.support}>AIがあなたの身体づくりをサポート</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { position: 'absolute', width: '100%', height: '100%' },
  screen: { flex: 1, backgroundColor: "#04090b" },
  safe: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 32 },
  identity: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    marginBottom: 42,
  },
  wordmark: { alignSelf: "center", width: "100%", maxWidth: 320 },
  bulk: {
    color: "#fff",
    fontSize: 80,
    lineHeight: 85,
    fontWeight: "900",
    fontStyle: "italic",
    letterSpacing: -3,
  },
  one: {
    color: colors.green,
    fontSize: 80,
    lineHeight: 85,
    fontWeight: "900",
    fontStyle: "italic",
    letterSpacing: -3,
    alignSelf: "flex-end",
    marginTop: -12,
  },
  tagline: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    lineHeight: 32,
    letterSpacing: 1,
    marginTop: 28,
  },
  footer: { alignItems: "center", gap: 6, paddingBottom: 24 },
  description: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 21,
    letterSpacing: 0.8,
  },
  support: { color: "#d4d9d8", fontSize: 12, lineHeight: 20 },
});
