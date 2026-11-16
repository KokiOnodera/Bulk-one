import { useState } from "react";
import { router } from "expo-router";
import {
  Button,
  Card,
  Choices,
  Copy,
  ErrorText,
  Field,
  Heading,
  Menu,
  Notice,
  Screen,
} from "../../components/ui";
import { useApp } from "../../state/app-state";
export default function Account() {
  const app = useApp();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  return (
    <Screen
      onBack={
        !done && step > 0
          ? () => {
              setError("");
              setStep(step === 3 ? (selected ? 1 : 2) : 0);
            }
          : undefined
      }
      title={
        done
          ? "デモデータをリセットしました"
          : [
              "データ削除・退会",
              "削除データの選択",
              "退会前の確認",
              "最終確認",
            ][step]
      }
      subtitle="デモ内の操作です。実際のアカウント削除は行いません。"
    >
      {done ? (
        <>
          <Notice>選択した種類の記録をデモから削除しました。</Notice>
          <Button
            title="設定に戻る"
            onPress={() => router.dismissTo("/settings-tab")}
          />
        </>
      ) : step === 0 ? (
        <>
          <Menu
            icon="trash-outline"
            title="記録データを削除"
            detail="デモ内の記録だけを削除"
            onPress={() => setStep(1)}
          />
          <Menu
            icon="person-remove-outline"
            title="退会フローを確認"
            detail="デモ全体をリセットして初期画面に戻る"
            onPress={() => setStep(2)}
          />
          <Notice>デモの記録を削除すると元に戻せません。</Notice>
        </>
      ) : step === 1 ? (
        <>
          <Choices
            options={["運動記録", "食事記録", "体組成記録"]}
            value={selected}
            onChange={setSelected}
            multiple
          />
          <Notice>
            選択した種類の記録をすべて削除します。プロフィールと目標は残ります。
          </Notice>
          <Button
            danger
            disabled={!selected}
            title="選択したデモ記録を削除する"
            onPress={() => setStep(3)}
          />
        </>
      ) : step === 2 ? (
        <>
          <Card>
            <Heading>デモデータをすべてリセットします</Heading>
            <Copy>
              プロフィール、目標、プラン、食事・運動・体組成の記録が消去されます。
            </Copy>
            <Copy>実際の退会機能は認証・サーバー連携後に対応します。</Copy>
          </Card>
          <Button
            danger
            title="リセットの確認へ進む"
            onPress={() => {
              setSelected("");
              setStep(3);
            }}
          />
        </>
      ) : (
        <>
          <Card>
            <Heading>削除する内容</Heading>
            <Copy>{selected || "すべてのデモデータ"}</Copy>
          </Card>
          <Field
            label="確認のため「削除」と入力"
            value={code}
            onChangeText={setCode}
          />
          <ErrorText message={error} />
          <Button
            danger
            title="デモデータの削除を確定"
            onPress={() => {
              if (code !== "削除")
                return setError("「削除」と入力してください。");
              if (selected) {
                const kinds = selected.split("、").map(
                  (x) =>
                    ({
                      運動記録: "workout",
                      食事記録: "meal",
                      体組成記録: "measurement",
                    })[x as "運動記録"],
                );
                app.entries
                  .filter((e) => kinds.includes(e.kind))
                  .forEach((e) => app.remove(e.id));
                setDone(true);
              } else {
                app.reset();
                router.replace("/welcome");
              }
            }}
          />
        </>
      )}
      {step > 0 && !done && (
        <Button
          secondary
          title="キャンセルして設定に戻る"
          onPress={() => router.dismissTo("/settings-tab")}
        />
      )}
    </Screen>
  );
}
