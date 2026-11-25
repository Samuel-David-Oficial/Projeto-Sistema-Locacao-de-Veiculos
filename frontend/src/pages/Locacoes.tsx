import { useEffect, useState } from "react";
import LocacaoForm from "../components/LocacaoForm";
import LocacaoLista from "../components/LocacaoLista";
import Mensagem from "../components/Mensagem";
import LocacaoService from "../services/LocacaoService";
import VeiculoService from "../services/VeiculoService";
import type { Feedback } from "../types/Feedback";
import type { Locacao } from "../types/Locacao";
import type { Veiculo } from "../types/Veiculo";
import { extrairMensagem } from "../utils/erros";

function Locacoes() {
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [disponiveis, setDisponiveis] = useState<Veiculo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [finalizandoId, setFinalizandoId] = useState<number | null>(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const [listaLocacoes, listaVeiculos] = await Promise.all([
          LocacaoService.listar(),
          VeiculoService.listar(true),
        ]);
        if (ativo) {
          setLocacoes(listaLocacoes);
          setDisponiveis(listaVeiculos);
        }
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
  }, [versao]);

  function handleResultado(resultado: Feedback) {
    setFeedback(resultado);
    if (resultado.tipo === "sucesso") {
      setVersao((atual) => atual + 1);
    }
  }

  async function handleFinalizar(id: number) {
    setFinalizandoId(id);
    try {
      await LocacaoService.finalizar(id);
      handleResultado({
        tipo: "sucesso",
        texto: "Locação finalizada. O veículo está disponível novamente.",
      });
    } catch (erro) {
      setFeedback({ tipo: "erro", texto: extrairMensagem(erro) });
    } finally {
      setFinalizandoId(null);
    }
  }

  return (
    <div className="duas-colunas">
      <LocacaoForm veiculos={disponiveis} onResultado={handleResultado} />
      <section className="cartao">
        <h2>Minhas locações</h2>
        <Mensagem feedback={feedback} />
        <LocacaoLista
          locacoes={locacoes}
          carregando={carregando}
          finalizandoId={finalizandoId}
          onFinalizar={handleFinalizar}
        />
      </section>
    </div>
  );
}

export default Locacoes;
