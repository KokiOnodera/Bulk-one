import { expect, test } from "@playwright/test";

test("S-001スプラッシュを表示し、ウェルカムへ自動遷移する", async ({
  page,
}) => {
  await page.goto("/");
  const splash = page.getByTestId("launch-splash");
  await expect(splash).toBeVisible();
  await expect(splash.getByRole("heading", { name: "BULK ONE" })).toBeVisible();
  await expect(
    splash.getByText("理想の身体へ、", { exact: false }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/splash-mobile.png" });
  await expect(
    page.getByRole("button", { name: "はじめる", exact: true }),
  ).toBeVisible();
  await expect(splash).toHaveCount(0);
  await page.getByRole('button', { name: 'はじめる', exact: true }).click();
  await expect(page.getByRole('button', { name: 'メールアドレスで続ける', exact: true })).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("button", { name: "はじめる", exact: true }),
  ).toBeVisible();
});
