import type { Locacao } from "../types/Locacao";
import { formatarData, formatarMoeda } from "../utils/formatadores";

interface LocacaoListaProps {
  locacoes: Locacao[];
  carregando: boolean;
  finalizandoId: number | null;
  onFinalizar: (id: number) => void;
}

function LocacaoLista({ locacoes, carregando, finalizandoId, onFinalizar }: LocacaoListaProps) {
  if (carregando) return <p>Carregando locações...</p>;
  if (locacoes.length === 0) return <p>Você ainda não possui locações.</p>;

  return (
    <div className="tabela-rolavel">
      <table>
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Início</th>
            <th>Devolução prevista</th>
            <th>Devolvido em</th>
            <th>Valor total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {locacoes.map((locacao) => (
            <tr key={locacao.id}>
              <td>
                {locacao.veiculo.marca} {locacao.veiculo.modelo}
                <small>{locacao.veiculo.placa}</small>
              </td>
              <td>{formatarData(locacao.dataInicio)}</td>
              <td>{formatarData(locacao.dataPrevistaDevolucao)}</td>
              <td>{locacao.dataDevolucao ? formatarData(locacao.dataDevolucao) : "-"}</td>
              <td>{formatarMoeda(locacao.valorTotal)}</td>
              <td>
                <span className={`selo ${locacao.status === "ATIVA" ? "ativa" : "ok"}`}>
                  {locacao.status === "ATIVA" ? "Ativa" : "Finalizada"}
                </span>
              </td>
              <td>
                {locacao.status === "ATIVA" && (
                  <button
                    type="button"
                    className="secundario"
                    disabled={finalizandoId === locacao.id}
                    onClick={() => onFinalizar(locacao.id)}
                  >
                    {finalizandoId === locacao.id ? "Finalizando..." : "Finalizar"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LocacaoLista;
