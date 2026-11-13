import { useState } from "react";
import { router } from "expo-router";
import {
  Button,
  Choices,
  Copy,
  Notice,
  Screen,
  Steps,
} from "../../components/ui";
import { NutritionPlan, PlanSummary, TrainingPlan } from "../../features/plan";
import { useApp } from "../../state/app-state";
export default function Preview() {
  const app = useApp();
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState("");
  return (
    <Screen
      title={
        [
          "プランの概要",
          "トレーニングプラン",
          "食事・栄養プラン",
          "提案の理由・注意点",
          "このプランで始めますか？",
        ][step]
      }
      subtitle="デモプランを確認・承認"
      footer={
        <>
          <Button
            title={step === 4 ? "このデモプランで始める" : "次へ"}
            disabled={step === 4 && !consent}
            onPress={() => {
              if (step < 4) setStep(step + 1);
              else {
                app.approvePlan();
                router.dismissTo("/home");
              }
            }}
          />
          {step > 0 && (
            <Button
              secondary
              title="戻って確認する"
              onPress={() => setStep(step - 1)}
            />
          )}
          <Button
            secondary
            title="条件を見直す"
            onPress={() => router.push("/constraints")}
          />
        </>
      }
    >
      <Steps current={step} total={5} />
      {step === 0 ? (
        <PlanSummary />
      ) : step === 1 ? (
        <TrainingPlan />
      ) : step === 2 ? (
        <NutritionPlan />
      ) : step === 3 ? (
        <>
          <Notice>
            実際のAI提案理由はAPI接続後に表示します。現在の内容はデザイン確認用サンプルです。
          </Notice>
          <Copy>
            身体の状態や生活に合わせ、無理のない範囲で取り組みましょう。プランは週次レビューから見直せます。
          </Copy>
        </>
      ) : (
        <>
          <PlanSummary />
          <Choices
            options={["内容を確認し、デモプランの適用に同意する"]}
            value={consent}
            onChange={(v) => setConsent(consent ? "" : v)}
          />
        </>
      )}
    </Screen>
  );
}
