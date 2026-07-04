import { API_BASE_URL } from "@/lib/api.ts";

const SESSION_KEY = "kira_session";

export type UserType = "CLIENTE" | "EMPRESA";

export interface Session {
  token: string;
  tipo: UserType;
  nome: string;
  email: string;
}

export type LoginResult =
  | { ok: true; session: Session }
  | { ok: false; reason: "invalid_credentials" | "network_error" };

export async function login(
  email: string,
  senha: string,
  tipoSelecionado: UserType
): Promise<LoginResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (!res.ok) {
      return { ok: false, reason: "invalid_credentials" };
    }

    const data = (await res.json()) as Session;

    if (data.tipo === "CLIENTE" && tipoSelecionado === "EMPRESA") {
      return { ok: false, reason: "invalid_credentials" };
    }

    if (data.tipo === "EMPRESA" && tipoSelecionado === "CLIENTE") {
      return { ok: false, reason: "invalid_credentials" };
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    return { ok: true, session: data };
  } catch (err) {
    console.warn("[auth] Não foi possível conectar ao backend.", err);
    return { ok: false, reason: "network_error" };
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function getAuthHeader(): Record<string, string> {
  const session = getSession();
  return session ? { Authorization: `Bearer ${session.token}` } : {};
}
