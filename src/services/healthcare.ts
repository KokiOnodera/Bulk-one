import { Form } from "../state/app-state";

export type HealthMeasurement = { id: string; source: string; data: Form };

export async function readHealthWorkouts(): Promise<HealthMeasurement[]> {
  throw new Error("ワークアウトの取り込みはiPhoneで利用できます。");
}

export async function readHealthMeasurements(): Promise<HealthMeasurement[]> {
  throw new Error("ヘルスケアからの取り込みはiPhoneで利用できます。");
}
