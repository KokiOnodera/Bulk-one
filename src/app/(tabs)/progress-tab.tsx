import { useState } from "react";
import { router } from "expo-router";
import {
  Card,
  Choices,
  Copy,
  Heading,
  Menu,
  Row,
  Screen,
} from "../../components/ui";
import {
  MeasurementChart,
  NutritionSummary,
  useSummary,
} from "../../features/summary";
export default function Progress() {
  const app = useSummary();
  const [section, setSection] = useState("全体");
  const [period, setPeriod] = useState("1週間");
  const [now] = useState(() => Date.now());
  const cutoff =
    now - (period === "1週間" ? 7 : period === "1か月" ? 30 : 365) * 86400000;
  const entries = app.entries.filter(
    (e) => Date.parse(e.data.date.replace(" ", "T")) >= cutoff,
  );
  const workouts = entries.filter((e) => e.kind === "workout");
  const meals = entries.filter((e) => e.kind === "meal");
  const days = new Set(meals.map((e) => e.data.date.slice(0, 10))).size;
  return (
    <Screen
      back={false}
      title="進捗ダッシュボード"
      subtitle="数字で知る、あなたの積み重ね。"
    >
      <Choices
        options={["全体", "体組成", "食事", "運動", "目標"]}
        value={section}
        onChange={setSection}
      />
      <Choices
        options={["1週間", "1か月", "1年"]}
        value={period}
        onChange={setPeriod}
      />
      {["全体", "体組成"].includes(section) && (
        <>
          <Card green>
            <Heading>最新の体組成</Heading>
            <Row
              label="体重"
              value={app.latest ? `${app.latest.data.weight} kg` : "未記録"}
            />
            <Row
              label="体脂肪率"
              value={
                app.latest?.data.fat ? `${app.latest.data.fat}%` : "未記録"
              }
            />
          </Card>
          <MeasurementChart entries={entries} />
          <Menu
            icon="add-circle-outline"
            title="体組成を記録する"
            onPress={() => router.push("/progress/measurement")}
          />
          <Menu
            icon="time-outline"
            title="体組成の履歴を見る"
            onPress={() => router.push("/progress/history")}
          />
        </>
      )}
      {["全体", "食事"].includes(section) && (
        <>
          <NutritionSummary meals={meals} />
          <Card>
            <Row label="食事記録日数" value={`${days}日`} />
            <Copy>
              上の栄養値は選択期間の合計です。未記録日を0として平均しません。
            </Copy>
          </Card>
          <Menu
            icon="restaurant-outline"
            title="食事記録を見る"
            onPress={() => router.navigate("/meals-tab")}
          />
        </>
      )}
      {["全体", "運動"].includes(section) && (
        <>
          <Card>
            <Heading>運動の記録</Heading>
            <Row
              label="実施・変更して実施"
              value={`${workouts.filter((e) => ["実施", "変更して実施"].includes(e.data.status)).length}件`}
            />
            <Row
              label="スキップ・中断"
              value={`${workouts.filter((e) => ["スキップ", "中断"].includes(e.data.status)).length}件`}
            />
            <Row
              label="記録済み運動時間"
              value={
                workouts.some((e) => e.data.minutes)
                  ? `${workouts.reduce((sum, e) => sum + Number(e.data.minutes || 0), 0)}分`
                  : "未記録"
              }
            />
          </Card>
          <Menu
            icon="barbell-outline"
            title="運動履歴を見る"
            onPress={() => router.push("/workouts/history")}
          />
        </>
      )}
      {section === "目標" && (
        <Card>
          <Heading>目標との距離</Heading>
          <Row label="目標" value={app.profile.goal} />
          <Row label="目標体重" value={`${app.profile.target} kg`} />
          <Row
            label="現在の記録との差"
            value={
              app.latest
                ? `${(Number(app.latest.data.weight) - Number(app.profile.target)).toFixed(1)} kg`
                : "記録が不足しています"
            }
          />
          <Copy>十分な記録がない項目の評価や予測は表示しません。</Copy>
        </Card>
      )}
      <Menu
        icon="sparkles-outline"
        title="週次レビューを見る"
        onPress={() => router.push("/reviews")}
      />
    </Screen>
  );
}
