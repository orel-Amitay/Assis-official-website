export function shortDashes(value: string) {
  return String(value || "").replace(/[—–]/g, "-");
}
