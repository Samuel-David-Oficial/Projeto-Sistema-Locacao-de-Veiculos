import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import LocacaoService from "../services/LocacaoService";
import type { Feedback } from "../types/Feedback";
import type { Veiculo } from "../types/Veiculo";
import { extrairMensagem } from "../utils/erros";
import { formatarMoeda, paraInputLocal } from "../utils/formatadores";

interface LocacaoFormProps {
  veiculos: Veiculo[];
  onResultado: (feedback: Feedback) => void;
}

function formularioInicial() {
  return {
    veiculoId: "",
    dataInicio: paraInputLocal(new Date()),
    dataPrevistaDevolucao: paraInputLocal(new Date(Date.now() + 24 * 60 * 60 * 1000)),
  };
}

function LocacaoForm({ veiculos, onResultado }: LocacaoFormProps) {
  const [form, setForm] = useState(formularioInicial);
  const [enviando, setEnviando] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    try {
      const locacao = await LocacaoService.registrar({
        veiculoId: Number(form.veiculoId),
        dataInicio: new Date(form.dataInicio).toISOString(),
        dataPrevistaDevolucao: new Date(form.dataPrevistaDevolucao).toISOString(),
      });
      setForm(formularioInicial());
      onResultado({
        tipo: "sucesso",
        texto: `Locação registrada. Valor total: ${formatarMoeda(locacao.valorTotal)}.`,
      });
    } catch (erro) {
      onResultado({ tipo: "erro", texto: extrairMensagem(erro) });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cartao formulario" onSubmit={handleSubmit}>
      <h2>Nova locação</h2>
      <label>
        Veículo disponível
        <select name="veiculoId" value={form.veiculoId} onChange={handleChange} required>
          <option value="">Selecione um veículo</option>
          {veiculos.map((veiculo) => (
            <option key={veiculo.id} value={veiculo.id}>
              {veiculo.marca} {veiculo.modelo} - {veiculo.placa} ({formatarMoeda(veiculo.valorDiaria)}/dia)
            </option>
          ))}
        </select>
      </label>
      <label>
        Data de início
        <input
          name="dataInicio"
          type="datetime-local"
          value={form.dataInicio}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Data prevista de devolução
        <input
          name="dataPrevistaDevolucao"
          type="datetime-local"
          value={form.dataPrevistaDevolucao}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit" disabled={enviando || veiculos.length === 0}>
        {enviando ? "Registrando..." : "Registrar locação"}
      </button>
      {veiculos.length === 0 && <p className="aviso">Não há veículos disponíveis no momento.</p>}
    </form>
  );
}

export default LocacaoForm;
