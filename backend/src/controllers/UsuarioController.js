const usuarioService = require("../services/UsuarioService");

class UsuarioController {
  async cadastrar(request, response, next) {
    try {
      const usuario = await usuarioService.cadastrar(request.body);
      return response.status(201).json(usuario);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new UsuarioController();
