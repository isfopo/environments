import type { EnvironmentContent } from "../types";

export const parseEnvironmentContent = (
  content: string
): EnvironmentContent => {
  const lines = content.split("\n");
  const data: EnvironmentContent = {};

  for (const line of lines) {
    const [key, split] = line.split("=");

    if (key && split) {
      const [value, comment] = split.split("#");
      data[key.trim()] = { value: value.trim(), type: "string" };
    }
  }
  return data;
};
