import { useEffect, useRef, useState } from "react";
import { Image, Linking, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button, Card, Copy, ErrorText, Icon } from "./ui";

export function MealPhoto({
  uri,
  onChange,
  readOnly = false,
}: {
  uri: string;
  onChange?: (uri: string) => void;
  readOnly?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [needsSettings, setNeedsSettings] = useState(false);
  const inFlight = useRef(false);
  const recovered = useRef(false);

  useEffect(() => {
    if (Platform.OS !== "android" || readOnly || recovered.current || !onChange)
      return;
    recovered.current = true;
    let active = true;
    ImagePicker.getPendingResultAsync()
      .then((result) => {
        if (!active || !result) return;
        if ("code" in result)
          setError("写真を復元できませんでした。もう一度撮影してください。");
        else if (!result.canceled && result.assets?.[0])
          onChange(result.assets[0].uri);
      })
      .catch(() => {
        if (active)
          setError(
            "撮影結果を確認できませんでした。もう一度撮影してください。",
          );
      });
    return () => {
      active = false;
    };
  }, [onChange, readOnly]);

  const takePhoto = async () => {
    if (!onChange || inFlight.current) return;
    const native = Platform.OS !== "web";
    // Web's file/camera picker must open directly from the user gesture; its
    // cancel event is not reliably returned, so do not lock the button on web.
    inFlight.current = native;
    setBusy(native);
    setError("");
    setNeedsSettings(false);
    try {
      if (native) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setNeedsSettings(!permission.canAskAgain);
          setError(
            "カメラの使用が許可されていません。写真なしでも料理を選んで記録できます。",
          );
          return;
        }
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.75,
        exif: false,
      });
      if (!result.canceled && result.assets?.[0])
        onChange(result.assets[0].uri);
    } catch {
      setError(
        "カメラを起動できませんでした。端末でカメラが利用できるか確認してください。",
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  if (readOnly && !uri) return null;
  return (
    <Card>
      {!readOnly && (
        <>
          <Icon name="camera-outline" size={32} />
          <Button
            title={
              busy ? "カメラを起動中…" : uri ? "写真を撮り直す" : "写真を撮る"
            }
            disabled={busy}
            onPress={takePhoto}
          />
        </>
      )}
      {uri && (
        <Image
          source={{ uri }}
          accessibilityLabel="撮影した食事の写真"
          resizeMode="cover"
          style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 12 }}
        />
      )}
      {!readOnly && uri && (
        <Button
          secondary
          title="写真を削除する"
          onPress={() => onChange?.("")}
        />
      )}
      <ErrorText message={error} />
      {needsSettings && (
        <Button
          secondary
          title="端末の設定を開く"
          onPress={() => {
            Linking.openSettings().catch(() =>
              setError("端末の設定からカメラの使用を許可してください。"),
            );
          }}
        />
      )}
      {!readOnly && (
        <Copy>
          写真は任意です。撮影画像の栄養解析・アップロードは行いません。
        </Copy>
      )}
    </Card>
  );
}
