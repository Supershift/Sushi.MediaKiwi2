export async function fetchSettings(): Promise<any> {
  const baseUrl = import.meta.env.VITE_APP_SETTINGS_BASE_URL || "";
  const response = await fetch(baseUrl + "/api/settings");
  return await response.json();
}
