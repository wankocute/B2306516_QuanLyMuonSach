const NhaXuatBanService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.TenNXB) {
    return next(new ApiError(400, "TenNXB khong duoc de trong"));
  }
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Loi khi them nha xuat ban"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const { TenNXB } = req.query;
    if (TenNXB) {
      documents = await nhaXuatBanService.findByName(TenNXB);
    } else {
      documents = await nhaXuatBanService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "Loi khi lay danh sach nha xuat ban"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Khong tim thay nha xuat ban"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Loi khi lay nha xuat ban id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Du lieu cap nhat khong duoc rong"));
  }
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Khong tim thay nha xuat ban"));
    }
    return res.send({ message: "Cap nhat thanh cong" });
  } catch (error) {
    return next(
      new ApiError(500, `Loi khi cap nhat nha xuat ban id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Khong tim thay nha xuat ban"));
    }
    return res.send({ message: "Xoa thanh cong" });
  } catch (error) {
    return next(
      new ApiError(500, `Loi khi xoa nha xuat ban id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const deletedCount = await nhaXuatBanService.deleteAll();
    return res.send({ message: `Da xoa ${deletedCount} nha xuat ban` });
  } catch (error) {
    return next(new ApiError(500, "Loi khi xoa tat ca nha xuat ban"));
  }
};
