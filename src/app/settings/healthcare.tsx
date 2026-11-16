import { Platform } from "react-native";
import { router } from "expo-router";
import {
  Button,
  Card,
  Copy,
  Heading,
  Notice,
  Screen,
} from "../../components/ui";

export default function Healthcare() {
  return (
    <Screen title="ヘルスケア連携" subtitle="体組成・運動データの読み取り">
      <Card>
        <Heading>Appleヘルスケア</Heading>
        <Copy>
          iPhoneのヘルスケアに保存された体重・体脂肪率・ワークアウトを、それぞれの記録画面から選んで取り込めます。初回はOSの画面で読み取りを許可してください。
        </Copy>
        <Copy>
          取得した値は保存前に確認・修正できます。筋肉量、筋トレの重量・回数・セット数は手入力です。自動同期やヘルスケアへの書き込みは行いません。
        </Copy>
      </Card>
      {Platform.OS === "ios" && (
        <Button
          title="運動を記録する"
          onPress={() => router.push("/workouts/log")}
        />
      )}
      {Platform.OS === "ios" ? (
        <Button
          title="体組成を記録する"
          onPress={() => router.push("/progress/measurement")}
        />
      ) : (
        <Notice>
          取り込みはiPhoneで利用できます。Androidの連携は準備中です。
        </Notice>
      )}
      <Notice>
        サーバーへの送信は行いません。記録は現在、アプリの起動中のみ保持されます。読み取り許可はiPhoneの設定から変更できます。
      </Notice>
    </Screen>
  );
}
