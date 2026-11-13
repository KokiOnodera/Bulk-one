import { router } from "expo-router";
import { Button, Menu, Screen } from "../../components/ui";
import { TrainingPlan } from "../../features/plan";
export default function Workouts() {
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
      <TrainingPlan />
      <Button
        title="今日の運動を記録する"
        onPress={() => router.push("/workouts/log")}
      />
      <Menu
        icon="document-text-outline"
        title="承認済みプランの概要"
        onPress={() => router.push("/settings/plan")}
      />
    </Screen>
  );
}
