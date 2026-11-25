import { Link, NavLink, Outlet } from "react-router";
import { obterUsuarioLogado } from "../utils/jwt";

function Layout() {
  const usuario = obterUsuarioLogado();

  return (
    <>
      <header className="topo">
        <h1>Locadora</h1>
        <nav>
          <NavLink to="/veiculos">Veículos</NavLink>
          <NavLink to="/locacoes">Locações</NavLink>
        </nav>
        <div className="usuario">
          <span>{usuario?.nome}</span>
          <Link to="/logout">Sair</Link>
        </div>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
