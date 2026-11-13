import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  Button,
  Card,
  Choices,
  Copy,
  ErrorText,
  Field,
  Heading,
  Notice,
  Row,
  Screen,
  Steps,
} from "../components/ui";
import { isNumber, useApp } from "../state/app-state";

type Item = {
  key: string;
  label: string;
  options?: string[];
  multiple?: boolean;
  numeric?: boolean;
  unit?: string;
  optional?: boolean;
  range?: [number, number];
};
type Step = { title: string; description: string; items: Item[] };
const profile: Step[] = [
  {
    title: "基本情報を教えてください",
    description:
      "あなたに合ったプランを提案するために、基本情報を入力してください。",
    items: [
      { key: "name", label: "ニックネーム" },
      { key: "sex", label: "性別", options: ["男性", "女性", "回答しない"] },
      {
        key: "age",
        label: "年齢",
        numeric: true,
        unit: "歳",
        range: [18, 100],
      },
    ],
  },
  {
    title: "身体情報を入力してください",
    description:
      "身長・体重を入力してください。任意の項目は空欄のままで進めます。",
    items: [
      {
        key: "height",
        label: "身長",
        numeric: true,
        unit: "cm",
        range: [100, 250],
      },
      {
        key: "weight",
        label: "体重",
        numeric: true,
        unit: "kg",
        range: [30, 300],
      },
      {
        key: "fat",
        label: "体脂肪率（任意）",
        numeric: true,
        unit: "%",
        optional: true,
        range: [1, 70],
      },
    ],
  },
  {
    title: "運動経験を教えてください",
    description: "あなたの経験に合わせて、無理のないスタートを。",
    items: [
      {
        key: "experience",
        label: "運動経験",
        options: [
          "初心者｜これから始めたい",
          "中級者｜週1〜3回の運動習慣",
          "上級者｜週4回以上を継続",
        ],
      },
    ],
  },
];
const goal: Step[] = [
  {
    title: "あなたの主な目標は？",
    description: "いちばん大切にしたい目標を1つ選んでください。",
    items: [
      {
        key: "goal",
        label: "主な目標",
        options: [
          "筋肉を増やしたい",
          "体脂肪を減らしたい",
          "健康を維持したい",
          "運動習慣をつけたい",
        ],
      },
    ],
  },
  {
    title: "具体的な目標を設定",
    description: "現在の値を参考に、目指したい身体を教えてください。",
    items: [
      {
        key: "target",
        label: "目標体重",
        numeric: true,
        unit: "kg",
        range: [30, 300],
      },
      {
        key: "targetFat",
        label: "目標体脂肪率（任意）",
        numeric: true,
        unit: "%",
        optional: true,
        range: [1, 70],
      },
    ],
  },
  {
    title: "いつまでに取り組みたいですか？",
    description:
      "期間はプランの参考情報です。目標達成を保証するものではありません。",
    items: [
      {
        key: "period",
        label: "目標期間",
        options: ["1か月", "3か月", "6か月", "1年", "それ以上"],
      },
    ],
  },
  {
    title: "特に重視したい項目は？",
    description: "優先事項は複数選択できます。",
    items: [
      {
        key: "priorities",
        label: "優先事項",
        multiple: true,
        options: [
          "筋力トレーニング",
          "食事管理",
          "有酸素運動",
          "柔軟性・ストレッチ",
        ],
      },
    ],
  },
];
const constraints: Step[] = [
  {
    title: "どのくらい運動できますか？",
    description: "生活に合わせて、続けられる頻度を選びましょう。",
    items: [
      {
        key: "frequency",
        label: "運動頻度",
        options: ["週1回", "週2〜3回", "週4〜5回", "週6回以上"],
      },
      {
        key: "duration",
        label: "1回あたりの時間",
        options: ["15分", "30分", "45分", "60分"],
      },
    ],
  },
  {
    title: "主にどこで運動しますか？",
    description: "利用できる場所や器具を教えてください。",
    items: [
      {
        key: "place",
        label: "運動環境",
        options: ["ジム", "自宅", "屋外", "その他"],
      },
      {
        key: "equipment",
        label: "利用できる器具（複数選択）",
        multiple: true,
        options: [
          "ダンベル",
          "バーベル",
          "マシン",
          "チューブ",
          "ベンチ",
          "器具なし",
        ],
      },
    ],
  },
  {
    title: "普段の食事スタイルは？",
    description: "食事の制約や避けたい食材も記入できます。",
    items: [
      {
        key: "food",
        label: "食事のパターン",
        options: ["自炊が多い", "外食が多い", "コンビニが多い"],
      },
      {
        key: "restrictions",
        label: "制約・避けたい食材（任意）",
        optional: true,
      },
    ],
  },
  {
    title: "生活習慣を教えてください",
    description: "任意項目は、分かる範囲で教えてください。",
    items: [
      {
        key: "sleep",
        label: "睡眠時間（任意）",
        optional: true,
        options: ["6時間未満", "6〜7時間", "7〜8時間", "8時間以上"],
      },
      {
        key: "work",
        label: "仕事のスタイル（任意）",
        optional: true,
        options: ["デスクワーク", "立ち仕事", "シフト制", "その他"],
      },
      { key: "notes", label: "運動上の制約・希望（任意）", optional: true },
    ],
  },
];
export function Onboarding({
  section,
}: {
  section: "profile" | "goal" | "constraints";
}) {
  const app = useApp();
  const params = useLocalSearchParams<{ edit?: string; step?: string }>();
  const steps = { profile, goal, constraints }[section];
  const [step, setStep] = useState(
    Math.min(Number(params.step) || 0, steps.length),
  );
  const [error, setError] = useState("");
  const confirm = step === steps.length;
  const next = () => {
    if (!confirm) {
      const invalid = steps[step].items.find((i) =>
        i.range
          ? !isNumber(app.profile[i.key] || "", ...i.range, i.optional)
          : !i.optional && !app.profile[i.key]?.trim(),
      );
      if (invalid) {
        setError(
          `${invalid.label}を${invalid.range ? `${invalid.range[0]}〜${invalid.range[1]}の範囲で` : ""}入力・選択してください。`,
        );
        return;
      }
      setError("");
      setStep(step + 1);
    } else if (params.edit) {
      router.dismissTo("/settings-tab");
    } else {
      router.push(
        section === "profile"
          ? "/goal"
          : section === "goal"
            ? "/constraints"
            : "/generating",
      );
    }
  };
  return (
    <Screen
      title={confirm ? "入力内容の確認" : steps[step].title}
      subtitle={
        confirm
          ? "内容を確認してください。戻って修正することもできます。"
          : steps[step].description
      }
      footer={
        <>
          <ErrorText message={error} />
          <Button
            title={
              confirm
                ? params.edit
                  ? "変更を保存する"
                  : section === "constraints"
                    ? "この内容でプランを作成"
                    : "この内容で次へ"
                : "次へ"
            }
            onPress={next}
          />
          {step > 0 && (
            <Button
              title="前のステップに戻る"
              secondary
              onPress={() => {
                setError("");
                setStep(step - 1);
              }}
            />
          )}
        </>
      }
    >
      <Steps current={step} total={steps.length + 1} />
      {confirm ? (
        <>
          <Card>
            {steps
              .flatMap((x) => x.items)
              .map((i) => (
                <Row
                  key={i.key}
                  label={i.label}
                  value={`${app.profile[i.key] || "未回答"}${app.profile[i.key] ? i.unit || "" : ""}`}
                />
              ))}
          </Card>
          <Notice>
            入力内容はこのデモの起動中に保持されます。現在の承認済みプランは自動変更されません。
          </Notice>
        </>
      ) : (
        steps[step].items.map((i) => (
          <Card key={i.key}>
            {i.options ? (
              <>
                <Heading>{i.label}</Heading>
                <Choices
                  options={i.options}
                  value={app.profile[i.key] || ""}
                  multiple={i.multiple}
                  onChange={(v) => app.updateProfile({ [i.key]: v })}
                />
              </>
            ) : (
              <Field
                label={i.label}
                value={app.profile[i.key] || ""}
                onChangeText={(v) => app.updateProfile({ [i.key]: v })}
                numeric={i.numeric}
                unit={i.unit}
              />
            )}
          </Card>
        ))
      )}
      {section === "goal" && step === 1 && (
        <Copy>現在の体重：{app.profile.weight || "未入力"} kg</Copy>
      )}
    </Screen>
  );
}
