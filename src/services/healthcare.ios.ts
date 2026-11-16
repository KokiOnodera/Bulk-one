import Constants from "expo-constants";
import { localDate } from "../state/app-state";
import type { HealthMeasurement } from "./healthcare";

export async function readHealthWorkouts(): Promise<HealthMeasurement[]> {
  const health = await loadHealthKit();
  const completed = await health.requestAuthorization({
    toRead: ["HKWorkoutTypeIdentifier"],
  });
  if (!completed)
    throw new Error(
      "ワークアウトの権限確認が完了しませんでした。もう一度お試しください。",
    );
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 90);
  const workouts = await health.queryWorkoutSamples({
    limit: 20,
    ascending: false,
    filter: { date: { startDate, endDate } },
  });
  const names: Record<number, string> = {
    [health.WorkoutActivityType.running]: "ランニング",
    [health.WorkoutActivityType.walking]: "ウォーキング",
    [health.WorkoutActivityType.cycling]: "サイクリング",
    [health.WorkoutActivityType.traditionalStrengthTraining]:
      "筋力トレーニング",
    [health.WorkoutActivityType.functionalStrengthTraining]:
      "機能的筋力トレーニング",
    [health.WorkoutActivityType.highIntensityIntervalTraining]: "HIIT",
    [health.WorkoutActivityType.swimming]: "水泳",
    [health.WorkoutActivityType.yoga]: "ヨガ",
    [health.WorkoutActivityType.pilates]: "ピラティス",
    [health.WorkoutActivityType.hiking]: "ハイキング",
    [health.WorkoutActivityType.elliptical]: "エリプティカル",
    [health.WorkoutActivityType.rowing]: "ローイング",
    [health.WorkoutActivityType.coreTraining]: "コアトレーニング",
  };
  try {
    return workouts.map((workout) => {
      const date = workout.startDate;
      const seconds = workout.duration.quantity;
      if (!Number.isFinite(seconds) || seconds < 0)
        throw new Error("運動時間を読み取れないワークアウトがありました。");
      return {
        id: workout.uuid,
        source: workout.sourceRevision.source.name,
        data: {
          name:
            names[workout.workoutActivityType] ||
            `ワークアウト（${health.WorkoutActivityType[workout.workoutActivityType] || workout.workoutActivityType}）`,
          date: `${localDate(date)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
          minutes: String(Math.round((seconds / 60) * 100) / 100),
          status: "実施",
          fatigue: "",
          sets: '[{"weight":"","reps":""}]',
          healthkitId: workout.uuid,
          healthkitDate: date.toISOString(),
          healthkitEndDate: workout.endDate.toISOString(),
          healthkitDurationSeconds: String(seconds),
          healthkitActivityType: String(workout.workoutActivityType),
          healthkitSource: workout.sourceRevision.source.name,
        },
      };
    });
  } finally {
    // Retain only plain data in React state and release the native objects.
    workouts.forEach((workout) => workout.dispose());
  }
}

async function loadHealthKit() {
  if (Constants.executionEnvironment === "storeClient") {
    throw new Error(
      "ヘルスケア連携には開発ビルドが必要です。Expo Goでは利用できません。",
    );
  }
  let health: typeof import("@kingstinct/react-native-healthkit");
  try {
    health = await import("@kingstinct/react-native-healthkit");
  } catch {
    throw new Error(
      "HealthKitを読み込めません。最新のiOS開発ビルドをインストールしてください。",
    );
  }
  if (!health.isHealthDataAvailable()) {
    throw new Error("この端末ではヘルスケアを利用できません。");
  }
  return health;
}

export async function readHealthMeasurements(): Promise<HealthMeasurement[]> {
  const health = await loadHealthKit();
  const completed = await health.requestAuthorization({
    toRead: [
      "HKQuantityTypeIdentifierBodyMass",
      "HKQuantityTypeIdentifierBodyFatPercentage",
    ],
  });
  if (!completed) {
    throw new Error(
      "ヘルスケアの権限確認が完了しませんでした。もう一度お試しください。",
    );
  }
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 90);
  const options = {
    limit: 100,
    ascending: false,
    filter: { date: { startDate, endDate } },
  };
  const [weights, fats] = await Promise.all([
    health.queryQuantitySamples("HKQuantityTypeIdentifierBodyMass", {
      ...options,
      unit: "kg",
    }),
    health.queryQuantitySamples("HKQuantityTypeIdentifierBodyFatPercentage", {
      ...options,
      unit: "%",
    }),
  ]);
  return weights
    .filter((w) => Number.isFinite(w.quantity) && w.quantity > 0)
    .slice(0, 20)
    .map((weight) => {
      const date = weight.startDate;
      // Never combine unrelated readings, even when they are on the same day.
      const fat = fats.find(
        (f) =>
          f.sourceRevision.source.bundleIdentifier ===
            weight.sourceRevision.source.bundleIdentifier &&
          f.startDate.getTime() === date.getTime() &&
          Number.isFinite(f.quantity),
      );
      return {
        id: weight.uuid,
        source: weight.sourceRevision.source.name,
        data: {
          date: `${localDate(date)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
          weight: String(weight.quantity),
          fat: fat ? String(fat.quantity) : "",
          muscle: "",
          healthkitId: weight.uuid,
          healthkitFatId: fat?.uuid || "",
          healthkitDate: date.toISOString(),
          healthkitSource: weight.sourceRevision.source.name,
        },
      };
    });
}
