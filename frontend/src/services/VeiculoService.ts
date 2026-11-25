import api from "../api/api";
import type { NovoVeiculo, Veiculo } from "../types/Veiculo";

class VeiculoService {
  async listar(disponivel?: boolean): Promise<Veiculo[]> {
    const params = disponivel === undefined ? {} : { disponivel };
    const response = await api.get<Veiculo[]>("/veiculos", { params });
    return response.data;
  }

  async cadastrar(dados: NovoVeiculo): Promise<Veiculo> {
    const response = await api.post<Veiculo>("/veiculos", dados);
    return response.data;
  }
}

export default new VeiculoService();
