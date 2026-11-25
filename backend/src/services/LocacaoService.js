const prisma = require("../databases/prisma");
const {
  ValidacaoError,
  NaoAutenticadoError,
  AcessoNegadoError,
  NaoEncontradoError,
  ConflitoError
} = require("../errors");
const { inteiroPositivo, dataValida } = require("../utils/validadores");

const MILISSEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000;

class LocacaoService {
  calcularDiarias(dataInicio, dataPrevistaDevolucao) {
    const duracao = dataPrevistaDevolucao.getTime() - dataInicio.getTime();
    return Math.ceil(duracao / MILISSEGUNDOS_POR_DIA);
  }

  async registrar(usuarioId, { veiculoId, dataInicio, dataPrevistaDevolucao } = {}) {
    const idVeiculo = inteiroPositivo(veiculoId, "veiculoId");
    const inicio = dataValida(dataInicio, "dataInicio");
    const previsao = dataValida(dataPrevistaDevolucao, "dataPrevistaDevolucao");

    if (previsao.getTime() <= inicio.getTime()) {
      throw new ValidacaoError("A data prevista de devolução deve ser posterior à data de início");
    }

    return prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.findUnique({
        where: { id: usuarioId },
        select: { id: true }
      });

      if (!usuario) {
        throw new NaoAutenticadoError("Usuário do token não encontrado");
      }

      const veiculo = await tx.veiculo.findUnique({
        where: { id: idVeiculo }
      });

      if (!veiculo) {
        throw new NaoEncontradoError("Veículo não encontrado");
      }

      if (!veiculo.disponivel) {
        throw new ConflitoError("Veículo indisponível para locação");
      }

      const diarias = this.calcularDiarias(inicio, previsao);
      const valorTotal = veiculo.valorDiaria.mul(diarias);

      const reserva = await tx.veiculo.updateMany({
        where: { id: idVeiculo, disponivel: true },
        data: { disponivel: false }
      });

      if (reserva.count === 0) {
        throw new ConflitoError("Veículo indisponível para locação");
      }

      return tx.locacao.create({
        data: {
          usuarioId,
          veiculoId: idVeiculo,
          dataInicio: inicio,
          dataPrevistaDevolucao: previsao,
          valorTotal
        },
        include: { veiculo: true }
      });
    });
  }

  async listarDoUsuario(usuarioId) {
    return prisma.locacao.findMany({
      where: { usuarioId },
      include: { veiculo: true },
      orderBy: [{ dataInicio: "desc" }, { id: "desc" }]
    });
  }

  async buscarDoUsuario(usuarioId, id) {
    const idLocacao = inteiroPositivo(id, "id");

    const locacao = await prisma.locacao.findUnique({
      where: { id: idLocacao },
      include: { veiculo: true }
    });

    if (!locacao) {
      throw new NaoEncontradoError("Locação não encontrada");
    }

    if (locacao.usuarioId !== usuarioId) {
      throw new AcessoNegadoError("Você não tem permissão para acessar esta locação");
    }

    return locacao;
  }

  async finalizar(usuarioId, id) {
    const idLocacao = inteiroPositivo(id, "id");

    return prisma.$transaction(async (tx) => {
      const locacao = await tx.locacao.findUnique({
        where: { id: idLocacao }
      });

      if (!locacao) {
        throw new NaoEncontradoError("Locação não encontrada");
      }

      if (locacao.usuarioId !== usuarioId) {
        throw new AcessoNegadoError("Você não tem permissão para finalizar esta locação");
      }

      const encerramento = await tx.locacao.updateMany({
        where: { id: idLocacao, status: "ATIVA" },
        data: { status: "FINALIZADA", dataDevolucao: new Date() }
      });

      if (encerramento.count === 0) {
        throw new ConflitoError("Esta locação já foi finalizada");
      }

      await tx.veiculo.update({
        where: { id: locacao.veiculoId },
        data: { disponivel: true }
      });

      return tx.locacao.findUnique({
        where: { id: idLocacao },
        include: { veiculo: true }
      });
    });
  }
}

module.exports = new LocacaoService();
