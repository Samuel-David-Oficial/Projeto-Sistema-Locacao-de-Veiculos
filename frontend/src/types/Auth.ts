import type { JwtPayload } from "jwt-decode";

export interface LoginForm {
  email: string;
  senha: string;
}

export interface CadastroForm {
  nome: string;
  email: string;
  senha: string;
}

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
}

export interface LoginResposta {
  token: string;
  usuario: UsuarioLogado;
}

export interface TokenPayload extends JwtPayload {
  nome: string;
  email: string;
}
