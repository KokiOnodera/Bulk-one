import { useRef, useState } from "react";
import { Platform } from "react-native";
import {
  readHealthMeasurements,
  readHealthWorkouts,
  HealthMeasurement,
} from "../services/healthcare";
import { Form } from "../state/app-state";
import { Button, Card, Copy, ErrorText, Heading } from "./ui";

export function HealthcareImport({
  onSelect,
  kind = "measurement",
}: {
  onSelect: (data: Form) => void;
  kind?: "measurement" | "workout";
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [samples, setSamples] = useState<HealthMeasurement[]>([]);
  const lock = useRef(false);
  if (Platform.OS !== "ios") return null;
  const load = async () => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setSamples([]);
    try {
      const result = await (kind === "workout"
        ? readHealthWorkouts()
        : readHealthMeasurements());
      setSamples(result);
      if (!result.length)
        setError(
          `読み取れる${kind === "workout" ? "ワークアウト" : "体重"}データがありません。過去90日間のデータと、iPhoneの設定にあるヘルスケアの読み取り許可を確認してください。許可の有無はアプリから判別できません。`,
        );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "データを取得できませんでした。時間をおいて再度お試しください。",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  return (
    <Card>
      <Heading>ヘルスケアから取り込む</Heading>
      <Copy>
        {kind === "workout"
          ? "フィットネスのワークアウトをHealthKitから読み取ります。"
          : "体重と体脂肪率を読み取ります。"}
        過去90日間の直近20件から選択してください。サーバーへの送信は行いません。
      </Copy>
      <Button
        secondary
        title={busy ? "取得中…" : "ヘルスケアのデータを取得"}
        disabled={busy}
        onPress={load}
      />
      <ErrorText message={error} />
      {samples.map((sample) => (
        <Button
          secondary
          key={sample.id}
          title={
            kind === "workout"
              ? `${sample.data.date}・${sample.data.name}・${sample.data.minutes}分（${sample.source}）`
              : `${sample.data.date}・${sample.data.weight} kg${sample.data.fat ? `・${sample.data.fat}%` : ""}（${sample.source}）`
          }
          onPress={() => onSelect(sample.data)}
        />
      ))}
      <Copy>
        {kind === "workout"
          ? "運動の種類・開始日時・運動時間を反映します。重量・回数・セット数・疲労度は手入力してください。"
          : "同じ取得元・測定時刻の体脂肪率だけを反映します。筋肉量は手入力してください。"}
      </Copy>
    </Card>
  );
}
