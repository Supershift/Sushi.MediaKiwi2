export function mapCountryName(code: string): string {
  switch (code) {
    case "NL":
      return "Nederland";
    case "BE":
      return "België";
    default:
      return "";
  }
}
