import type { Veiculo } from "./Veiculo";

export type StatusLocacao = "ATIVA" | "FINALIZADA";

export interface Locacao {
  id: number;
  usuarioId: number;
  veiculoId: number;
  dataInicio: string;
  dataPrevistaDevolucao: string;
  dataDevolucao: string | null;
  valorTotal: string;
  status: StatusLocacao;
  veiculo: Veiculo;
}

export interface NovaLocacao {
  veiculoId: number;
  dataInicio: string;
  dataPrevistaDevolucao: string;
}
