export type EnvironmentContent = Record<string, EnvironmentKeyValue>;

export interface EnvironmentKeyValue {
  value: string;
  type: EnvironmentKeyValueType;
}

export type EnvironmentKeyValueType = "string" | "bool" | "number";
