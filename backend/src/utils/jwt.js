const jwt = require("jsonwebtoken");

function gerarToken({ id, nome, email }) {
  return jwt.sign(
    { nome, email },
    process.env.JWT_SECRET,
    {
      subject: String(id),
      expiresIn: "1h",
      algorithm: "HS256"
    }
  );
}

function validarToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET,
    { algorithms: ["HS256"] }
  );
}

module.exports = { gerarToken, validarToken };
