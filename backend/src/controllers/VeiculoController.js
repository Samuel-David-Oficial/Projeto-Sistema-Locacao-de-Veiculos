const veiculoService = require("../services/VeiculoService");

class VeiculoController {
  async cadastrar(request, response, next) {
    try {
      const veiculo = await veiculoService.cadastrar(request.body);
      return response.status(201).json(veiculo);
    } catch (err) {
      return next(err);
    }
  }

  async listar(request, response, next) {
    try {
      const veiculos = await veiculoService.listar(request.query);
      return response.status(200).json(veiculos);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new VeiculoController();
