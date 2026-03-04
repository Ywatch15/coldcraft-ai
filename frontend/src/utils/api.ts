const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");

interface RequestOptions {
  method?: string;
  body?: Record<string, unknown>;
  token?: string;
}

export async function apiRequest<T = Record<string, unknown>>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
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

  return data as T;
}

// ─── Auth helpers ────────────────────────────────────

export const authAPI = {
  register: (email: string, password: string) =>
    apiRequest<{ message: string; _dev_otp?: string }>("/api/auth/register", {
      method: "POST",
      body: { email, password },
    }),

  verifyOtp: (email: string, otp: string) =>
    apiRequest<{ token: string; user: { id: string; email: string } }>("/api/auth/verify-otp", {
      method: "POST",
      body: { email, otp },
    }),

  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: { id: string; email: string } }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    }),
};

// ─── Email helpers ───────────────────────────────────

export interface GeneratedEmail {
  id: string;
  subject: string;
  body: string;
  metadata: {
    recipientName: string;
    company: string;
    role: string;
    goal: string;
    tone: string;
  };
  createdAt: string;
}

export const emailsAPI = {
  generate: (
    data: {
      recipientName: string;
      company: string;
      role: string;
      goal: string;
      tone: string;
      extraContext: string;
    },
    token: string
  ) =>
    apiRequest<GeneratedEmail>("/api/emails/generate", {
      method: "POST",
      body: data as unknown as Record<string, unknown>,
      token,
    }),

  getAll: (token: string) =>
    apiRequest<GeneratedEmail[]>("/api/emails", { token }),

  getById: (id: string, token: string) =>
    apiRequest<GeneratedEmail>(`/api/emails/${id}`, { token }),
};
