const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const config = require("../config");

exports.login = async (req, res, next) => {
  const { MSNV, Password } = req.body;
  if (!MSNV || !Password) {
    return next(new ApiError(400, "Thiếu mã số nhân viên hoặc mật khẩu"));
  }
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const nhanVien = await nhanVienService.findByMSNV(MSNV);
    if (!nhanVien) {
      return next(new ApiError(401, "Mã số nhân viên hoặc mật khẩu không đúng"));
    }

    const isMatch = await bcrypt.compare(Password, nhanVien.Password);
    if (!isMatch) {
      return next(new ApiError(401, "Mã số nhân viên hoặc mật khẩu không đúng"));
    }

    const token = jwt.sign(
      {
        _id: nhanVien._id,
        MSNV: nhanVien.MSNV,
        HoTenNV: nhanVien.HoTenNV,
        ChucVu: nhanVien.ChucVu,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return res.send({
      token: token,
      nhanVien: {
        _id: nhanVien._id,
        MSNV: nhanVien.MSNV,
        HoTenNV: nhanVien.HoTenNV,
        ChucVu: nhanVien.ChucVu,
      },
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};

exports.getMe = async (req, res) => {
  return res.send(req.nhanVien);
};

exports.create = async (req, res, next) => {
  if (!req.body?.MSNV || !req.body?.Password) {
    return next(new ApiError(400, "Mã số nhân viên và mật khẩu không được để trống"));
  }
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const existed = await nhanVienService.findByMSNV(req.body.MSNV);
    if (existed) {
      return next(new ApiError(400, "Mã số nhân viên đã tồn tại"));
    }
    const document = await nhanVienService.create(req.body);
    return res.send({ message: "Thêm nhân viên thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm nhân viên"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const documents = await nhanVienService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách nhân viên"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy nhân viên id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được rỗng"));
  }
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send({ message: "Cập nhật thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật nhân viên id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send({ message: "Xoá thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xoá nhân viên id=${req.params.id}`));
  }
};
