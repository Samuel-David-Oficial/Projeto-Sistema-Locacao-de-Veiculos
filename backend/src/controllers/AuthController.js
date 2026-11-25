const authService = require("../services/AuthService");

class AuthController {
  async login(request, response, next) {
    try {
      const resultado = await authService.login(request.body);
      return response.status(200).json(resultado);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AuthController();
