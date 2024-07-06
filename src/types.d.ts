export type EnvironmentContent = Record<string, EnvironmentKeyValue>;

export interface EnvironmentKeyValue {
  value: string;
  type: "string" | "bool" | "number";
}
