require("dotenv/config");
const bcrypt = require("bcrypt");
const prisma = require("../src/databases/prisma");

const usuarios = [
  { nome: "Ana Souza", email: "ana@email.com" },
  { nome: "Bruno Lima", email: "bruno@email.com" }
];

const veiculos = [
  { marca: "Fiat", modelo: "Mobi", placa: "ABC1D23", ano: 2023, valorDiaria: "120.00" },
  { marca: "Chevrolet", modelo: "Onix", placa: "BRA2E19", ano: 2024, valorDiaria: "150.00" },
  { marca: "Volkswagen", modelo: "Polo", placa: "QWE4R56", ano: 2022, valorDiaria: "170.00" },
  { marca: "Toyota", modelo: "Corolla", placa: "KLM7N89", ano: 2024, valorDiaria: "260.00" },
  { marca: "Hyundai", modelo: "HB20", placa: "JHG3F45", ano: 2023, valorDiaria: "140.00" },
  { marca: "Jeep", modelo: "Renegade", placa: "PLO9K87", ano: 2023, valorDiaria: "230.00" }
];

async function main() {
  const senha = await bcrypt.hash("123456", 10);

  for (const usuario of usuarios) {
    await prisma.usuario.upsert({
      where: { email: usuario.email },
      update: {},
      create: { ...usuario, senha }
    });
  }

  for (const veiculo of veiculos) {
    await prisma.veiculo.upsert({
      where: { placa: veiculo.placa },
      update: {},
      create: veiculo
    });
  }

  const totalLocacoes = await prisma.locacao.count();

  if (totalLocacoes === 0) {
    const ana = await prisma.usuario.findUnique({ where: { email: "ana@email.com" } });
    const mobi = await prisma.veiculo.findUnique({ where: { placa: "ABC1D23" } });

    await prisma.locacao.create({
      data: {
        usuarioId: ana.id,
        veiculoId: mobi.id,
        dataInicio: new Date("2026-10-01T10:00:00.000Z"),
        dataPrevistaDevolucao: new Date("2026-10-04T10:00:00.000Z"),
        dataDevolucao: new Date("2026-10-04T09:30:00.000Z"),
        valorTotal: "360.00",
        status: "FINALIZADA"
      }
    });
  }

  console.log("Seed concluído");
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
