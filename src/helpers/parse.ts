import type { EnvironmentContent, EnvironmentKeyValueType } from "../types";

const LINE =
  /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(#.*)?(?:$|$)/gm;

export const parseEnvironmentContent = (lines: string): EnvironmentContent => {
  const obj: EnvironmentContent = {};

  // Convert line breaks to same format
  lines = lines.replace(/\r\n?/gm, "\n");

  let match;
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1];

    // Default undefined or null to empty string
    let value = match[2] || "";

    // Remove whitespace
    value = value.trim();

    // Check if double quoted
    const maybeQuote = value[0];

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");

    // Expand newlines if double quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, "\n");
      value = value.replace(/\\r/g, "\r");
    }

    // Add to object
    obj[key] = {
      value,
      type: inferType(value),
      options: parseOptions(match[3]),
    };
  }

  return obj;
};

export const inferType = (value: string): EnvironmentKeyValueType => {
  if (value === "true" || value === "false") {
    return "bool";
  } else {
    return "string";
  }
};

export const parseOptions = (input: string | undefined): string[] => {
  // Create a regex that finds the key followed by a colon and captures the value
  const regex = new RegExp(`options:([^\\s]*)`, "i");

  // Execute the regex on the input string
  const match = input?.match(regex);

  return match?.[1].split(",") ?? [];
};

export const replace = (content: string, key: string, value: string): string =>
  content.replace(new RegExp(`(${key}="?)([^\\s"]*)`, "g"), `$1${value}`);
