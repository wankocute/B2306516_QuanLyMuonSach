const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.muonSach = async (req, res, next) => {
  if (!req.body?.MaDocGia || !req.body?.MaSach) {
    return next(new ApiError(400, "Thiếu mã độc giả hoặc mã sách"));
  }
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const result = await service.muonSach({
      MaDocGia: req.body.MaDocGia,
      MaSach: req.body.MaSach,
      NgayHenTra: req.body.NgayHenTra,
      MSNV_Lap: req.nhanVien?.MSNV,
    });
    if (result.error) {
      return next(new ApiError(400, result.error));
    }
    return res.send(result.data);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lập phiếu mượn"));
  }
};

exports.traSach = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const result = await service.traSach(req.params.id);
    if (result.error) {
      return next(new ApiError(400, result.error));
    }
    return res.send(result.data);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi trả sách"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const { trangThai, MaDocGia } = req.query;

    const filter = {};
    if (MaDocGia) {
      filter.MaDocGia = MaDocGia;
    }
    if (trangThai === "dangmuon") {
      filter.NgayTra = null;
    } else if (trangThai === "datra") {
      filter.NgayTra = { $ne: null };
    } else if (trangThai === "quahan") {
      filter.NgayTra = null;
      filter.NgayHenTra = { $lt: new Date() };
    }

    const documents = await service.find(filter);
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách phiếu mượn"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const document = await service.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy phiếu mượn id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const document = await service.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send({ message: "Xoá phiếu mượn thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xoá phiếu mượn id=${req.params.id}`));
  }
};
