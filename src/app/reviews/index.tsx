import { useState } from "react";
import { router } from "expo-router";
import {
  Button,
  Card,
  Choices,
  Copy,
  Heading,
  Menu,
  Notice,
  Row,
  Screen,
} from "../../components/ui";
import { useApp } from "../../state/app-state";
export default function Reviews() {
  const app = useApp();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("総合");
  const end = new Date();
  const start = new Date(end.getTime() - 6 * 86400000);
  const entries = app.entries.filter(
    (e) =>
      Date.parse(e.data.date.replace(" ", "T")) >=
      new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
      ).getTime(),
  );
  const meals = entries.filter((e) => e.kind === "meal");
  const workouts = entries.filter((e) => e.kind === "workout");
  const period = `${start.toLocaleDateString("ja-JP")} 〜 ${end.toLocaleDateString("ja-JP")}`;
  return (
    <Screen
      title={open ? "週次レビュー詳細" : "週次レビュー"}
      subtitle="1週間の積み重ねを、次の一歩に。"
    >
      <Notice>
        AI未接続です。実際の記録集計と、固定のレビューUIサンプルを確認できます。
      </Notice>
      {!open ? (
        <>
          <Card green>
            <Heading>今週の振り返り</Heading>
            <Copy>{period}</Copy>
            <Copy>
              {entries.length
                ? `${entries.length}件の記録があります。`
                : "まだレビューがありません。最初の記録を追加しましょう。"}
            </Copy>
            <Button
              title="レビュー画面のサンプルを見る"
              onPress={() => setOpen(true)}
            />
          </Card>
          <Menu
            icon="add-circle-outline"
            title="今日の記録をつける"
            onPress={() => router.push("/records")}
          />
        </>
      ) : (
        <>
          <Card>
            <Heading>{period}</Heading>
            <Row
              label="食事記録日数"
              value={`${new Set(meals.map((e) => e.data.date.slice(0, 10))).size} / 7日`}
            />
            <Row
              label="運動実施数"
              value={`${workouts.filter((e) => ["実施", "変更して実施"].includes(e.data.status)).length}件`}
            />
            <Row
              label="体組成測定数"
              value={`${entries.filter((e) => e.kind === "measurement").length}件`}
            />
          </Card>
          <Choices
            options={["総合", "食事", "運動", "次のアクション"]}
            value={section}
            onChange={setSection}
          />
          <Card>
            <Heading>
              {section === "次のアクション"
                ? "次の1週間に向けて"
                : `${section}の振り返り`}
            </Heading>
            <Copy>
              {section === "食事"
                ? "未記録の日は摂取0kcalとみなしません。記録が揃うと食事の傾向を振り返れます。"
                : section === "運動"
                  ? `スキップ・中断の記録は${workouts.filter((e) => ["スキップ", "中断"].includes(e.data.status)).length}件です。無理のないペースを大切にしましょう。`
                  : section === "次のアクション"
                    ? "サンプル：記録する時間を決め、1日1回、振り返る習慣をつけてみましょう。"
                    : "実際のAIによる総評は未生成です。判断に必要な記録が不足している項目は評価しません。"}
            </Copy>
          </Card>
          {section === "食事" && (
            <Menu
              icon="restaurant-outline"
              title="食事履歴を見る"
              onPress={() => router.navigate("/meals-tab")}
            />
          )}
          {section === "運動" && (
            <Menu
              icon="barbell-outline"
              title="運動履歴を見る"
              onPress={() => router.push("/workouts/history")}
            />
          )}
          <Button
            title="次週の変更案を確認する（デモ）"
            onPress={() => router.push("/reviews/proposal")}
          />
          {app.reviewDecision && (
            <Notice>変更案の回答：{app.reviewDecision}</Notice>
          )}
          <Button
            secondary
            title="レビュー一覧に戻る"
            onPress={() => setOpen(false)}
          />
        </>
      )}
    </Screen>
  );
}
