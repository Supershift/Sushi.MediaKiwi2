/** Saves the current theme to localstorage */
export function storeTheme(theme: string) {
  localStorage.setItem("MkTheme", theme);
}

/** Loads the current theme from localstorage */
export function loadTheme() {
  return localStorage.getItem("MkTheme");
}
