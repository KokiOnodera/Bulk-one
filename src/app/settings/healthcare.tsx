import { useState } from "react";
import { Platform } from "react-native";
import { router } from "expo-router";
import {
  Button,
  Card,
  Choices,
  Copy,
  Heading,
  Icon,
  Notice,
  Row,
  Screen,
  Steps,
} from "../../components/ui";
export default function Healthcare() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState("");
  const [sync, setSync] = useState("");
  const service =
    Platform.OS === "ios"
      ? "Apple HealthKit"
      : Platform.OS === "android"
        ? "Health Connect"
        : "モバイル端末で利用予定";
  return (
    <Screen
      title={
        [
          "ヘルスケア連携",
          "連携サービス",
          "アクセスするデータ",
          "同期設定",
          "連携データの確認",
        ][step]
      }
      subtitle="準備中 ・ UIプレビュー"
    >
      <Notice>
        OSの権限要求・データ取得は未実装です。以下の選択はUIの確認用で、実際の権限や連携状態は変更しません。
      </Notice>
      <Steps current={step} total={5} />
      {step === 0 ? (
        <>
          <Card green>
            <Icon name="heart-outline" size={60} />
            <Heading>毎日の記録を、もっとスムーズに。</Heading>
            <Copy>
              歩数・体重・運動など、取得を許可したデータだけを記録の補助に使います。
            </Copy>
            <Row label="連携状態" value="未連携（準備中）" />
          </Card>
          <Button title="連携画面をプレビュー" onPress={() => setStep(1)} />
        </>
      ) : step === 1 ? (
        <>
          <Card>
            <Heading>{service}</Heading>
            <Copy>
              {Platform.OS === "web"
                ? "iOSではApple HealthKit、AndroidではHealth Connectを利用予定です。"
                : "このOSで対応を予定しているサービスです。"}
            </Copy>
          </Card>
          <Button title="アクセス対象の画面を見る" onPress={() => setStep(2)} />
        </>
      ) : step === 2 ? (
        <>
          <Choices
            options={[
              "歩数",
              "体重",
              "運動記録",
              "睡眠",
              "心拍数",
              "アクティブエネルギー",
            ]}
            value={selected}
            onChange={setSelected}
            multiple
          />
          <Copy>
            選択だけでは許可されません。本番ではOS標準の権限画面で確認します。
          </Copy>
          <Button title="同期設定の画面を見る" onPress={() => setStep(3)} />
          <Button
            secondary
            title="許可せず手動入力を使う"
            onPress={() => router.push("/records")}
          />
        </>
      ) : step === 3 ? (
        <>
          <Card>
            <Heading>まだ連携されていません</Heading>
            <Copy>実際の連携・同期は本番機能の対応後に利用できます。</Copy>
          </Card>
          <Choices
            options={["手動同期", "起動時に同期"]}
            value={sync}
            onChange={setSync}
          />
          <Button title="データ確認画面を見る" onPress={() => setStep(4)} />
        </>
      ) : (
        <>
          <Card>
            <Row label="連携サービス" value={service} />
            <Row label="連携状態" value="未連携" />
            <Row label="最終同期" value="未実施" />
            <Copy>取得したデータはありません。</Copy>
          </Card>
          <Notice>
            連携解除は今後の取得を停止する操作です。取り込み済みデータの削除とは別に扱います。
          </Notice>
          <Button
            secondary
            title="設定に戻る"
            onPress={() => router.dismissTo("/settings-tab")}
          />
        </>
      )}
      {step > 0 && (
        <Button
          secondary
          title="前の画面に戻る"
          onPress={() => setStep(step - 1)}
        />
      )}
    </Screen>
  );
}
