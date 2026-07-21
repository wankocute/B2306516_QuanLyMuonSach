const express = require("express");
const nhanVien = require("../controllers/nhanvien.controller");
const { verifyToken, isQuanLy } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", nhanVien.login);
router.get("/me", verifyToken, nhanVien.getMe);

router
  .route("/")
  .get(verifyToken, isQuanLy, nhanVien.findAll)
  .post(verifyToken, isQuanLy, nhanVien.create);

router
  .route("/:id")
  .get(verifyToken, isQuanLy, nhanVien.findOne)
  .put(verifyToken, isQuanLy, nhanVien.update)
  .delete(verifyToken, isQuanLy, nhanVien.delete);

module.exports = router;
