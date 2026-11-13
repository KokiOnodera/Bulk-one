import { Text, View } from "react-native";
import { router } from "expo-router";
import {
  Button,
  Card,
  Copy,
  Heading,
  Menu,
  Notice,
  Row,
  Screen,
  colors,
} from "../../components/ui";
import { NutritionSummary, useSummary } from "../../features/summary";
export default function Home() {
  const app = useSummary();
  return (
    <Screen
      back={false}
      title={`${app.profile.name || "あなた"}さん、こんにちは！`}
      subtitle={new Date().toLocaleDateString("ja-JP", {
        month: "long",
        day: "numeric",
        weekday: "long",
      })}
    >
      <Notice>
        UIデモ・起動中のみデータを保持します。認証・AI・サーバー保存は未接続です。
      </Notice>
      <Card green>
        <View style={{ alignItems: "center", gap: 8, paddingVertical: 14 }}>
          <Copy>今日の記録</Copy>
          <View
            style={{
              width: 138,
              height: 138,
              borderRadius: 69,
              borderWidth: 9,
              borderColor: app.tasks ? colors.green : "#cfeee0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontSize: 34, fontWeight: "800", color: colors.ink }}
            >
              {app.tasks}
              <Text style={{ fontSize: 18 }}> / 3</Text>
            </Text>
            <Copy>運動・食事・体組成</Copy>
          </View>
        </View>
        <Row
          label="記録済みカロリー"
          value={app.calories === null ? "未記録" : `${app.calories} kcal`}
        />
        <Row
          label="最新体重"
          value={app.latest ? `${app.latest.data.weight} kg` : "未記録"}
        />
      </Card>
      <Heading>クイック記録</Heading>
      <Menu
        title="運動を記録"
        detail="実施・変更・スキップを記録"
        icon="barbell-outline"
        onPress={() => router.push("/workouts/log")}
      />
      <Menu
        title="食事を記録"
        detail="手動でカロリー・PFCを入力"
        icon="restaurant-outline"
        onPress={() => router.push("/meals/new")}
      />
      <Menu
        title="体重・体脂肪率を記録"
        detail="今日の変化を残しましょう"
        icon="scale-outline"
        onPress={() => router.push("/progress/measurement")}
      />
      <Button
        title="すべての記録メニュー"
        secondary
        onPress={() => router.push("/records")}
      />
      <NutritionSummary meals={app.meals} />
      <Card>
        <Heading>次のトレーニング</Heading>
        <Copy>承認済みデモプラン ・ 上半身</Copy>
        <Button
          title="メニューを確認する"
          onPress={() => router.navigate("/workout-tab")}
        />
      </Card>
      <Card green>
        <Heading>1週間を振り返りましょう</Heading>
        <Copy>運動・食事・体組成の記録から、次の一歩へ。</Copy>
        <Button
          title="週次レビューを見る"
          onPress={() => router.push("/reviews")}
        />
      </Card>
    </Screen>
  );
}
