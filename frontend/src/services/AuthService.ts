import api from "../api/api";
import type { CadastroForm, LoginForm, LoginResposta } from "../types/Auth";

class AuthService {
  async login(dados: LoginForm): Promise<LoginResposta> {
    const response = await api.post<LoginResposta>("/login", dados);
    return response.data;
  }

  async cadastrar(dados: CadastroForm): Promise<void> {
    await api.post("/usuarios", dados);
  }
}

export default new AuthService();
