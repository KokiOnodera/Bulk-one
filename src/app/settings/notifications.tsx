import { Notice, Screen } from "../../components/ui";
export default function Notifications() {
  return (
    <Screen title="通知設定" subtitle="準備中">
      <Notice>
        運動・食事・体組成のリマインダーと週次レビュー通知は今後の対応予定です。現在は通知の許可要求・配信を行いません。
      </Notice>
    </Screen>
  );
}
