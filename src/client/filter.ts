function mapValue(value: unknown): string {
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (typeof value) {
    case "boolean":
    case "number":
      return `${value}`;
    case "string":
      return `'${value.replace(/'/gu, "\\'")}'`;
  }
  if (value === null) {
    return "null";
  }

  if (value instanceof Date) {
    return `'${value.toISOString().replace("T", " ")}'`;
  }

  return `'${JSON.stringify(value).replace(/'/gu, "\\'")}'`;
}

export function filter(strings: TemplateStringsArray, ...values: unknown[]): string {
  let str = strings[0];
  for (let i = 0; i < values.length; i++) {
    str += mapValue(values[i]) + strings[i + 1];
  }
  return str;
}
