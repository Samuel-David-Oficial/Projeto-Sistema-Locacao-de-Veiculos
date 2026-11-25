const bcrypt = require("bcrypt");
const prisma = require("../databases/prisma");
const { ConflitoError } = require("../errors");
const { textoObrigatorio, emailValido, senhaValida } = require("../utils/validadores");

class UsuarioService {
  async cadastrar({ nome, email, senha } = {}) {
    const nomeLimpo = textoObrigatorio(nome, "nome");
    const emailLimpo = emailValido(email);
    const senhaLimpa = senhaValida(senha);

    const existente = await prisma.usuario.findUnique({
      where: { email: emailLimpo }
    });

    if (existente) {
      throw new ConflitoError("E-mail já cadastrado");
    }

    const hash = await bcrypt.hash(senhaLimpa, 10);

    return prisma.usuario.create({
      data: { nome: nomeLimpo, email: emailLimpo, senha: hash },
      select: { id: true, nome: true, email: true, criadoEm: true }
    });
  }
}

module.exports = new UsuarioService();
