import { useCallback, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  Button,
  Card,
  Choices,
  Copy,
  ErrorText,
  Field,
  Heading,
  Icon,
  Menu,
  Notice,
  Row,
  Screen,
  Steps,
} from "../components/ui";
import { Entry, Form, isNumber, localTime, useApp } from "../state/app-state";
import { MealPhoto } from "../components/meal-photo";
import { CalendarDateTime } from "../components/calendar-date-time";
import { HealthcareImport } from "../components/healthcare-import";
const fields = {
  meal: [
    ["calories", "カロリー", "kcal", "number"],
    ["protein", "タンパク質（任意）", "g", "optional"],
    ["fat", "脂質（任意）", "g", "optional"],
    ["carbs", "炭水化物（任意）", "g", "optional"],
  ],
  workout: [
    ["name", "種目名", "", "text"],
    ["minutes", "運動時間（任意）", "分", "optional"],
    ["fatigue", "主観的疲労度（任意・1〜10）", "", "optional"],
  ],
  measurement: [
    ["weight", "体重", "kg", "number"],
    ["fat", "体脂肪率（任意）", "%", "optional"],
    ["muscle", "筋肉量（任意）", "kg", "optional"],
  ],
};
export function RecordForm({ kind }: { kind: Entry["kind"] }) {
  const app = useApp();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = app.entries.find((e) => e.id === id);
  const key = id || kind;
  const blank = {
    date: localTime(),
    category: "",
    status: "実施",
    name: "",
    dishIds: "[]",
    photoUri: "",
    notes: "",
    calories: "",
    protein: "",
    fat: "",
    carbs: "",
    weight: "",
    muscle: "",
    minutes: "",
    fatigue: "",
    reason: "",
    sets: '[{"weight":"","reps":""}]',
  };
  const [form, setForm] = useState<Form>(() => {
    const saved = existing?.data || app.drafts[key];
    return { ...blank, ...saved, date: saved?.date || localTime() };
  });
  const [stage, setStage] = useState(0);
  const [savedId, setSavedId] = useState(id);
  const [error, setError] = useState("");
  const selectionDraft = app.drafts[key];
  useFocusEffect(
    useCallback(() => {
      if (kind !== "meal" || selectionDraft?.dishIds === undefined) return;
      setForm((current) =>
        current.name === selectionDraft.name &&
        current.dishIds === selectionDraft.dishIds
          ? current
          : {
              ...current,
              name: selectionDraft.name || "",
              dishIds: selectionDraft.dishIds,
            },
      );
    }, [kind, selectionDraft]),
  );
  const update = (v: Form) => {
    const next = { ...form, ...v };
    setForm(next);
    app.setDraft(key, next);
  };
  const title = { meal: "食事", workout: "運動", measurement: "体組成" }[kind];
  const sets: { weight: string; reps: string }[] = JSON.parse(
    form.sets || "[]",
  );
  const validate = () => {
    if (
      !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(form.date) ||
      Number.isNaN(Date.parse(form.date.replace(" ", "T"))) ||
      new Date(form.date.replace(" ", "T")) > new Date()
    )
      return "過去または現在の有効な日時を YYYY-MM-DD HH:mm で入力してください。";
    if (kind === "meal" && !form.category)
      return "食事区分を選択してください。";
    if (kind === "meal" && !form.name.trim())
      return "料理を1つ以上選択してください。";
    for (const [key, label, , type] of fields[kind]) {
      if (type === "text" && !form[key]?.trim())
        return `${label}を入力してください。`;
      if (type !== "text") {
        const range =
          key === "weight"
            ? [30, 300]
            : key === "fat" && kind === "measurement"
              ? [1, 70]
              : key === "fatigue"
                ? [1, 10]
                : [0, key === "calories" ? 10000 : 1000];
        if (!isNumber(form[key] || "", range[0], range[1], type === "optional"))
          return `${label}を${range[0]}〜${range[1]}の範囲で入力してください。`;
      }
    }
    if (
      kind === "workout" &&
      sets.some(
        (x) =>
          !isNumber(x.weight, 0, 500, true) || !isNumber(x.reps, 1, 1000, true),
      )
    )
      return "セットの重量・回数を確認してください。";
    return "";
  };
  const next = () => {
    setError("");
    if (stage === 0) {
      setStage(1);
      return;
    }
    if (stage === 1) {
      const error = validate();
      if (error) return setError(error);
      setStage(2);
      return;
    }
    if (stage === 2) {
      if (
        (kind === "measurement" || kind === "workout") &&
        form.healthkitId &&
        app.entries.some(
          (entry) =>
            entry.kind === kind &&
            entry.id !== savedId &&
            entry.data.healthkitId === form.healthkitId,
        )
      ) {
        setError(
          "このヘルスケアのデータは既に保存されています。履歴から確認してください。",
        );
        return;
      }
      setSavedId(app.save(kind, form, savedId));
      app.setDraft(key, {});
      setStage(3);
    }
  };
  return (
    <Screen
      onBack={
        stage > 0
          ? () => {
              setError("");
              setStage(stage - 1);
            }
          : undefined
      }
      title={
        stage === 3
          ? `${title}を記録しました`
          : stage === 2
            ? "入力内容の確認"
            : `${title}を記録`
      }
      subtitle={
        stage === 3
          ? "このデモの起動中に保存されています。"
          : "手動入力 ・ 入力途中の内容は画面を戻っても保持されます。"
      }
      footer={
        stage === 3 ? (
          <>
            <Button
              title={
                kind === "meal"
                  ? "食事記録一覧を見る"
                  : kind === "workout"
                    ? "運動履歴を見る"
                    : "進捗ダッシュボードを見る"
              }
              onPress={() =>
                router.dismissTo(
                  kind === "meal"
                    ? "/meals-tab"
                    : kind === "workout"
                      ? "/workouts/history"
                      : "/progress-tab",
                )
              }
            />
            <Button
              secondary
              title="ホームに戻る"
              onPress={() => router.dismissTo("/home")}
            />
            {!id && (
              <Button
                secondary
                title="続けて記録する"
                onPress={() => {
                  setForm({ ...blank, date: localTime() });
                  setSavedId(undefined);
                  setStage(0);
                }}
              />
            )}
          </>
        ) : (
          <>
            <ErrorText message={error} />
            <Button
              title={
                stage === 0
                  ? kind === "meal"
                    ? "料理を選択する"
                    : "手動で入力する"
                  : stage === 1
                    ? "入力内容を確認する"
                    : "この内容で保存する"
              }
              onPress={next}
            />
            {stage > 0 && (
              <Button
                secondary
                title="修正する"
                onPress={() => setStage(stage - 1)}
              />
            )}
          </>
        )
      }
    >
      {kind === "meal" && stage === 1 && (
        <MealPhoto
          uri={form.photoUri || ""}
          onChange={(uri) => update({ photoUri: uri })}
        />
      )}
      <Steps current={stage} total={4} />
      {(kind === "measurement" || kind === "workout") && stage < 2 && (
        <HealthcareImport
          kind={kind}
          onSelect={(data) => {
            update(data);
            setError("");
            setStage(1);
          }}
        />
      )}
      {stage === 0 ? (
        <>
          <Card green>
            <Icon
              name={
                kind === "meal"
                  ? "restaurant-outline"
                  : kind === "workout"
                    ? "barbell-outline"
                    : "scale-outline"
              }
              size={44}
            />
            <Heading>
              {kind === "meal" ? "料理を選んで記録" : `${title}を手動で記録`}
            </Heading>
            <Copy>
              {kind === "meal"
                ? "食事区分と日時を設定し、食べた料理を選択してください。"
                : "測定値や実際に行った内容を、ご自身で入力します。"}
            </Copy>
          </Card>
          <CalendarDateTime
            label={
              kind === "meal"
                ? "食事の日時"
                : kind === "workout"
                  ? "運動の日時"
                  : "測定日時"
            }
            value={form.date}
            onChange={(date) => update({ date })}
          />
          {kind === "meal" && (
            <Choices
              options={["朝食", "昼食", "夕食", "間食"]}
              value={form.category}
              onChange={(v) => update({ category: v })}
            />
          )}
          <Notice>
            {kind === "meal"
              ? "料理DBは今後追加予定です。現在は仮の料理一覧から選択できます。"
              : "写真AI解析・InBody連携は準備中です。"}
          </Notice>
        </>
      ) : stage === 1 ? (
        <>
          {kind === "meal" && (
            <Card>
              <Heading>料理</Heading>
              <Menu
                icon="search-outline"
                title="料理を検索・選択する"
                detail={form.name || "未選択・タップして料理検索画面を開く"}
                onPress={() => {
                  app.setDraft(key, form);
                  router.push({
                    pathname: "/meals/dish-search",
                    params: { draftKey: key },
                  });
                }}
              />
              <Copy>仮の料理一覧です。カロリー・PFCは手入力してください。</Copy>
            </Card>
          )}
          {kind === "workout" && (
            <>
              <Heading>実施状況</Heading>
              <Choices
                options={["実施", "変更して実施", "スキップ", "中断"]}
                value={form.status}
                onChange={(v) => update({ status: v })}
              />
            </>
          )}
          {fields[kind].map(([key, label, unit, type]) => (
            <Field
              key={key}
              label={label}
              unit={unit}
              numeric={type !== "text"}
              value={form[key] || ""}
              onChangeText={(v) => update({ [key]: v })}
            />
          ))}
          {kind === "workout" && !["スキップ"].includes(form.status) && (
            <Card>
              <Heading>セット記録（任意）</Heading>
              {sets.map((set, i) => (
                <Card key={i}>
                  <Heading>{i + 1}セット目</Heading>
                  <Field
                    label="重量"
                    unit="kg"
                    numeric
                    value={set.weight}
                    onChangeText={(v) =>
                      update({
                        sets: JSON.stringify(
                          sets.map((s, n) =>
                            n === i ? { ...s, weight: v } : s,
                          ),
                        ),
                      })
                    }
                  />
                  <Field
                    label="回数"
                    unit="回"
                    numeric
                    value={set.reps}
                    onChangeText={(v) =>
                      update({
                        sets: JSON.stringify(
                          sets.map((s, n) => (n === i ? { ...s, reps: v } : s)),
                        ),
                      })
                    }
                  />
                  <Button
                    secondary
                    title="このセットを削除"
                    onPress={() =>
                      update({
                        sets: JSON.stringify(sets.filter((_, n) => n !== i)),
                      })
                    }
                  />
                </Card>
              ))}
              <Button
                title="セットを追加"
                secondary
                onPress={() =>
                  update({
                    sets: JSON.stringify([...sets, { weight: "", reps: "" }]),
                  })
                }
              />
            </Card>
          )}
          {kind === "workout" && form.status !== "実施" && (
            <>
              <Heading>変更・スキップの理由（任意）</Heading>
              <Choices
                options={[
                  "時間不足",
                  "疲労",
                  "体調",
                  "器具が使えない",
                  "その他",
                  "回答しない",
                ]}
                value={form.reason}
                onChange={(v) => update({ reason: v })}
              />
            </>
          )}
          <Field
            label="メモ（任意）"
            value={form.notes}
            onChangeText={(v) => update({ notes: v })}
            multiline
          />
          <Notice>空欄の任意項目は未記録として保存されます。</Notice>
        </>
      ) : (
        <>
          <Card>
            {stage === 3 && <Icon name="checkmark-circle" size={64} />}
            <Row label="日時" value={form.date} />
            {kind === "meal" && <Row label="食事区分" value={form.category} />}
            {kind === "meal" && <Row label="選択した料理" value={form.name} />}
            {kind === "workout" && <Row label="実施状況" value={form.status} />}
            {fields[kind].map(([key, label, unit]) => (
              <Row
                key={key}
                label={label}
                value={form[key] ? `${form[key]} ${unit}` : "未記録"}
              />
            ))}
            {kind === "workout" &&
              sets.map((set, i) => (
                <Row
                  key={i}
                  label={`${i + 1}セット目`}
                  value={`${set.weight || "—"} kg × ${set.reps || "—"} 回`}
                />
              ))}
            <Row label="メモ" value={form.notes || "なし"} />
          </Card>
          {kind === "measurement" && (
            <Card>
              <Heading>前回との比較</Heading>
              <Copy>
                {app.entries.find(
                  (e) => e.kind === "measurement" && e.id !== id,
                )
                  ? `直近の記録：${app.entries.find((e) => e.kind === "measurement" && e.id !== id)?.data.weight} kg`
                  : "前回データなし"}
              </Copy>
            </Card>
          )}
        </>
      )}
    </Screen>
  );
}
