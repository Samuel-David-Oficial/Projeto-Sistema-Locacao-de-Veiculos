import { Navigate } from "react-router";
import Login from "../pages/Login";
import { isAuthenticated } from "../utils/jwt";

function LoginRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/locacoes" replace />;
  }

  return <Login />;
}

export default LoginRoute;
