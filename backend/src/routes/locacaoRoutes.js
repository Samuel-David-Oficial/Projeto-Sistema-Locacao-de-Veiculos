const { Router } = require("express");
const locacaoController = require("../controllers/LocacaoController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

router.use(authMiddleware);

router.post("/", locacaoController.registrar);
router.get("/", locacaoController.listar);
router.get("/:id", locacaoController.buscar);
router.patch("/:id/finalizar", locacaoController.finalizar);

module.exports = router;
