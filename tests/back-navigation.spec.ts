import { expect, test } from "@playwright/test";

test("既存アカウントのログインは初期設定を経由せずホームへ進む", async ({ page }) => {
  await page.goto('/login?mode=login');
  await page.getByRole('button', { name: 'メールアドレスで続ける', exact: true }).click();
  await page.getByRole('textbox', { name: 'メールアドレス', exact: true }).fill('demo@example.com');
  await page.getByRole('textbox', { name: 'パスワード（デモ用）', exact: true }).fill('demo12345');
  await page.getByRole('button', { name: 'デモでログイン', exact: true }).click();
  await expect(page.getByText('デモユーザーさん、こんにちは！', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: '年齢', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '戻る', exact: true })).toHaveCount(0);
  await expect(page.getByTestId('launch-splash')).toHaveCount(0);
});

test("新規登録直後の先頭画面には戻るボタンを表示せず、ステップでは1つ前へ戻る", async ({
  page,
}) => {
  await page.goto("/login");
  await page
    .getByRole("button", { name: "メールアドレスで続ける", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "メールアドレス", exact: true })
    .fill("demo@example.com");
  await page.getByRole('button', { name: '次へ', exact: true }).click();
  await page.getByRole('textbox', { name: '認証コード', exact: true }).fill('123456');
  await page.getByRole('button', { name: '次へ', exact: true }).click();
  await page.getByRole('textbox', { name: 'パスワード（デモ用・8文字以上）', exact: true }).fill('demo12345');
  await page.getByRole('textbox', { name: 'パスワード（確認）', exact: true }).fill('demo12345');
  await page.getByRole('button', { name: 'デモ登録を完了する', exact: true }).click();
  await page.getByRole('button', { name: '基本情報の入力へ', exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "年齢", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "戻る", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByTestId("launch-splash")).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "ニックネーム", exact: true })
    .fill("戻る確認");
  await page.getByRole("button", { name: "男性", exact: true }).click();
  await page.getByRole("textbox", { name: "年齢", exact: true }).fill("28");
  await page.getByRole("button", { name: "次へ", exact: true }).click();
  await page.getByRole("textbox", { name: "身長", exact: true }).fill("175");
  await page.getByRole("button", { name: "戻る", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "年齢", exact: true }),
  ).toHaveValue("28");
  await expect(
    page.getByRole("button", { name: "戻る", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "次へ", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "身長", exact: true }),
  ).toHaveValue("175");
  await page.getByRole("textbox", { name: "体重", exact: true }).fill("70");
  await page.getByRole("button", { name: "次へ", exact: true }).click();
  await page
    .getByRole("button", { name: "初心者｜これから始めたい", exact: true })
    .click();
  await page.getByRole("button", { name: "次へ", exact: true }).click();
  await page
    .getByRole("button", { name: "この内容で次へ", exact: true })
    .click();
  await expect(
    page.getByText("あなたの主な目標は？", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "戻る", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "この内容で次へ", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("launch-splash")).toHaveCount(0);
});

test("メール認証の戻るで直前の入力画面に戻り、メールアドレスを保持する", async ({
  page,
}) => {
  await page.goto("/welcome");
  await page.getByRole("button", { name: "はじめる", exact: true }).click();
  await page
    .getByRole("button", { name: "メールアドレスで続ける", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "メールアドレス", exact: true })
    .fill("back@example.com");
  await page.getByRole("button", { name: "次へ", exact: true }).click();
  await page.getByRole("button", { name: "戻る", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "メールアドレス", exact: true }),
  ).toHaveValue("back@example.com");
  await page.getByRole("button", { name: "戻る", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "メールアドレスで続ける", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "戻る", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "はじめる", exact: true }),
  ).toBeVisible();
});
