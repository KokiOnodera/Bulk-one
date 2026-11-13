import { Text, View } from "react-native";
import { Card, Copy, Heading, Row, colors } from "../components/ui";
import { Entry, localDate, useApp } from "../state/app-state";
export function useSummary() {
  const app = useApp();
  const today = app.entries.filter((e) => e.data.date?.startsWith(localDate()));
  const meals = today.filter((e) => e.kind === "meal");
  const workouts = today.filter((e) => e.kind === "workout");
  const latest = app.entries
    .filter((e) => e.kind === "measurement")
    .sort((a, b) => b.data.date.localeCompare(a.data.date))[0];
  return {
    ...app,
    today,
    meals,
    workouts,
    latest,
    calories: meals.length
      ? meals.reduce((sum, e) => sum + Number(e.data.calories), 0)
      : null,
    tasks:
      Number(meals.length > 0) +
      Number(workouts.length > 0) +
      Number(today.some((e) => e.kind === "measurement")),
  };
}
export function NutritionSummary({ meals }: { meals: Entry[] }) {
  return (
    <Card>
      <Heading>栄養バランス</Heading>
      {[
        ["calories", "カロリー", "kcal", 2100],
        ["protein", "タンパク質", "g", 120],
        ["fat", "脂質", "g", 60],
        ["carbs", "炭水化物", "g", 270],
      ].map(([key, label, unit, target]) => {
        const known = meals.filter((e) => e.data[String(key)] !== "");
        const value = known.reduce(
          (sum, e) => sum + Number(e.data[String(key)]),
          0,
        );
        return (
          <View key={key}>
            <Row
              label={String(label)}
              value={
                known.length
                  ? `${value.toFixed(0)} / ${target} ${unit}${known.length < meals.length ? "（一部未入力）" : ""}`
                  : "未記録"
              }
            />
            <View
              style={{ height: 5, backgroundColor: "#edf1ef", borderRadius: 3 }}
            >
              <View
                style={{
                  width: `${Math.min(100, (value / Number(target)) * 100)}%`,
                  height: 5,
                  backgroundColor: colors.green,
                  borderRadius: 3,
                }}
              />
            </View>
          </View>
        );
      })}
      <Copy>目標は承認したデモプランの固定サンプル値です。</Copy>
    </Card>
  );
}
export function MeasurementChart({ entries }: { entries: Entry[] }) {
  const points = entries
    .filter((e) => e.kind === "measurement")
    .sort((a, b) => a.data.date.localeCompare(b.data.date))
    .slice(-7);
  const values = points.map((e) => Number(e.data.weight));
  const min = Math.min(...values) - 1;
  const max = Math.max(...values) + 1;
  return (
    <Card>
      <Heading>体重の推移</Heading>
      {points.length ? (
        <View
          accessibilityLabel="記録した体重の推移"
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 8,
            height: 165,
          }}
        >
          {points.map((e) => (
            <View key={e.id} style={{ flex: 1, alignItems: "center", gap: 8 }}>
              <Text style={{ color: colors.ink, fontSize: 11 }}>
                {e.data.weight}
              </Text>
              <View
                style={{
                  height:
                    20 + ((Number(e.data.weight) - min) / (max - min)) * 75,
                  width: 12,
                  backgroundColor: colors.green,
                  borderRadius: 5,
                }}
              />
              <Text style={{ fontSize: 9, color: colors.muted }}>
                {e.data.date.slice(5, 10)}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Copy>まだ測定データがありません。最初の記録を追加しましょう。</Copy>
      )}
      <Copy>記録がある測定日のみ表示します。</Copy>
    </Card>
  );
}
