import { useState } from "react";
import { router } from "expo-router";
import {
  Button,
  Card,
  Copy,
  Heading,
  Notice,
  Screen,
} from "../../components/ui";
import { useApp } from "../../state/app-state";
export default function Proposal() {
  const app = useApp();
  const [decision, setDecision] = useState("");
  return (
    <Screen
      onBack={decision ? () => setDecision("") : undefined}
      title="次週のプラン変更案"
      subtitle="提案を確認してから、選びましょう。"
    >
      <Notice>
        固定のUIサンプルです。承認・却下の操作を確認できます。承認済み運動・栄養目標への実際の変更はありません。
      </Notice>
      <Card>
        <Heading>記録する時間を決める</Heading>
        <Copy>変更前：記録する時間は未設定</Copy>
        <Copy>変更案：毎日、夕食のあとに記録を振り返る</Copy>
        <Heading>提案の理由（サンプル）</Heading>
        <Copy>
          生活の中の決まった行動に記録を組み合わせ、続けやすくするため。
        </Copy>
      </Card>
      {decision ? (
        <Card>
          <Heading>変更案を{decision}しますか？</Heading>
          <Copy>
            {decision === "却下"
              ? "現在のプランを維持します。"
              : "デモ内で承認したことを記録します。"}
          </Copy>
          <Button
            title={`${decision}を確定する`}
            onPress={() => {
              app.setReviewDecision(decision);
              router.dismissTo("/home");
            }}
          />
          <Button
            secondary
            title="戻って確認する"
            onPress={() => setDecision("")}
          />
        </Card>
      ) : (
        <>
          <Button title="承認する" onPress={() => setDecision("承認")} />
          <Button
            secondary
            title="却下して現在のプランを続ける"
            onPress={() => setDecision("却下")}
          />
        </>
      )}
    </Screen>
  );
}
