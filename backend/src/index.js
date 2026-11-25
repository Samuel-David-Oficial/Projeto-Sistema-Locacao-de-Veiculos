require("dotenv/config");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const veiculoRoutes = require("./routes/veiculoRoutes");
const locacaoRoutes = require("./routes/locacaoRoutes");
const { rotaNaoEncontrada, tratarErros } = require("./middlewares/errorHandler");

if (!process.env.JWT_SECRET) {
  console.error("Defina a variável JWT_SECRET no arquivo .env");
  process.exit(1);
}

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/veiculos", veiculoRoutes);
app.use("/locacoes", locacaoRoutes);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

const porta = process.env.PORT || 3000;

app.listen(porta, () => {
  console.log(`API em http://localhost:${porta}`);
});
