const bcrypt = require("bcryptjs");
const MongoDB = require("./app/utils/mongodb.util");
const config = require("./app/config");

async function run() {
  const client = await MongoDB.connect(config.db.uri);
  const collection = client.db().collection("nhanvien");

  const password = await bcrypt.hash("123456", 10);
  await collection.findOneAndUpdate(
    { MSNV: "NV01" },
    {
      $set: {
        MSNV: "NV01",
        HoTenNV: "Nguyen Van Quan Ly",
        Password: password,
        ChucVu: "Quản lý",
        DiaChi: "Can Tho",
        SoDienThoai: "0900000000",
      },
    },
    { upsert: true }
  );

  console.log("Da tao tai khoan quan ly: NV01 / 123456");
  process.exit();
}

run();
