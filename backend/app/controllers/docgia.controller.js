const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.Ten) {
    return next(new ApiError(400, "Tên không được để trống"));
  }
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm độc giả"));
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
    return next(new ApiError(500, "Lỗi khi lấy danh sách độc giả"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy độc giả id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được rỗng"));
  }
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send({ message: "Cập nhật thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật độc giả id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send({ message: "Xoá thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xoá độc giả id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const deletedCount = await docGiaService.deleteAll();
    return res.send({ message: `Da xoa ${deletedCount} doc gia` });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xoá tất cả độc giả"));
  }
};
