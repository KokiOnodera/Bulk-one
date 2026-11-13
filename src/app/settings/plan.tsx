import { useState } from "react";
import { router } from "expo-router";
import { Button, Choices, Screen } from "../../components/ui";
import { NutritionPlan, PlanSummary, TrainingPlan } from "../../features/plan";
export default function Plan() {
  const [tab, setTab] = useState("概要");
  return (
    <Screen title="現在のプラン" subtitle="承認済みのデモプラン">
      <Choices
        options={["概要", "トレーニング", "食事・栄養"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "概要" ? (
        <PlanSummary active />
      ) : tab === "トレーニング" ? (
        <TrainingPlan />
      ) : (
        <NutritionPlan />
      )}
      <Button
        title="条件を見直して新しいプランを確認"
        onPress={() => router.push("/constraints")}
      />
    </Screen>
  );
}
