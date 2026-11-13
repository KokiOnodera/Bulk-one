import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import {
  Button,
  Card,
  Copy,
  Heading,
  Icon,
  Notice,
  Screen,
  colors,
} from "../../components/ui";
export default function Generating() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  useEffect(() => {
    if (status !== "loading") return;
    const timer = setTimeout(() => setStatus("done"), 1600);
    return () => clearTimeout(timer);
  }, [status]);
  return (
    <Screen
      title={
        status === "done"
          ? "プランの準備ができました"
          : "あなたに合うプランを。"
      }
      subtitle="毎日続けられる、小さな一歩から。"
      footer={
        status === "done" ? (
          <Button
            title="プランを確認する"
            onPress={() => router.replace("/plan-preview")}
          />
        ) : status === "loading" ? (
          <Button
            title="デモのエラー表示を確認"
            secondary
            onPress={() => setStatus("error")}
          />
        ) : (
          <Button
            title={status === "error" ? "再試行する" : "デモプランを準備する"}
            onPress={() => setStatus("loading")}
          />
        )
      }
    >
      <Notice>
        AI未接続のUIデモです。ここでは固定のサンプルプランを表示します。
      </Notice>
      <View style={{ alignItems: "center", paddingVertical: 50 }}>
        {status === "loading" ? (
          <ActivityIndicator size="large" color={colors.green} />
        ) : (
          <Icon
            name={
              status === "done"
                ? "checkmark-circle"
                : status === "error"
                  ? "cloud-offline-outline"
                  : "sparkles-outline"
            }
            size={80}
          />
        )}
      </View>
      <Card>
        <Heading>
          {status === "loading"
            ? "デモプランを準備中…"
            : status === "done"
              ? "内容を確認してから始めましょう"
              : status === "error"
                ? "処理に失敗しました（デモ）"
                : "入力条件を確認しました"}
        </Heading>
        <Copy>
          {status === "error"
            ? "入力した条件は保持されています。再試行できます。"
            : "プランはまだ適用されていません。次の画面で内容を確認し、承認できます。"}
        </Copy>
      </Card>
    </Screen>
  );
}
