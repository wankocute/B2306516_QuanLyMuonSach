const express = require("express");
const sach = require("../controllers/sach.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(verifyToken);

router.route("/").get(sach.findAll).post(sach.create).delete(sach.deleteAll);

router
  .route("/:id")
  .get(sach.findOne)
  .put(sach.update)
  .delete(sach.delete);

module.exports = router;