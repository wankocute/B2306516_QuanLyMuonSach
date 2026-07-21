const express = require("express");
const theoDoi = require("../controllers/theodoimuonsach.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(verifyToken);

router.route("/").get(theoDoi.findAll).post(theoDoi.muonSach);

router.put("/:id/tra", theoDoi.traSach);

router.route("/:id").get(theoDoi.findOne).delete(theoDoi.delete);

module.exports = router;
