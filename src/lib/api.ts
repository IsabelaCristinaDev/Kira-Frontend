/**
 * Cliente HTTP mínimo para integração com o backend Spring Boot.
 *
 * Ponto único de configuração do endereço da API. Ajuste via variável de
 * ambiente VITE_API_BASE_URL (ver .env) sem precisar alterar código.
 */
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081/api";

const DEFAULT_TIMEOUT_MS = 8000;

/**
 * POST genérico para a API.
 *
 * Nunca lança exceção: se o backend estiver fora do ar, a rota não existir
 * ainda, ou a requisição expirar, retorna `null` e apenas registra um aviso
 * no console. Isso garante que o fluxo de UI nunca trava nem quebra por
 * causa de uma falha de rede — quem chama decide o que fazer com `null`.
 */
export async function apiPost<T = unknown>(
  path: string,
  body: unknown
): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      console.warn(`[api] POST ${path} respondeu com status ${res.status}`);
      return null;
    }

    const text = await res.text();
    return text ? (JSON.parse(text) as T) : null;
  } catch (err) {
    console.warn(
      `[api] Não foi possível conectar ao backend em ${path}. Seguindo em modo offline/demo.`,
      err
    );
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
