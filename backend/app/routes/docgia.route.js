const express = require("express");
const docGia = require("../controllers/docgia.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(verifyToken);

router
  .route("/")
  .get(docGia.findAll)
  .post(docGia.create)
  .delete(docGia.deleteAll);

router
  .route("/:id")
  .get(docGia.findOne)
  .put(docGia.update)
  .delete(docGia.delete);

module.exports = router;