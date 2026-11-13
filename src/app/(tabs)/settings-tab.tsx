import { useState } from "react";
import { router } from "expo-router";
import {
  Button,
  Card,
  Copy,
  Heading,
  Menu,
  Notice,
  Screen,
} from "../../components/ui";
import { useApp } from "../../state/app-state";
export default function Settings() {
  const app = useApp();
  const [logout, setLogout] = useState(false);
  return (
    <Screen
      back={false}
      title="設定"
      subtitle="あなたらしく、続けられるように。"
    >
      <Card green>
        <Heading>{app.profile.name || "ゲスト"} さん</Heading>
        <Copy>{app.profile.goal || "目標未設定"} ・ デモアカウント</Copy>
      </Card>
      <Menu
        icon="person-outline"
        title="プロフィール設定"
        detail="基本情報・身体情報・運動経験"
        onPress={() => router.push("/profile?edit=1")}
      />
      <Menu
        icon="flag-outline"
        title="目標設定"
        detail="目標体重・期間・優先事項"
        onPress={() => router.push("/goal?edit=1")}
      />
      <Menu
        icon="barbell-outline"
        title="運動・食事条件"
        detail="運動頻度・器具・生活スタイル"
        onPress={() => router.push("/constraints?edit=1")}
      />
      <Menu
        icon="document-text-outline"
        title="現在のプラン"
        onPress={() => router.push("/settings/plan")}
      />
      <Menu
        icon="heart-outline"
        title="ヘルスケア連携"
        detail="準備中・UIプレビュー"
        onPress={() => router.push("/settings/healthcare")}
      />
      <Menu
        icon="notifications-outline"
        title="通知設定"
        detail="準備中"
        onPress={() => router.push("/settings/notifications")}
      />
      <Menu
        icon="shield-checkmark-outline"
        title="アプリ情報・データについて"
        onPress={() => router.push("/settings/about")}
      />
      <Menu
        icon="trash-outline"
        title="データ削除・退会"
        onPress={() => router.push("/settings/account")}
      />
      <Notice>
        設定変更だけで承認済みプランは上書きされません。データはアプリの起動中のみ保持されます。
      </Notice>
      {logout ? (
        <Card>
          <Heading>ログアウトしますか？</Heading>
          <Copy>起動中のデモデータは残ります。再ログインで確認できます。</Copy>
          <Button
            title="ログアウト"
            onPress={() => {
              app.setAuthenticated(false);
              router.replace("/welcome");
            }}
          />
          <Button
            secondary
            title="キャンセル"
            onPress={() => setLogout(false)}
          />
        </Card>
      ) : (
        <Button secondary title="ログアウト" onPress={() => setLogout(true)} />
      )}
    </Screen>
  );
}
