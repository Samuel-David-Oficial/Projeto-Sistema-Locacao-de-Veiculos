import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import Mensagem from "../components/Mensagem";
import AuthService from "../services/AuthService";
import type { CadastroForm } from "../types/Auth";
import type { Feedback } from "../types/Feedback";
import { extrairMensagem } from "../utils/erros";

function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CadastroForm>({ nome: "", email: "", senha: "" });
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    try {
      await AuthService.cadastrar(form);
      navigate("/login", { replace: true, state: { cadastrado: true } });
    } catch (erro) {
      setFeedback({ tipo: "erro", texto: extrairMensagem(erro) });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-centralizada">
      <form className="cartao formulario" onSubmit={handleSubmit}>
        <h2>Criar conta</h2>
        <Mensagem feedback={feedback} />
        <label>
          Nome
          <input name="nome" value={form.nome} onChange={handleChange} required />
        </label>
        <label>
          E-mail
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Senha (mínimo 6 caracteres)
          <input
            name="senha"
            type="password"
            minLength={6}
            value={form.senha}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? "Cadastrando..." : "Cadastrar"}
        </button>
        <p className="rodape-form">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;
