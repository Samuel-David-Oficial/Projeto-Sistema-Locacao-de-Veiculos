class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

class ValidacaoError extends ApiError {
  constructor(message = "Dados inválidos") {
    super(message, 400);
  }
}

class NaoAutenticadoError extends ApiError {
  constructor(message = "Não autenticado") {
    super(message, 401);
  }
}

class CredenciaisInvalidasError extends ApiError {
  constructor(message = "E-mail ou senha inválidos") {
    super(message, 401);
  }
}

class AcessoNegadoError extends ApiError {
  constructor(message = "Acesso negado") {
    super(message, 403);
  }
}

class NaoEncontradoError extends ApiError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404);
  }
}

class ConflitoError extends ApiError {
  constructor(message = "Conflito com o estado atual do recurso") {
    super(message, 409);
  }
}

module.exports = {
  ApiError,
  ValidacaoError,
  NaoAutenticadoError,
  CredenciaisInvalidasError,
  AcessoNegadoError,
  NaoEncontradoError,
  ConflitoError
};
