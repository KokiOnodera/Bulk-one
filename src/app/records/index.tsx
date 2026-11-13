import { router } from "expo-router";
import { Menu, Notice, Screen } from "../../components/ui";
export default function Records() {
  return (
    <Screen
      title="記録をつける"
      subtitle="今日の小さな積み重ねを残しましょう。"
    >
      <Menu
        icon="barbell-outline"
        title="運動を記録"
        detail="トレーニング・ウォーキングなど"
        onPress={() => router.push("/workouts/log")}
      />
      <Menu
        icon="restaurant-outline"
        title="食事を記録"
        detail="食事名・カロリー・PFCを手動入力"
        onPress={() => router.push("/meals/new")}
      />
      <Menu
        icon="scale-outline"
        title="体重・体脂肪率を記録"
        detail="測定した数値を入力"
        onPress={() => router.push("/progress/measurement")}
      />
      <Notice>水分・睡眠・写真AI解析は準備中です。</Notice>
    </Screen>
  );
}
