import { PropsWithChildren, ReactNode } from "react";
import {
  ColorValue,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export const colors = {
  ink: "#202c32",
  green: "#20bd79",
  pale: "#eaf9f2",
  muted: "#748087",
  line: "#e7eceb",
  bg: "#f8faf9",
  red: "#d24d55",
};
export function Icon({
  name,
  size = 24,
  color = colors.green,
}: {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: ColorValue;
}) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={typeof color === "number" ? colors.green : (color ?? colors.green)}
    />
  );
}
export function Screen({
  title,
  subtitle,
  children,
  footer,
  back = true,
}: PropsWithChildren<{
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  back?: boolean;
}>) {
  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.top}>
          {back ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="戻る"
              style={s.touch}
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/")
              }
            >
              <Icon name="chevron-back" color={colors.ink} />
            </Pressable>
          ) : (
            <Text style={s.brand}>
              BULK <Text style={{ color: colors.green }}>ONE</Text>
            </Text>
          )}
          <Text style={s.micro}>YOUR PERSONAL FITNESS</Text>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.content}
        >
          <Text style={s.title}>{title}</Text>
          {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
          {children}
        </ScrollView>
        {footer && <View style={s.footer}>{footer}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Button({
  title,
  onPress,
  secondary,
  danger,
  disabled,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        danger && { backgroundColor: colors.red },
        (pressed || disabled) && { opacity: 0.55 },
      ]}
    >
      <Text style={[s.buttonText, secondary && { color: colors.ink }]}>
        {title}
      </Text>
      {!secondary && <Icon name="arrow-forward" size={18} color="white" />}
    </Pressable>
  );
}
export function Card({
  children,
  green = false,
}: PropsWithChildren<{ green?: boolean }>) {
  return (
    <View
      style={[
        s.card,
        green && { backgroundColor: colors.pale, borderColor: "#d2efdf" },
      ]}
    >
      {children}
    </View>
  );
}
export function Heading({ children }: PropsWithChildren) {
  return <Text style={s.heading}>{children}</Text>;
}
export function Copy({ children }: PropsWithChildren) {
  return <Text style={s.copy}>{children}</Text>;
}
export function Notice({ children }: PropsWithChildren) {
  return (
    <View style={s.notice}>
      <Icon name="information-circle-outline" size={20} />
      <Text style={s.noticeText}>{children}</Text>
    </View>
  );
}
export function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.copy}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}
export function Field({
  label,
  value,
  onChangeText,
  unit,
  numeric,
  secure,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  unit?: string;
  numeric?: boolean;
  secure?: boolean;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <View style={s.inputWrap}>
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={onChangeText}
          keyboardType={
            numeric
              ? "decimal-pad"
              : label.includes("メール")
                ? "email-address"
                : "default"
          }
          autoCapitalize="none"
          secureTextEntry={secure}
          placeholder={placeholder}
          placeholderTextColor="#99a3a8"
          multiline={multiline}
          style={[s.input, multiline && { minHeight: 80 }]}
        />
        {unit && <Text style={s.copy}>{unit}</Text>}
      </View>
    </View>
  );
}
export function Choices({
  options,
  value,
  onChange,
  multiple = false,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  multiple?: boolean;
}) {
  return (
    <View style={s.choices}>
      {options.map((option) => {
        const selected = value.split("、").includes(option);
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityLabel={option}
            accessibilityState={{ selected }}
            onPress={() =>
              onChange(
                multiple
                  ? (selected
                      ? value.split("、").filter((x) => x !== option)
                      : [...value.split("、").filter(Boolean), option]
                    ).join("、")
                  : option,
              )
            }
            style={[s.choice, selected && s.selected]}
          >
            <Text style={[s.choiceText, selected && { color: "#15925c" }]}>
              {option}
            </Text>
            <Icon
              name={selected ? "checkmark-circle" : "ellipse-outline"}
              size={20}
              color={selected ? colors.green : "#cbd3d5"}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
export function Menu({
  title,
  detail,
  icon,
  onPress,
}: {
  title: string;
  detail?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={s.menu}
    >
      <View style={s.iconBox}>
        <Icon name={icon} />
      </View>
      <View style={s.flex}>
        <Text style={s.label}>{title}</Text>
        {detail && <Text style={s.copy}>{detail}</Text>}
      </View>
      <Icon name="chevron-forward" color="#9aa5aa" size={20} />
    </Pressable>
  );
}
export function Steps({ current, total }: { current: number; total: number }) {
  return (
    <View style={s.stepRow}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[s.step, i <= current && { backgroundColor: colors.green }]}
        />
      ))}
    </View>
  );
}
export function ErrorText({ message }: { message: string }) {
  return message ? (
    <Text
      accessibilityRole="alert"
      style={{ color: colors.red, marginVertical: 10 }}
    >
      {message}
    </Text>
  ) : null;
}
export const s = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: "white" },
  top: {
    paddingHorizontal: 20,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  touch: { minHeight: 44, minWidth: 44, justifyContent: "center" },
  brand: {
    fontSize: 21,
    fontWeight: "900",
    fontStyle: "italic",
    letterSpacing: -1,
  },
  micro: { fontSize: 9, letterSpacing: 1.5, color: colors.muted },
  content: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
    flexGrow: 1,
  },
  title: { color: colors.ink, fontSize: 27, fontWeight: "800", lineHeight: 38 },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: colors.line,
    gap: 10,
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
  },
  button: {
    minHeight: 54,
    backgroundColor: colors.ink,
    borderRadius: 13,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  secondary: { backgroundColor: "#f0f3f2" },
  buttonText: { color: "white", fontWeight: "700", fontSize: 15 },
  card: {
    padding: 19,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 12,
  },
  heading: { fontSize: 17, fontWeight: "700", color: colors.ink },
  copy: { fontSize: 13, color: colors.muted, lineHeight: 21 },
  notice: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.pale,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  noticeText: { color: "#25845e", fontSize: 12, lineHeight: 21, flex: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  value: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },
  field: { gap: 9 },
  label: { color: colors.ink, fontWeight: "600", fontSize: 14, lineHeight: 23 },
  inputWrap: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#fcfdfc",
  },
  input: {
    flex: 1,
    minHeight: 52,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 12,
  },
  choices: { gap: 12 },
  choice: {
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  selected: { borderColor: colors.green, backgroundColor: "#f3fcf7" },
  choiceText: { fontSize: 14, fontWeight: "600", color: colors.ink, flex: 1 },
  menu: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: colors.pale,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepRow: { flexDirection: "row", gap: 7, marginBottom: 14 },
  step: { height: 5, borderRadius: 4, flex: 1, backgroundColor: "#e4e8e7" },
});
