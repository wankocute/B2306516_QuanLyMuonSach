const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.MaSach) {
    return next(new ApiError(400, "Mã sách không được để trống"));
  }
  if (!req.body?.TenSach) {
    return next(new ApiError(400, "Tên sách không được để trống"));
  }
  try {
    const sachService = new SachService(MongoDB.client);
    const daCo = await sachService.find({ MaSach: req.body.MaSach });
    if (daCo.length > 0) {
      return next(new ApiError(400, "Mã sách đã tồn tại"));
    }
    const document = await sachService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm sách"));
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
    return next(new ApiError(500, "Lỗi khi lấy danh sách sách"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy sách id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được rỗng"));
  }
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Cập nhật thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi cập nhật sách id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Xoá thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xoá sách id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const deletedCount = await sachService.deleteAll();
    return res.send({ message: `Đã xoá ${deletedCount} sách` });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xoá tất cả sách"));
  }
};
