const { ValidacaoError } = require("../errors");

function textoObrigatorio(valor, campo) {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw new ValidacaoError(`O campo ${campo} é obrigatório`);
  }
  return valor.trim();
}

function emailValido(valor) {
  const email = textoObrigatorio(valor, "email").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidacaoError("E-mail inválido");
  }
  return email;
}

function senhaValida(valor) {
  if (typeof valor !== "string" || valor.length < 6 || valor.length > 72) {
    throw new ValidacaoError("A senha deve ter entre 6 e 72 caracteres");
  }
  return valor;
}

function inteiroPositivo(valor, campo) {
  const tipoAceito = typeof valor === "number" || typeof valor === "string";
  const numero = tipoAceito ? Number(valor) : NaN;
  if (!tipoAceito || !Number.isInteger(numero) || numero <= 0) {
    throw new ValidacaoError(`O campo ${campo} deve ser um número inteiro positivo`);
  }
  return numero;
}

function anoValido(valor) {
  const ano = inteiroPositivo(valor, "ano");
  const limite = new Date().getFullYear() + 1;
  if (ano < 1900 || ano > limite) {
    throw new ValidacaoError(`O campo ano deve estar entre 1900 e ${limite}`);
  }
  return ano;
}

function placaValida(valor) {
  const placa = textoObrigatorio(valor, "placa").toUpperCase().replace(/[\s-]/g, "");
  if (!/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placa)) {
    throw new ValidacaoError("Placa inválida. Use o formato ABC1D23 ou ABC-1234");
  }
  return placa;
}

function valorMonetarioPositivo(valor, campo) {
  const numero = typeof valor === "string" ? Number(valor.replace(",", ".")) : valor;
  if (typeof numero !== "number" || !Number.isFinite(numero)) {
    throw new ValidacaoError(`O campo ${campo} deve ser um número positivo`);
  }
  const arredondado = Number(numero.toFixed(2));
  if (arredondado <= 0 || arredondado >= 100000000) {
    throw new ValidacaoError(`O campo ${campo} deve ser maior que zero e menor que 100000000`);
  }
  return arredondado.toFixed(2);
}

function dataValida(valor, campo) {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw new ValidacaoError(`O campo ${campo} é obrigatório`);
  }
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) {
    throw new ValidacaoError(`O campo ${campo} deve ser uma data válida`);
  }
  return data;
}

module.exports = {
  textoObrigatorio,
  emailValido,
  senhaValida,
  inteiroPositivo,
  anoValido,
  placaValida,
  valorMonetarioPositivo,
  dataValida
};
