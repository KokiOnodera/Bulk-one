import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  Button,
  Card,
  Copy,
  ErrorText,
  Field,
  Icon,
  Notice,
  Screen,
  Steps,
} from "../../components/ui";
import { useApp } from "../../state/app-state";
export default function Login() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const app = useApp();
  const [login, setLogin] = useState(mode === "login");
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  const finish = () => {
    if (login) {
      app.signInExistingDemo();
      router.replace('/home');
    } else {
      app.registerDemo();
      router.replace('/profile');
    }
  };
  const next = () => {
    setError("");
    if (step === 0) return setStep(1);
    if (step === 1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("メールアドレスの形式を確認してください。");
    if (login && step === 1) {
      if (password.length < 8)
        return setError("8文字以上のパスワードを入力してください。");
      return finish();
    }
    if (step === 2 && code !== "123456")
      return setError("デモコード「123456」を入力してください。");
    if (step === 3 && (password.length < 8 || password !== repeat))
      return setError(
        "8文字以上のパスワードを確認用と同じ内容で入力してください。",
      );
    setStep(step + 1);
  };
  return (
    <Screen
      onBack={
        step > 0
          ? () => {
              setError("");
              setStep(step - 1);
            }
          : undefined
      }
      title={
        login
          ? "おかえりなさい"
          : [
              "あなたの一歩を、ここから。",
              "メールアドレスを入力",
              "認証コードを入力",
              "パスワードを設定",
              "準備ができました！",
            ][step]
      }
      subtitle="BULK ONEと、自分らしい身体づくりを。"
      footer={
        <>
          <ErrorText message={error} />
          <Button
            title={
              step === 4
                ? "基本情報の入力へ"
                : step === 0
                  ? "メールアドレスで続ける"
                  : login
                    ? "デモでログイン"
                    : step === 3
                      ? "デモ登録を完了する"
                      : "次へ"
            }
            onPress={step === 4 ? finish : next}
          />
          {step > 0 && step < 4 && (
            <Button
              secondary
              title="前に戻る"
              onPress={() => {
                setStep(step - 1);
                setError("");
              }}
            />
          )}
        </>
      }
    >
      <Notice>
        UIデモです。認証サーバーへの接続・メール送信は行いません。実際のパスワードは入力しないでください。
        {login ? '既存ログインでは設定済みのデモユーザーでホームを表示します。' : '新規登録後は初期設定へ進みます。'}
      </Notice>
      <Steps current={step} total={5} />
      {step === 0 ? (
        <>
          <Card>
            <Icon name="fitness-outline" size={48} />
            <Copy>運動・食事・体組成をひとつのアプリで管理しましょう。</Copy>
          </Card>
          <Button
            secondary
            title={login ? "新しく登録する" : "アカウントをお持ちの方はこちら"}
            onPress={() => {
              setLogin(!login);
              setStep(1);
            }}
          />
          <Copy>Apple / Googleサインイン：準備中</Copy>
        </>
      ) : step === 1 ? (
        <>
          <Field
            label="メールアドレス"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
          />
          {login && (
            <Field
              label="パスワード（デモ用）"
              value={password}
              onChangeText={setPassword}
              secure
            />
          )}
        </>
      ) : step === 2 ? (
        <>
          <Field
            label="認証コード"
            value={code}
            onChangeText={setCode}
            numeric
          />
          <Notice>デモ用の確認コードは 123456 です。</Notice>
          <Button
            secondary
            title="コードを再確認"
            onPress={() =>
              setError("デモではメール送信は行いません。コードは123456です。")
            }
          />
        </>
      ) : step === 3 ? (
        <>
          <Field
            label="パスワード（デモ用・8文字以上）"
            value={password}
            onChangeText={setPassword}
            secure
          />
          <Field
            label="パスワード（確認）"
            value={repeat}
            onChangeText={setRepeat}
            secure
          />
        </>
      ) : (
        <Card green>
          <Icon name="checkmark-circle" size={70} />
          <Copy>
            次に、あなたに合ったプランのための基本情報を教えてください。
          </Copy>
        </Card>
      )}
    </Screen>
  );
}
