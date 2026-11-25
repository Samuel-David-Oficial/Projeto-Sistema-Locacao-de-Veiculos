const prisma = require("../databases/prisma");
const { ValidacaoError, ConflitoError } = require("../errors");
const {
  textoObrigatorio,
  anoValido,
  placaValida,
  valorMonetarioPositivo
} = require("../utils/validadores");

class VeiculoService {
  async cadastrar({ marca, modelo, placa, ano, valorDiaria } = {}) {
    const dados = {
      marca: textoObrigatorio(marca, "marca"),
      modelo: textoObrigatorio(modelo, "modelo"),
      placa: placaValida(placa),
      ano: anoValido(ano),
      valorDiaria: valorMonetarioPositivo(valorDiaria, "valorDiaria")
    };

    const existente = await prisma.veiculo.findUnique({
      where: { placa: dados.placa }
    });

    if (existente) {
      throw new ConflitoError("Já existe um veículo cadastrado com essa placa");
    }

    return prisma.veiculo.create({ data: dados });
  }

  async listar({ disponivel } = {}) {
    const where = {};

    if (disponivel === "true") {
      where.disponivel = true;
    } else if (disponivel === "false") {
      where.disponivel = false;
    } else if (disponivel !== undefined) {
      throw new ValidacaoError("O filtro disponivel aceita apenas true ou false");
    }

    return prisma.veiculo.findMany({
      where,
      orderBy: [{ marca: "asc" }, { modelo: "asc" }]
    });
  }
}

module.exports = new VeiculoService();
