import { expect, Page, test } from "@playwright/test";

const click = (page: Page, title: string) =>
  page
    .getByRole("button", { name: title, exact: true })
    .filter({ visible: true })
    .click();
const fill = (page: Page, label: string, value: string) =>
  page.getByRole("textbox", { name: label, exact: true }).fill(value);

async function onboard(page: Page) {
  await page.goto("/");
  await click(page, "はじめる");
  await click(page, "メールアドレスで続ける");
  await fill(page, "メールアドレス", "demo@example.com");
  await click(page, "次へ");
  await fill(page, "認証コード", "123456");
  await click(page, "次へ");
  await fill(page, "パスワード（デモ用・8文字以上）", "demo12345");
  await fill(page, "パスワード（確認）", "demo12345");
  await click(page, "デモ登録を完了する");
  await click(page, "基本情報の入力へ");
  await click(page, "次へ");
  await expect(page.getByRole("alert")).toContainText("入力");
  await fill(page, "ニックネーム", "テスト");
  await click(page, "男性");
  await fill(page, "年齢", "28");
  await click(page, "次へ");
  await fill(page, "身長", "175");
  await fill(page, "体重", "70");
  await click(page, "戻る");
  await expect(
    page.getByRole("textbox", { name: "年齢", exact: true }),
  ).toHaveValue("28");
  await click(page, "次へ");
  await expect(
    page.getByRole("textbox", { name: "身長", exact: true }),
  ).toHaveValue("175");
  await expect(
    page.getByRole("textbox", { name: "体重", exact: true }),
  ).toHaveValue("70");
  await click(page, "次へ");
  await click(page, "初心者｜これから始めたい");
  await click(page, "次へ");
  await click(page, "この内容で次へ");
  await click(page, "筋肉を増やしたい");
  await click(page, "次へ");
  await fill(page, "目標体重", "72");
  await click(page, "次へ");
  await click(page, "3か月");
  await click(page, "次へ");
  await click(page, "筋力トレーニング");
  await click(page, "次へ");
  await click(page, "ホームへ進む");
  await expect(
    page
      .getByText("テストさん、こんにちは！", { exact: true })
      .filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page
      .getByText("どのくらい運動できますか？", { exact: true })
      .filter({ visible: true }),
  ).toHaveCount(0);
  await click(page, "運動を開始する");
  await click(page, "週2〜3回");
  await click(page, "45分");
  await click(page, "次へ");
  await click(page, "自宅");
  await click(page, "器具なし");
  await click(page, "次へ");
  await click(page, "自炊が多い");
  await click(page, "次へ");
  await click(page, "次へ");
  await click(page, "この内容でプランを作成");
  await click(page, "デモプランを準備する");
  await click(page, "プランを確認する");
  for (let i = 0; i < 4; i++) await click(page, "次へ");
  await expect(
    page.getByRole("button", { name: "このデモプランで始める", exact: true }),
  ).toBeDisabled();
  await click(page, "内容を確認し、デモプランの適用に同意する");
  await click(page, "このデモプランで始める");
  await expect(
    page
      .getByText("テストさん、こんにちは！", { exact: true })
      .filter({ visible: true }),
  ).toBeVisible();
}

test("初回設定・食事の保存/編集/削除・体組成・レビュー・ログアウト", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await onboard(page);
  await click(page, "食事を記録");
  await click(page, "昼食");
  await click(page, "料理を選択する");
  await click(page, "料理を検索・選択する");
  await fill(page, "料理を検索", "サラダ");
  await click(page, "サラダボウル");
  await click(page, "選択した料理を反映する");
  await fill(page, "カロリー", "650");
  await click(page, "入力内容を確認する");
  await expect(
    page.getByText("未記録", { exact: true }).filter({ visible: true }).first(),
  ).toBeVisible();
  await click(page, "この内容で保存する");
  await click(page, "戻る");
  await expect(
    page.getByText("入力内容の確認", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await click(page, "この内容で保存する");
  await click(page, "食事記録一覧を見る");
  await expect(
    page.getByRole("button", { name: "サラダボウル", exact: true }),
  ).toHaveCount(1);
  await click(page, "サラダボウル");
  await click(page, "編集する");
  await click(page, "料理を選択する");
  await fill(page, "カロリー", "700");
  await click(page, "入力内容を確認する");
  await click(page, "この内容で保存する");
  await click(page, "ホームに戻る");
  await expect(
    page.getByText("700 kcal", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await click(page, "体重・体脂肪率を記録");
  await click(page, "手動で入力する");
  await fill(page, "体重", "70.5");
  await click(page, "入力内容を確認する");
  await click(page, "この内容で保存する");
  await click(page, "ホームに戻る");
  await expect(
    page.getByText("70.5 kg", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await click(page, "週次レビューを見る");
  await click(page, "レビュー画面のサンプルを見る");
  await click(page, "次週の変更案を確認する（デモ）");
  await click(page, "却下して現在のプランを続ける");
  await click(page, "却下を確定する");
  await expect(
    page.getByText("テストさん、こんにちは！", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  await page.getByRole("tab", { name: "食事" }).click();
  await click(page, "サラダボウル");
  await click(page, "この記録を削除する");
  await click(page, "削除する");
  await expect(
    page.getByText("まだ記録がありません", { exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "設定" }).click();
  await click(page, "ヘルスケア連携");
  await click(page, "連携画面をプレビュー");
  await click(page, "アクセス対象の画面を見る");
  await click(page, "許可せず手動入力を使う");
  await expect(
    page.getByText("記録をつける", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await click(page, "戻る");
  await expect(
    page
      .getByText("アクセスするデータ", { exact: true })
      .filter({ visible: true }),
  ).toBeVisible();
  await click(page, "戻る");
  await expect(
    page.getByText("連携サービス", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await click(page, "戻る");
  await expect(
    page.getByRole("button", { name: "連携画面をプレビュー", exact: true }),
  ).toBeVisible();
  await click(page, "戻る");
  await click(page, "ログアウト");
  await click(page, "ログアウト");
  await expect(
    page.getByText("理想の身体を、", { exact: false }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("運動のセット記録・スキップの区別・設定変更後の承認済みプラン保持", async ({
  page,
}) => {
  await onboard(page);
  await click(page, "運動を記録");
  await click(page, "手動で入力する");
  await fill(page, "種目名", "スクワット");
  await fill(page, "運動時間（任意）", "30");
  await fill(page, "重量", "20");
  await fill(page, "回数", "10");
  await click(page, "入力内容を確認する");
  await click(page, "この内容で保存する");
  await click(page, "運動履歴を見る");
  await click(page, "スクワット");
  await expect(
    page.getByText("20 kg × 10 回", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await click(page, "戻る");
  await click(page, "記録を追加する");
  await click(page, "手動で入力する");
  await click(page, "スキップ");
  await fill(page, "種目名", "ウォーキング");
  await click(page, "時間不足");
  await click(page, "入力内容を確認する");
  await click(page, "この内容で保存する");
  await click(page, "運動履歴を見る");
  await click(page, "スキップ");
  await expect(
    page.getByRole("button", { name: "ウォーキング", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "スクワット", exact: true }),
  ).toHaveCount(0);
  await click(page, "戻る");
  await page.getByRole("tab", { name: "設定" }).click();
  await click(page, "目標設定");
  await click(page, "体脂肪を減らしたい");
  for (let i = 0; i < 4; i++) await click(page, "次へ");
  await click(page, "変更を保存する");
  await click(page, "現在のプラン");
  await expect(
    page
      .getByText("筋肉を増やしたい", { exact: true })
      .filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page
      .getByText("体脂肪を減らしたい", { exact: true })
      .filter({ visible: true }),
  ).toHaveCount(0);
});
