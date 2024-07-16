export type EnvironmentContent = Record<
  string,
  EnvironmentContent | EnvironmentKeyValue
>;

export interface EnvironmentKeyValue {
  value: string;
  type: EnvironmentKeyValueType;
  options?: string[];
}

export type EnvironmentKeyValueType = "string" | "bool";
