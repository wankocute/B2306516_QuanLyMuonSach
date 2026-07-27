const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../api-error");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Chưa đăng nhập"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.nhanVien = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, "Token không hợp lệ hoặc đã hết hạn"));
  }
};

exports.isQuanLy = (req, res, next) => {
  if (req.nhanVien?.ChucVu !== "Quản lý") {
    return next(new ApiError(403, "Chỉ Quản lý mới có quyền này"));
  }
  next();
};
