import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, Icon, colors, s } from "./ui";
import { localDate, localTime } from "../state/app-state";

export function CalendarDateTime({
  value,
  onChange,
  label = "記録日時",
  showTime = true,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  showTime?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [initialDateTime] = useState(localTime);
  const [timePart, setTimePart] = useState<"hour" | "minute" | null>(null);
  const [month, setMonth] = useState(() => {
    const parsed = new Date(`${value.slice(0, 10)}T00:00:00`);
    const date = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const selectedDay = value.slice(0, 10) || initialDateTime.slice(0, 10);
  const time = /^\d{2}:\d{2}$/.test(value.split(' ')[1] || '') ? value.split(' ')[1] : initialDateTime.split(' ')[1];
  const [hour = "00", minute = "00"] = /^\d{2}:\d{2}$/.test(time)
    ? time.split(":")
    : ["00", "00"];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const today = localDate();
  const year = month.getFullYear();
  const monthNumber = month.getMonth();
  const firstWeekday = new Date(year, monthNumber, 1).getDay();
  const dayCount = new Date(year, monthNumber + 1, 0).getDate();
  const cells = Math.ceil((firstWeekday + dayCount) / 7) * 7;
  const nextMonth = new Date(year, monthNumber + 1, 1);
  const canNext = localDate(nextMonth) <= today;
  const select = (date: string) => {
    const now = new Date();
    const nowTime = now.toTimeString().slice(0, 5);
    const selectedTime = date === today && time > nowTime ? nowTime : time;
    onChange(showTime ? `${date} ${selectedTime}` : date);
    setOpen(false);
  };

  return (
    <Card>
      <Text style={s.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}を選択`}
        accessibilityState={{ expanded: open }}
        onPress={() => {
          setTimePart(null);
          if (!open) {
            const parsed = new Date(`${selectedDay}T00:00:00`);
            if (!Number.isNaN(parsed.getTime()))
              setMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
          }
          setOpen(!open);
        }}
        style={styles.dateButton}
      >
        <Icon name="calendar-outline" />
        <Text style={s.label}>{selectedDay.replaceAll("-", "/")}</Text>
        <Icon
          name={open ? "chevron-up" : "chevron-down"}
          color={colors.muted}
          size={18}
        />
      </Pressable>
      {open && (
        <View style={{ gap: 10 }}>
          <View style={styles.monthHeader}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="前の月"
              onPress={() => setMonth(new Date(year, monthNumber - 1, 1))}
              style={s.touch}
            >
              <Icon name="chevron-back" />
            </Pressable>
            <Text accessibilityRole="header" style={s.label}>
              {year}年{monthNumber + 1}月
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="次の月"
              disabled={!canNext}
              accessibilityState={{ disabled: !canNext }}
              onPress={() => setMonth(nextMonth)}
              style={[
                s.touch,
                { opacity: canNext ? 1 : 0.3, alignItems: "flex-end" },
              ]}
            >
              <Icon name="chevron-forward" />
            </Pressable>
          </View>
          <View style={styles.grid}>
            {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
              <View key={day} style={styles.cell}>
                <Text style={s.copy}>{day}</Text>
              </View>
            ))}
          </View>
          <View style={styles.grid}>
            {Array.from({ length: cells }, (_, index) => {
              const day = index - firstWeekday + 1;
              if (day < 1 || day > dayCount)
                return <View key={index} style={styles.cell} />;
              const date = localDate(new Date(year, monthNumber, day));
              const disabled = date > today;
              const selected = date === selectedDay;
              return (
                <View key={index} style={styles.cell}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${year}年${monthNumber + 1}月${day}日`}
                    accessibilityState={{ selected, disabled }}
                    disabled={disabled}
                    onPress={() => select(date)}
                    style={[
                      styles.day,
                      selected && { backgroundColor: colors.green },
                      date === today &&
                        !selected && {
                          borderWidth: 1,
                          borderColor: colors.green,
                        },
                      disabled && { opacity: 0.25 },
                    ]}
                  >
                    <Text
                      style={{
                        color: selected ? "white" : colors.ink,
                        fontWeight: selected ? "700" : "400",
                      }}
                    >
                      {day}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="今日を選択"
            onPress={() => select(today)}
            style={styles.dateButton}
          >
            <Text style={{ color: colors.green }}>今日</Text>
          </Pressable>
        </View>
      )}
      {showTime && (
        <View style={{ gap: 10 }}>
          <Text style={s.label}>時刻</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {(["hour", "minute"] as const).map((part) => (
              <Pressable
                key={part}
                accessibilityRole="button"
                accessibilityLabel={`${label}の${part === "hour" ? "時" : "分"}を選択`}
                accessibilityState={{ expanded: timePart === part }}
                onPress={() => {
                  setOpen(false);
                  setTimePart(timePart === part ? null : part);
                }}
                style={[styles.dateButton, { flex: 1 }]}
              >
                <Text style={s.label}>
                  {part === "hour" ? hour : minute}{" "}
                  {part === "hour" ? "時" : "分"}
                </Text>
                <Icon
                  name={timePart === part ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.muted}
                />
              </Pressable>
            ))}
          </View>
          {timePart && (
            <ScrollView
              key={timePart}
              contentOffset={{ x: 0, y: Math.max(0, Number(timePart === 'hour' ? hour : minute) - 2) * 44 }}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              style={{
                maxHeight: 220,
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 12,
              }}
            >
              {Array.from(
                { length: timePart === "hour" ? 24 : 60 },
                (_, index) => {
                  const option = String(index).padStart(2, "0");
                  const selected =
                    option === (timePart === "hour" ? hour : minute);
                  const disabled =
                    selectedDay === today &&
                    (timePart === "hour"
                      ? index > currentHour
                      : Number(hour) > currentHour ||
                        (Number(hour) === currentHour &&
                          index > currentMinute));
                  return (
                    <Pressable
                      key={option}
                      accessibilityRole="button"
                      accessibilityLabel={`${index}${timePart === "hour" ? "時" : "分"}`}
                      accessibilityState={{ selected, disabled }}
                      disabled={disabled}
                      onPress={() => {
                        const selectedHour =
                          timePart === "hour" ? option : hour;
                        let selectedMinute =
                          timePart === "minute" ? option : minute;
                        const current = new Date();
                        if (
                          selectedDay === localDate(current) &&
                          Number(selectedHour) === current.getHours() &&
                          Number(selectedMinute) > current.getMinutes()
                        )
                          selectedMinute = String(
                            current.getMinutes(),
                          ).padStart(2, "0");
                        onChange(
                          `${selectedDay} ${selectedHour}:${selectedMinute}`,
                        );
                        setTimePart(null);
                      }}
                      style={{
                        minHeight: 44,
                        paddingHorizontal: 16,
                        justifyContent: "center",
                        backgroundColor: selected ? colors.pale : "white",
                        opacity: disabled ? 0.3 : 1,
                      }}
                    >
                      <Text
                        style={{ color: selected ? colors.green : colors.ink }}
                      >
                        {option} {timePart === "hour" ? "時" : "分"}
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </ScrollView>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  dateButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: "14.285714%",
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  day: {
    width: "100%",
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
});
