import { jwtDecode } from "jwt-decode";
import type { TokenPayload, UsuarioLogado } from "../types/Auth";

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp || decoded.exp * 1000 <= Date.now()) {
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
}

export function obterUsuarioLogado(): UsuarioLogado | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return { id: Number(decoded.sub), nome: decoded.nome, email: decoded.email };
  } catch {
    return null;
  }
}
