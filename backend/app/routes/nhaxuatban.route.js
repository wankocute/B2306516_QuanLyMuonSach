const express = require("express");
const nhaXuatBan = require("../controllers/nhaxuatban.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(verifyToken);

router
  .route("/")
  .get(nhaXuatBan.findAll)
  .post(nhaXuatBan.create)
  .delete(nhaXuatBan.deleteAll);

router
  .route("/:id")
  .get(nhaXuatBan.findOne)
  .put(nhaXuatBan.update)
  .delete(nhaXuatBan.delete);

module.exports = router;