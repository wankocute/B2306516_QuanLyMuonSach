const { ObjectId } = require("mongodb");

const GIOI_HAN_MUON = 3;

class TheoDoiMuonSachService {
  constructor(client) {
    this.TheoDoi = client.db().collection("theodoimuonsach");
    this.Sach = client.db().collection("sach");
    this.DocGia = client.db().collection("docgia");
  }

  async findById(id) {
    return await this.TheoDoi.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async find(filter) {
    const cursor = await this.TheoDoi.find(filter).sort({ NgayMuon: -1 });
    return await cursor.toArray();
  }

  // Đếm số sách độc giả đang mượn (chưa trả)
  async countDangMuon(maDocGia) {
    return await this.TheoDoi.countDocuments({
      MaDocGia: maDocGia,
      NgayTra: null,
    });
  }

  async daMuonCuonNay(maDocGia, maSach) {
    return await this.TheoDoi.findOne({
      MaDocGia: maDocGia,
      MaSach: maSach,
      NgayTra: null,
    });
  }

  async muonSach(payload) {
    const { MaDocGia, MaSach } = payload;

    const docGia = await this.DocGia.findOne({ MaDocGia: MaDocGia });
    if (!docGia) {
      return { error: "Không tìm thấy độc giả" };
    }

    const sach = await this.Sach.findOne({ MaSach: MaSach });
    if (!sach) {
      return { error: "Không tìm thấy sách" };
    }

    if (sach.SoQuyen <= 0) {
      return { error: "Sách đã hết, không thể mượn" };
    }

    const daMuon = await this.daMuonCuonNay(MaDocGia, MaSach);
    if (daMuon) {
      return { error: "Độc giả đang mượn cuốn này, chưa trả" };
    }

    const soDangMuon = await this.countDangMuon(MaDocGia);
    if (soDangMuon >= GIOI_HAN_MUON) {
      return { error: `Độc giả đã mượn tối đa ${GIOI_HAN_MUON} cuốn` };
    }

    const ngayMuon = new Date();
    let ngayHenTra;
    if (payload.NgayHenTra) {
      ngayHenTra = new Date(payload.NgayHenTra);
      if (isNaN(ngayHenTra.getTime())) {
        return { error: "Ngày hẹn trả không hợp lệ" };
      }
      ngayHenTra.setHours(23, 59, 59, 999);
    } else {
      ngayHenTra = new Date(ngayMuon.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    if (ngayHenTra < ngayMuon) {
      return { error: "Ngày hẹn trả phải sau ngày mượn" };
    }

    const phieu = {
      MaDocGia: MaDocGia,
      MaSach: MaSach,
      NgayMuon: ngayMuon,
      NgayTra: null,
      NgayHenTra: ngayHenTra,
      MSNV_Lap: payload.MSNV_Lap || null,
    };

    const result = await this.TheoDoi.insertOne(phieu);
    await this.Sach.updateOne({ MaSach: MaSach }, { $inc: { SoQuyen: -1 } });

    return { data: { _id: result.insertedId, ...phieu } };
  }

  async traSach(id) {
    const phieu = await this.findById(id);
    if (!phieu) {
      return { error: "Không tìm thấy phiếu mượn" };
    }
    if (phieu.NgayTra) {
      return { error: "Phiếu này đã trả sách rồi" };
    }

    await this.TheoDoi.updateOne(
      { _id: phieu._id },
      { $set: { NgayTra: new Date() } }
    );
    await this.Sach.updateOne(
      { MaSach: phieu.MaSach },
      { $inc: { SoQuyen: 1 } }
    );

    return { data: { message: "Trả sách thành công" } };
  }

  async delete(id) {
    return await this.TheoDoi.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
}

module.exports = TheoDoiMuonSachService;
