const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.TenSach) {
    return next(new ApiError(400, "TenSach khong duoc de trong"));
  }
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Loi khi them sach"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const sachService = new SachService(MongoDB.client);
    const { keyword, MaNXB } = req.query;
    if (keyword) {
      documents = await sachService.findByKeyword(keyword);
    } else if (MaNXB) {
      documents = await sachService.find({ MaNXB: MaNXB });
    } else {
      documents = await sachService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "Loi khi lay danh sach sach"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Khong tim thay sach"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Loi khi lay sach id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Du lieu cap nhat khong duoc rong"));
  }
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Khong tim thay sach"));
    }
    return res.send({ message: "Cap nhat thanh cong" });
  } catch (error) {
    return next(new ApiError(500, `Loi khi cap nhat sach id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Khong tim thay sach"));
    }
    return res.send({ message: "Xoa thanh cong" });
  } catch (error) {
    return next(new ApiError(500, `Loi khi xoa sach id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const deletedCount = await sachService.deleteAll();
    return res.send({ message: `Da xoa ${deletedCount} sach` });
  } catch (error) {
    return next(new ApiError(500, "Loi khi xoa tat ca sach"));
  }
};
