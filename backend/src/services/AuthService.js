const bcrypt = require("bcrypt");
const prisma = require("../databases/prisma");
const { ValidacaoError, CredenciaisInvalidasError } = require("../errors");
const { gerarToken } = require("../utils/jwt");

class AuthService {
  async login({ email, senha } = {}) {
    if (typeof email !== "string" || typeof senha !== "string" || email.trim() === "" || senha === "") {
      throw new ValidacaoError("Informe e-mail e senha");
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!usuario) {
      throw new CredenciaisInvalidasError();
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);

    if (!senhaConfere) {
      throw new CredenciaisInvalidasError();
    }

    return {
      token: gerarToken(usuario),
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    };
  }
}

module.exports = new AuthService();
