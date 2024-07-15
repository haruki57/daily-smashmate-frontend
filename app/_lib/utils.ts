export function getOrdinal(n: number): "th" | "st" | "nd" | "rd" {
  const s: ["th", "st", "nd", "rd"] = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}