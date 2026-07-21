const express = require("express");
const docGia = require("../controllers/docgia.controller");

const router = express.Router();

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
