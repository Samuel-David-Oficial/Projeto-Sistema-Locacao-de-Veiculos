import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { setOnUnauthorized } from "./api/api";
import Layout from "./components/Layout";
import LoginRoute from "./components/LoginRoute";
import PrivateRoute from "./components/PrivateRoute";
import Cadastro from "./pages/Cadastro";
import Locacoes from "./pages/Locacoes";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import Veiculos from "./pages/Veiculos";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setOnUnauthorized(() => navigate("/login", { replace: true }));
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/locacoes" replace />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/logout" element={<Logout />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/locacoes" element={<Locacoes />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
