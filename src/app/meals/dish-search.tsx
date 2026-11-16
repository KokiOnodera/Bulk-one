import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  Button,
  Card,
  Choices,
  Copy,
  Field,
  Heading,
  Notice,
  Screen,
} from "../../components/ui";
import { dishes } from "../../data/dishes";
import { useApp } from "../../state/app-state";

const normalize = (value: string) =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase("ja-JP")
    .replace(/[ァ-ヶ]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0x60),
    )
    .replace(/\s/g, "");

export default function DishSearch() {
  const { draftKey } = useLocalSearchParams<{ draftKey?: string }>();
  const app = useApp();
  const key = draftKey || "meal";
  const draft = key === 'meal' || app.entries.some(entry => entry.kind === 'meal' && entry.id === key) ? app.drafts[key] : undefined;
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(draft?.name || "");
  const legacyNames = (draft?.name || "")
    .split("、")
    .filter((name) => name && !dishes.some((dish) => dish.name === name));
  const catalog = [...dishes.map((dish) => dish.name), ...legacyNames];
  const matches = catalog.filter((name) =>
    normalize(name).includes(normalize(query)),
  );
  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/meals/new");
  };
  return (
    <Screen
      title="料理検索"
      subtitle="料理名で検索して、食べた料理を選択してください。"
      onBack={back}
      footer={
        <Button
          title="選択した料理を反映する"
          disabled={!draft}
          onPress={() => {
            if (!draft) return;
            app.setDraft(key, {
              ...draft,
              name: selected,
              dishIds: JSON.stringify(
                dishes
                  .filter((dish) => selected.split("、").includes(dish.name))
                  .map((dish) => dish.id),
              ),
            });
            back();
          }}
        />
      }
    >
      <Field
        label="料理を検索"
        placeholder="例：サラダ、カレー、ごはん"
        value={query}
        onChangeText={setQuery}
      />
      <Notice>
        料理DBは準備中です。現在は仮の料理一覧を検索します。栄養値の自動入力は行いません。
      </Notice>
      {!draft && (
        <Notice>先に食事入力画面で料理の選択欄を開いてください。</Notice>
      )}
      <Heading>検索結果 {matches.length}件</Heading>
      {matches.length ? (
        <Choices
          options={matches}
          value={selected}
          multiple
          onChange={setSelected}
        />
      ) : (
        <Card>
          <Heading>料理が見つかりません</Heading>
          <Copy>別のキーワードで検索してください。</Copy>
        </Card>
      )}
      <Card>
        <Heading>選択中の料理</Heading>
        <Copy>{selected || "まだ選択していません"}</Copy>
        {selected && (
          <Button
            title="選択をすべて解除"
            secondary
            onPress={() => setSelected("")}
          />
        )}
      </Card>
    </Screen>
  );
}
