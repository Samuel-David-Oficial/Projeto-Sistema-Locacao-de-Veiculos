import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Mensagem from "../components/Mensagem";
import AuthService from "../services/AuthService";
import type { LoginForm } from "../types/Auth";
import type { Feedback } from "../types/Feedback";
import { extrairMensagem } from "../utils/erros";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const destino: string = location.state?.from?.pathname ?? "/locacoes";

  const [form, setForm] = useState<LoginForm>({ email: "", senha: "" });
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(
    location.state?.cadastrado
      ? { tipo: "sucesso", texto: "Cadastro realizado com sucesso. Faça login para continuar." }
      : null,
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    try {
      const { token } = await AuthService.login(form);
      localStorage.setItem("token", token);
      navigate(destino, { replace: true });
    } catch (erro) {
      setFeedback({ tipo: "erro", texto: extrairMensagem(erro) });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-centralizada">
      <form className="cartao formulario" onSubmit={handleSubmit}>
        <h2>Entrar</h2>
        <Mensagem feedback={feedback} />
        <label>
          E-mail
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Senha
          <input name="senha" type="password" value={form.senha} onChange={handleChange} required />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
        <p className="rodape-form">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
