import { Link } from "react-router";

function NotFound() {
  return (
    <div className="pagina-centralizada">
      <div className="cartao">
        <h2>Página não encontrada</h2>
        <p>
          <Link to="/">Voltar ao início</Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
