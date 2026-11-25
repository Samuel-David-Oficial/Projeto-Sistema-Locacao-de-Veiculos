const { Router } = require("express");
const veiculoController = require("../controllers/VeiculoController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

router.use(authMiddleware);

router.post("/", veiculoController.cadastrar);
router.get("/", veiculoController.listar);

module.exports = router;
