import { Card, Copy, Heading, Notice, Row } from "../components/ui";
import { useApp } from "../state/app-state";
export function PlanSummary({ active = false }: { active?: boolean }) {
  const app = useApp();
  const profile = active ? app.activeProfile : app.profile;
  return (
    <Card>
      <Heading>プランの概要</Heading>
      <Row label="目標" value={profile.goal || "未設定"} />
      <Row label="期間" value={profile.period || "未設定"} />
      <Row
        label="運動条件"
        value={`${profile.frequency}・${profile.duration}`}
      />
      <Row label="運動環境" value={`${profile.place} / ${profile.equipment}`} />
      <Row label="栄養目標（サンプル）" value="2,100 kcal / 日" />
      <Row label="P / F / C（サンプル）" value="120g / 60g / 270g" />
    </Card>
  );
}
export function TrainingPlan() {
  return (
    <>
      <Notice>
        以下は固定のサンプルです。入力した条件に応じたAI提案は、API接続後に対応します。
      </Notice>
      {[
        [
          "Day 1",
          "上半身",
          "プッシュアップ　3セット × 8回\nタオルローイング　3セット × 10回",
        ],
        [
          "Day 2",
          "下半身",
          "スクワット　3セット × 10回\nヒップリフト　3セット × 12回",
        ],
        ["Day 3", "全身・ストレッチ", "ウォーキング　15分\nストレッチ　10分"],
      ].map(([day, title, copy]) => (
        <Card key={day}>
          <Copy>{day} ・ サンプルメニュー</Copy>
          <Heading>{title}</Heading>
          <Copy>{copy}</Copy>
        </Card>
      ))}
    </>
  );
}
export function NutritionPlan() {
  return (
    <>
      <Card green>
        <Heading>1日の栄養目標（サンプル）</Heading>
        <Row label="エネルギー" value="2,100 kcal" />
        <Row label="タンパク質" value="120 g" />
        <Row label="脂質" value="60 g" />
        <Row label="炭水化物" value="270 g" />
      </Card>
      <Card>
        <Heading>食事の考え方</Heading>
        <Copy>
          主食・主菜・副菜を組み合わせ、毎日の食事を記録して振り返ります。
        </Copy>
      </Card>
      <Notice>
        栄養値はデザイン確認用の固定値です。個別の推奨値や医療上の助言ではありません。
      </Notice>
    </>
  );
}
