const SYMBOLS: Record<string, string> = {
  EUR: "€", USD: "$", GBP: "£", CHF: "Fr.", CAD: "CA$", JPY: "¥",
};

export function sym(code: string): string {
  return SYMBOLS[code] ?? code;
}
