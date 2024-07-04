import type { EnvironmentContent } from "../../globals";

export const parseEnvironmentContent = (
  content: string
): EnvironmentContent => {
  const lines = content.split("\n");
  const data: EnvironmentContent = {};

  for (const line of lines) {
    const [key, value] = line.split("=");
    if (key && value) {
      data[key.trim()] = { value: value.trim(), type: "string" };
    }
  }
  return data;
};
