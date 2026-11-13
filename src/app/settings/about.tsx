import { Card, Copy, Heading, Notice, Row, Screen } from "../../components/ui";
export default function About() {
  return (
    <Screen title="アプリ情報・データについて">
      <Card>
        <Heading>BULK ONE</Heading>
        <Row label="バージョン" value="1.0.0 / UIデモ" />
        <Copy>理想の身体へ、迷わず進める。</Copy>
      </Card>
      <Notice>
        このアプリはUIデモです。記録はメモリ内に保持され、再起動・リロードで消去されます。サーバーへの保存や送信は行いません。
      </Notice>
      <Card>
        <Heading>準備中の機能</Heading>
        <Copy>
          本番認証、AIプラン生成、クラウド保存、通知、ヘルスケア連携、写真解析、データエクスポート。
        </Copy>
      </Card>
      <Card>
        <Heading>利用規約・プライバシーポリシー</Heading>
        <Copy>正式な文書と問い合わせ先は公開前に設定予定です。</Copy>
      </Card>
    </Screen>
  );
}
