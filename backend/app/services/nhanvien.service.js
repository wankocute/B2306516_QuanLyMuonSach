const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db().collection("nhanvien");
  }

  extractData(payload) {
    const nv = {
      MSNV: payload.MSNV,
      HoTenNV: payload.HoTenNV,
      Password: payload.Password,
      ChucVu: payload.ChucVu,
      DiaChi: payload.DiaChi,
      SoDienThoai: payload.SoDienThoai,
    };
    Object.keys(nv).forEach((key) => nv[key] === undefined && delete nv[key]);
    return nv;
  }

  async create(payload) {
    const nv = this.extractData(payload);
    if (nv.Password) {
      nv.Password = await bcrypt.hash(nv.Password, 10);
    }
    const result = await this.NhanVien.findOneAndUpdate(
      { MSNV: nv.MSNV },
      { $set: nv },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  async findByMSNV(msnv) {
    return await this.NhanVien.findOne({ MSNV: msnv });
  }

  async find(filter) {
    const cursor = await this.NhanVien.find(filter, {
      projection: { Password: 0 },
    });
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.NhanVien.findOne(
      { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
      { projection: { Password: 0 } }
    );
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractData(payload);
    if (update.Password) {
      update.Password = await bcrypt.hash(update.Password, 10);
    }
    const result = await this.NhanVien.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.NhanVien.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = NhanVienService;
