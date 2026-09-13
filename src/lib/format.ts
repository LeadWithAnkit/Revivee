export const todayISO = () => new Date().toISOString().slice(0, 10);

export function niceDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {weekday: "short", day: "numeric", month: "short"}).format(new Date(`${value}T12:00:00`));
}

export function monthTitle(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {month: "long", year: "numeric"}).format(date);
}

export function clamp(n: number, min=0, max=10) {
  return Math.min(max, Math.max(min, n));
}
