const locacaoService = require("../services/LocacaoService");

class LocacaoController {
  async registrar(request, response, next) {
    try {
      const locacao = await locacaoService.registrar(request.user.id, request.body);
      return response.status(201).json(locacao);
    } catch (err) {
      return next(err);
    }
  }

  async listar(request, response, next) {
    try {
      const locacoes = await locacaoService.listarDoUsuario(request.user.id);
      return response.status(200).json(locacoes);
    } catch (err) {
      return next(err);
    }
  }

  async buscar(request, response, next) {
    try {
      const locacao = await locacaoService.buscarDoUsuario(request.user.id, request.params.id);
      return response.status(200).json(locacao);
    } catch (err) {
      return next(err);
    }
  }

  async finalizar(request, response, next) {
    try {
      const locacao = await locacaoService.finalizar(request.user.id, request.params.id);
      return response.status(200).json(locacao);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new LocacaoController();
