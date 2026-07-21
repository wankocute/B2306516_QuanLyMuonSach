const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const config = require("../config");

exports.login = async (req, res, next) => {
  const { MSNV, Password } = req.body;
  if (!MSNV || !Password) {
    return next(new ApiError(400, "Thieu MSNV hoac Password"));
  }
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const nhanVien = await nhanVienService.findByMSNV(MSNV);
    if (!nhanVien) {
      return next(new ApiError(401, "MSNV hoac mat khau khong dung"));
    }

    const isMatch = await bcrypt.compare(Password, nhanVien.Password);
    if (!isMatch) {
      return next(new ApiError(401, "MSNV hoac mat khau khong dung"));
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
    return next(new ApiError(500, "Loi khi dang nhap"));
  }
};

exports.getMe = async (req, res) => {
  return res.send(req.nhanVien);
};

exports.create = async (req, res, next) => {
  if (!req.body?.MSNV || !req.body?.Password) {
    return next(new ApiError(400, "MSNV va Password khong duoc de trong"));
  }
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const existed = await nhanVienService.findByMSNV(req.body.MSNV);
    if (existed) {
      return next(new ApiError(400, "MSNV da ton tai"));
    }
    const document = await nhanVienService.create(req.body);
    return res.send({ message: "Them nhan vien thanh cong" });
  } catch (error) {
    return next(new ApiError(500, "Loi khi them nhan vien"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const documents = await nhanVienService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Loi khi lay danh sach nhan vien"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Khong tim thay nhan vien"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Loi khi lay nhan vien id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Du lieu cap nhat khong duoc rong"));
  }
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Khong tim thay nhan vien"));
    }
    return res.send({ message: "Cap nhat thanh cong" });
  } catch (error) {
    return next(
      new ApiError(500, `Loi khi cap nhat nhan vien id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Khong tim thay nhan vien"));
    }
    return res.send({ message: "Xoa thanh cong" });
  } catch (error) {
    return next(new ApiError(500, `Loi khi xoa nhan vien id=${req.params.id}`));
  }
};
