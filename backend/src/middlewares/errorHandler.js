function rotaNaoEncontrada(request, response) {
  return response.status(404).json({ error: "Rota não encontrada" });
}

function tratarErros(err, request, response, next) {
  if (err.type === "entity.parse.failed") {
    return response.status(400).json({ error: "JSON inválido no corpo da requisição" });
  }

  if (err.code === "P2002") {
    return response.status(409).json({ error: "Já existe um registro com esse valor único" });
  }

  if (err.statusCode) {
    return response.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);
  return response.status(500).json({ error: "Erro interno do servidor" });
}

module.exports = { rotaNaoEncontrada, tratarErros };
