import api from "../api/api";
import type { Locacao, NovaLocacao } from "../types/Locacao";

class LocacaoService {
  async listar(): Promise<Locacao[]> {
    const response = await api.get<Locacao[]>("/locacoes");
    return response.data;
  }

  async registrar(dados: NovaLocacao): Promise<Locacao> {
    const response = await api.post<Locacao>("/locacoes", dados);
    return response.data;
  }

  async finalizar(id: number): Promise<Locacao> {
    const response = await api.patch<Locacao>(`/locacoes/${id}/finalizar`);
    return response.data;
  }
}

export default new LocacaoService();
