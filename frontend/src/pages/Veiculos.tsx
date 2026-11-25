import { useEffect, useState } from "react";
import Mensagem from "../components/Mensagem";
import VeiculoForm from "../components/VeiculoForm";
import VeiculoLista from "../components/VeiculoLista";
import VeiculoService from "../services/VeiculoService";
import type { Feedback } from "../types/Feedback";
import type { FiltroDisponibilidade, Veiculo } from "../types/Veiculo";
import { extrairMensagem } from "../utils/erros";

const valoresDoFiltro: Record<FiltroDisponibilidade, boolean | undefined> = {
  todos: undefined,
  disponiveis: true,
  indisponiveis: false,
};

function Veiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [filtro, setFiltro] = useState<FiltroDisponibilidade>("todos");
  const [carregando, setCarregando] = useState(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const lista = await VeiculoService.listar(valoresDoFiltro[filtro]);
        if (ativo) setVeiculos(lista);
      } catch (erro) {
        if (ativo) setFeedback({ tipo: "erro", texto: extrairMensagem(erro) });
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [filtro, versao]);

  function handleResultado(resultado: Feedback) {
    setFeedback(resultado);
    if (resultado.tipo === "sucesso") {
      setVersao((atual) => atual + 1);
    }
  }

  return (
    <div className="duas-colunas">
      <VeiculoForm onResultado={handleResultado} />
      <section className="cartao">
        <div className="cabecalho-secao">
          <h2>Frota</h2>
          <label className="filtro">
            Mostrar
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as FiltroDisponibilidade)}
            >
              <option value="todos">Todos</option>
              <option value="disponiveis">Somente disponíveis</option>
              <option value="indisponiveis">Somente alugados</option>
            </select>
          </label>
        </div>
        <Mensagem feedback={feedback} />
        <VeiculoLista veiculos={veiculos} carregando={carregando} />
      </section>
    </div>
  );
}

export default Veiculos;
