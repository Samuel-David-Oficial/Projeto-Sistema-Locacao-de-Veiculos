export interface Veiculo {
  id: number;
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  valorDiaria: string;
  disponivel: boolean;
}

export interface NovoVeiculo {
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  valorDiaria: number;
}

export type FiltroDisponibilidade = "todos" | "disponiveis" | "indisponiveis";
