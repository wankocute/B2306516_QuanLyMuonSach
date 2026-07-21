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
      return { error: "Khong tim thay doc gia" };
    }

    const sach = await this.Sach.findOne({ MaSach: MaSach });
    if (!sach) {
      return { error: "Khong tim thay sach" };
    }

    if (sach.SoQuyen <= 0) {
      return { error: "Sach da het, khong the muon" };
    }

    const daMuon = await this.daMuonCuonNay(MaDocGia, MaSach);
    if (daMuon) {
      return { error: "Doc gia dang muon cuon nay, chua tra" };
    }

    const soDangMuon = await this.countDangMuon(MaDocGia);
    if (soDangMuon >= GIOI_HAN_MUON) {
      return { error: `Doc gia da muon toi da ${GIOI_HAN_MUON} cuon` };
    }

    const phieu = {
      MaDocGia: MaDocGia,
      MaSach: MaSach,
      NgayMuon: new Date(),
      NgayTra: null,
      NgayHenTra: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      MSNV_Lap: payload.MSNV_Lap || null,
    };

    const result = await this.TheoDoi.insertOne(phieu);
    await this.Sach.updateOne({ MaSach: MaSach }, { $inc: { SoQuyen: -1 } });

    return { data: { _id: result.insertedId, ...phieu } };
  }

  async traSach(id) {
    const phieu = await this.findById(id);
    if (!phieu) {
      return { error: "Khong tim thay phieu muon" };
    }
    if (phieu.NgayTra) {
      return { error: "Phieu nay da tra sach roi" };
    }

    await this.TheoDoi.updateOne(
      { _id: phieu._id },
      { $set: { NgayTra: new Date() } }
    );
    await this.Sach.updateOne(
      { MaSach: phieu.MaSach },
      { $inc: { SoQuyen: 1 } }
    );

    return { data: { message: "Tra sach thanh cong" } };
  }

  async delete(id) {
    return await this.TheoDoi.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
}

module.exports = TheoDoiMuonSachService;
