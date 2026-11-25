import type { Veiculo } from "../types/Veiculo";
import { formatarMoeda } from "../utils/formatadores";

interface VeiculoListaProps {
  veiculos: Veiculo[];
  carregando: boolean;
}

function VeiculoLista({ veiculos, carregando }: VeiculoListaProps) {
  if (carregando) return <p>Carregando veículos...</p>;
  if (veiculos.length === 0) return <p>Nenhum veículo encontrado.</p>;

  return (
    <div className="tabela-rolavel">
      <table>
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Placa</th>
            <th>Ano</th>
            <th>Diária</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          {veiculos.map((veiculo) => (
            <tr key={veiculo.id}>
              <td>
                {veiculo.marca} {veiculo.modelo}
              </td>
              <td>{veiculo.placa}</td>
              <td>{veiculo.ano}</td>
              <td>{formatarMoeda(veiculo.valorDiaria)}</td>
              <td>
                <span className={`selo ${veiculo.disponivel ? "ok" : "ocupado"}`}>
                  {veiculo.disponivel ? "Disponível" : "Alugado"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VeiculoLista;
