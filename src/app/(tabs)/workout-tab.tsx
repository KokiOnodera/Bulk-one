import { router } from "expo-router";
import { Button, Card, Copy, Heading, Menu, Screen } from "../../components/ui";
import { TrainingPlan } from "../../features/plan";
import { useApp } from "../../state/app-state";
export default function Workouts() {
  const { approved } = useApp();
  return (
    <Screen
      back={false}
      title="トレーニングプラン"
      subtitle="自分のペースで、少しずつ。"
    >
      <Menu
        icon="calendar-outline"
        title="運動履歴"
        detail="実施・変更・スキップを確認"
        onPress={() => router.push("/workouts/history")}
      />
      {approved ? (
        <TrainingPlan />
      ) : (
        <Card green>
          <Heading>最初の運動プランを作りましょう</Heading>
          <Copy>
            運動を開始する前に、頻度・器具・生活スタイルに合うプランを確認します。
          </Copy>
        </Card>
      )}
      <Button
        title={approved ? "今日の運動を記録する" : "運動を開始する"}
        onPress={() => router.push("/workouts/log")}
      />
      {approved && (
        <Menu
          icon="document-text-outline"
          title="承認済みプランの概要"
          onPress={() => router.push("/settings/plan")}
        />
      )}
      {approved && (
        <Button
          secondary
          title="プランを変更する"
          onPress={() => router.push("/constraints")}
        />
      )}
    </Screen>
  );
}
