const NhaXuatBanService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.TenNXB) {
    return next(new ApiError(400, "Tên nhà xuất bản không được để trống"));
  }
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm nhà xuất bản"));
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
    return next(new ApiError(500, "Lỗi khi lấy danh sách nhà xuất bản"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy nhà xuất bản id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được rỗng"));
  }
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send({ message: "Cập nhật thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật nhà xuất bản id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send({ message: "Xoá thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xoá nhà xuất bản id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const deletedCount = await nhaXuatBanService.deleteAll();
    return res.send({ message: `Da xoa ${deletedCount} nha xuat ban` });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xoá tất cả nhà xuất bản"));
  }
};
