import { Text, View } from "react-native";
import { router } from "expo-router";
import {
  Button,
  Card,
  Copy,
  Heading,
  Icon,
  Screen,
  colors,
  s,
} from "../../components/ui";
export default function Welcome() {
  return (
    <Screen
      back={false}
      title={"理想の身体を、\nAIと一緒に。"}
      subtitle="トレーニング・食事・体組成をひとつに。あなたに合った一歩を、毎日。"
      footer={
        <>
          <Button title="はじめる" onPress={() => router.push("/login")} />
          <Button
            title="すでにアカウントをお持ちの方"
            secondary
            onPress={() => router.push("/login?mode=login")}
          />
        </>
      }
    >
      <View
        style={{
          alignItems: "center",
          padding: 26,
          backgroundColor: colors.pale,
          borderRadius: 24,
          gap: 14,
        }}
      >
        <Icon name="barbell" size={76} />
        <Text style={[s.brand, { fontSize: 40 }]}>BULK ONE</Text>
        <Copy>理想の身体へ、迷わず進める。</Copy>
      </View>
      {[
        [
          "barbell-outline",
          "あなただけのトレーニング",
          "目標・経験・生活に合わせた運動プラン。",
        ],
        [
          "restaurant-outline",
          "食事・栄養をひとつに",
          "毎日の食事とPFCをかんたんに記録。",
        ],
        [
          "stats-chart-outline",
          "小さな変化を、確かな自信に",
          "体組成の推移と週次レビューで振り返り。",
        ],
      ].map(([icon, title, copy]) => (
        <Card key={title}>
          <Icon name={icon as "barbell-outline"} />
          <Heading>{title}</Heading>
          <Copy>{copy}</Copy>
        </Card>
      ))}
    </Screen>
  );
}
