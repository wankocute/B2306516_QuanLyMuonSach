const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const nhaXuatBanRouter = require("./app/routes/nhaxuatban.route");
const sachRouter = require("./app/routes/sach.route");
const docGiaRouter = require("./app/routes/docgia.route");
const nhanVienRouter = require("./app/routes/nhanvien.route");
const theoDoiRouter = require("./app/routes/theodoimuonsach.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/nhaxuatban", nhaXuatBanRouter);
app.use("/api/sach", sachRouter);
app.use("/api/docgia", docGiaRouter);
app.use("/api/nhanvien", nhanVienRouter);
app.use("/api/theodoimuonsach", theoDoiRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Quan Ly Muon Sach API." });
});

app.use((req, res, next) => {
  next(new ApiError(404, "Không tìm thấy tài nguyên"));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
