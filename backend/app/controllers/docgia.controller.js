const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.Ten) {
    return next(new ApiError(400, "Ten khong duoc de trong"));
  }
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Loi khi them doc gia"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const { keyword } = req.query;
    if (keyword) {
      documents = await docGiaService.findByKeyword(keyword);
    } else {
      documents = await docGiaService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "Loi khi lay danh sach doc gia"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Khong tim thay doc gia"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Loi khi lay doc gia id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Du lieu cap nhat khong duoc rong"));
  }
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Khong tim thay doc gia"));
    }
    return res.send({ message: "Cap nhat thanh cong" });
  } catch (error) {
    return next(
      new ApiError(500, `Loi khi cap nhat doc gia id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Khong tim thay doc gia"));
    }
    return res.send({ message: "Xoa thanh cong" });
  } catch (error) {
    return next(new ApiError(500, `Loi khi xoa doc gia id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const deletedCount = await docGiaService.deleteAll();
    return res.send({ message: `Da xoa ${deletedCount} doc gia` });
  } catch (error) {
    return next(new ApiError(500, "Loi khi xoa tat ca doc gia"));
  }
};
