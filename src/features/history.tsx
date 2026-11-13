import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  Button,
  Card,
  Choices,
  Copy,
  Field,
  Heading,
  Menu,
  Row,
  Screen,
} from "../components/ui";
import { Entry, localDate, useApp } from "../state/app-state";
import { MeasurementChart, NutritionSummary } from "./summary";
export function History({
  kind,
  tab = false,
}: {
  kind: Entry["kind"];
  tab?: boolean;
}) {
  const app = useApp();
  const [period, setPeriod] = useState("日別");
  const [date, setDate] = useState(localDate());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("すべて");
  const filtered = app.entries
    .filter(
      (e) =>
        e.kind === kind &&
        e.data.date?.startsWith(
          period === "日別" ? date : period === "月別" ? date.slice(0, 7) : "",
        ) &&
        (period !== "週別" ||
          (new Date(e.data.date.replace(" ", "T")) <=
            new Date(`${date}T23:59:59`) &&
            new Date(e.data.date.replace(" ", "T")) >=
              new Date(
                new Date(`${date}T00:00:00`).getTime() - 6 * 86400000,
              ))) &&
        (e.data.name || "").includes(search) &&
        (status === "すべて" || e.data.status === status),
    )
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
  const title =
    kind === "meal"
      ? "食事記録"
      : kind === "workout"
        ? "運動履歴"
        : "体組成の履歴";
  return (
    <Screen back={!tab} title={title} subtitle="記録した日々を、振り返る。">
      <Choices
        options={["日別", "週別", "月別"]}
        value={period}
        onChange={setPeriod}
      />
      <Field
        label={
          period === "週別"
            ? "週の最終日（YYYY-MM-DD）"
            : "対象日（YYYY-MM-DD）"
        }
        value={date}
        onChangeText={setDate}
      />
      {kind !== "measurement" && (
        <Field
          label={kind === "meal" ? "食事名で絞り込み" : "種目名で絞り込み"}
          value={search}
          onChangeText={setSearch}
        />
      )}
      {kind === "workout" && (
        <Choices
          options={["すべて", "実施", "変更して実施", "スキップ", "中断"]}
          value={status}
          onChange={setStatus}
        />
      )}
      {kind === "meal" && <NutritionSummary meals={filtered} />}
      {kind === "measurement" && <MeasurementChart entries={filtered} />}
      <Heading>{filtered.length}件の記録</Heading>
      {filtered.length ? (
        filtered.map((e) => (
          <Menu
            key={e.id}
            icon={
              kind === "meal"
                ? "restaurant-outline"
                : kind === "workout"
                  ? "barbell-outline"
                  : "scale-outline"
            }
            title={kind === "measurement" ? `${e.data.weight} kg` : e.data.name}
            detail={`${e.data.date} ・ ${kind === "meal" ? `${e.data.calories} kcal` : kind === "workout" ? e.data.status : e.data.fat ? `体脂肪率 ${e.data.fat}%` : "体脂肪率 未記録"}`}
            onPress={() =>
              router.push({ pathname: "/records/detail", params: { id: e.id } })
            }
          />
        ))
      ) : (
        <Card>
          <Heading>まだ記録がありません</Heading>
          <Copy>
            この期間に一致する記録はありません。条件を変更するか、最初の記録を追加してください。
          </Copy>
        </Card>
      )}
      <Button
        title="記録を追加する"
        onPress={() =>
          router.push(
            kind === "meal"
              ? "/meals/new"
              : kind === "workout"
                ? "/workouts/log"
                : "/progress/measurement",
          )
        }
      />
    </Screen>
  );
}
export function RecordDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const app = useApp();
  const entry = app.entries.find((e) => e.id === id);
  const [confirm, setConfirm] = useState(false);
  if (!entry)
    return (
      <Screen title="記録が見つかりません">
        <Button
          title="ホームへ戻る"
          onPress={() => router.dismissTo("/home")}
        />
      </Screen>
    );
  const labels: Record<string, string> = {
    date: "日時",
    category: "食事区分",
    status: "実施状況",
    name: "名称",
    notes: "メモ",
    calories: "カロリー (kcal)",
    protein: "タンパク質 (g)",
    fat: entry.kind === "meal" ? "脂質 (g)" : "体脂肪率 (%)",
    carbs: "炭水化物 (g)",
    weight: "体重 (kg)",
    muscle: "筋肉量 (kg)",
    minutes: "運動時間 (分)",
    fatigue: "疲労度",
    reason: "変更・スキップ理由",
  };
  const keys =
    entry.kind === "meal"
      ? [
          "date",
          "category",
          "name",
          "calories",
          "protein",
          "fat",
          "carbs",
          "notes",
        ]
      : entry.kind === "measurement"
        ? ["date", "weight", "fat", "muscle", "notes"]
        : ["date", "name", "status", "minutes", "fatigue", "reason", "notes"];
  return (
    <Screen title="記録の詳細" subtitle="手動で入力した記録">
      <Card>
        {keys.map((key) => (
          <Row
            key={key}
            label={labels[key]}
            value={entry.data[key] || "未記録"}
          />
        ))}
        {entry.kind === "workout" &&
          (
            JSON.parse(entry.data.sets || "[]") as {
              weight: string;
              reps: string;
            }[]
          ).map((set, i) => (
            <Row
              key={i}
              label={`${i + 1}セット目`}
              value={`${set.weight || "—"} kg × ${set.reps || "—"} 回`}
            />
          ))}
      </Card>
      <Button
        title="編集する"
        onPress={() =>
          router.push({
            pathname:
              entry.kind === "meal"
                ? "/meals/new"
                : entry.kind === "workout"
                  ? "/workouts/log"
                  : "/progress/measurement",
            params: { id: entry.id },
          })
        }
      />
      {confirm ? (
        <Card>
          <Heading>この記録を削除しますか？</Heading>
          <Copy>デモ内から削除します。元に戻せません。</Copy>
          <Button
            title="削除する"
            danger
            onPress={() => {
              app.remove(entry.id);
              router.back();
            }}
          />
          <Button
            title="キャンセル"
            secondary
            onPress={() => setConfirm(false)}
          />
        </Card>
      ) : (
        <Button
          title="この記録を削除する"
          danger
          onPress={() => setConfirm(true)}
        />
      )}
    </Screen>
  );
}
