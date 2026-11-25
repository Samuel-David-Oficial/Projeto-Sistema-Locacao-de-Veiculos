import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import VeiculoService from "../services/VeiculoService";
import type { Feedback } from "../types/Feedback";
import { extrairMensagem } from "../utils/erros";

interface VeiculoFormProps {
  onResultado: (feedback: Feedback) => void;
}

const formularioInicial = {
  marca: "",
  modelo: "",
  placa: "",
  ano: "",
  valorDiaria: "",
};

function VeiculoForm({ onResultado }: VeiculoFormProps) {
  const [form, setForm] = useState(formularioInicial);
  const [enviando, setEnviando] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    try {
      const veiculo = await VeiculoService.cadastrar({
        marca: form.marca,
        modelo: form.modelo,
        placa: form.placa,
        ano: Number(form.ano),
        valorDiaria: Number(form.valorDiaria),
      });
      setForm(formularioInicial);
      onResultado({
        tipo: "sucesso",
        texto: `Veículo ${veiculo.marca} ${veiculo.modelo} (${veiculo.placa}) cadastrado com sucesso.`,
      });
    } catch (erro) {
      onResultado({ tipo: "erro", texto: extrairMensagem(erro) });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cartao formulario" onSubmit={handleSubmit}>
      <h2>Cadastrar veículo</h2>
      <label>
        Marca
        <input name="marca" value={form.marca} onChange={handleChange} required />
      </label>
      <label>
        Modelo
        <input name="modelo" value={form.modelo} onChange={handleChange} required />
      </label>
      <label>
        Placa
        <input
          name="placa"
          value={form.placa}
          onChange={handleChange}
          placeholder="ABC1D23"
          maxLength={8}
          required
        />
      </label>
      <label>
        Ano
        <input
          name="ano"
          type="number"
          min="1900"
          value={form.ano}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Valor da diária (R$)
        <input
          name="valorDiaria"
          type="number"
          min="0.01"
          step="0.01"
          value={form.valorDiaria}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit" disabled={enviando}>
        {enviando ? "Salvando..." : "Cadastrar"}
      </button>
    </form>
  );
}

export default VeiculoForm;
