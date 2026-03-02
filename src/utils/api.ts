const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface RequestOptions {
  method?: string;
  body?: Record<string, unknown>;
  token?: string;
}

export async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
