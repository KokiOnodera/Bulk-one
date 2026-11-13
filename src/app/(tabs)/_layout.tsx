import { Tabs } from "expo-router";
import { Icon, colors } from "../../components/ui";
export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: "#8d989e",
        tabBarStyle: { borderTopColor: colors.line },
        tabBarLabelStyle: { fontSize: 10 },
        tabBarItemStyle: { paddingVertical: 4 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "ホーム",
          tabBarAccessibilityLabel: "ホーム",
          tabBarIcon: ({ color }) => <Icon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="workout-tab"
        options={{
          title: "運動",
          tabBarAccessibilityLabel: "運動",
          tabBarIcon: ({ color }) => (
            <Icon name="barbell-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meals-tab"
        options={{
          title: "食事",
          tabBarAccessibilityLabel: "食事",
          tabBarIcon: ({ color }) => (
            <Icon name="restaurant-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress-tab"
        options={{
          title: "進捗",
          tabBarAccessibilityLabel: "進捗",
          tabBarIcon: ({ color }) => (
            <Icon name="stats-chart-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings-tab"
        options={{
          title: "設定",
          tabBarAccessibilityLabel: "設定",
          tabBarIcon: ({ color }) => (
            <Icon name="person-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
