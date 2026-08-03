const bcrypt = require("bcryptjs");
const MongoDB = require("./app/utils/mongodb.util");
const config = require("./app/config");

const dsNXB = [
  { MaNXB: "NXB01", TenNXB: "Nhà xuất bản Trẻ", DiaChi: "161B Lý Chính Thắng, Quận 3, TP.HCM" },
  { MaNXB: "NXB02", TenNXB: "Nhà xuất bản Kim Đồng", DiaChi: "55 Quang Trung, Hai Bà Trưng, Hà Nội" },
  { MaNXB: "NXB03", TenNXB: "Nhà xuất bản Giáo dục Việt Nam", DiaChi: "81 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội" },
  { MaNXB: "NXB04", TenNXB: "Nhà xuất bản Tổng hợp TP.HCM", DiaChi: "62 Nguyễn Thị Minh Khai, Quận 1, TP.HCM" },
  { MaNXB: "NXB05", TenNXB: "Nhà xuất bản Đại học Cần Thơ", DiaChi: "Khu II, Đường 3/2, Ninh Kiều, Cần Thơ" },
];

const dsSach = [
  { MaSach: "S001", TenSach: "Đắc Nhân Tâm", TacGia: "Dale Carnegie", DonGia: 120000, SoQuyen: 8, NamXuatBan: 2019, MaNXB: "NXB01" },
  { MaSach: "S002", TenSach: "Nhà Giả Kim", TacGia: "Paulo Coelho", DonGia: 89000, SoQuyen: 6, NamXuatBan: 2020, MaNXB: "NXB01" },
  { MaSach: "S003", TenSach: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh", TacGia: "Nguyễn Nhật Ánh", DonGia: 110000, SoQuyen: 5, NamXuatBan: 2018, MaNXB: "NXB01" },
  { MaSach: "S004", TenSach: "Cho Tôi Xin Một Vé Đi Tuổi Thơ", TacGia: "Nguyễn Nhật Ánh", DonGia: 95000, SoQuyen: 4, NamXuatBan: 2017, MaNXB: "NXB01" },
  { MaSach: "S005", TenSach: "Doraemon - Tập 1", TacGia: "Fujiko F. Fujio", DonGia: 25000, SoQuyen: 10, NamXuatBan: 2021, MaNXB: "NXB02" },
  { MaSach: "S006", TenSach: "Thần Đồng Đất Việt - Tập 1", TacGia: "Lê Linh", DonGia: 22000, SoQuyen: 7, NamXuatBan: 2016, MaNXB: "NXB02" },
  { MaSach: "S007", TenSach: "Kính Vạn Hoa - Tập 1", TacGia: "Nguyễn Nhật Ánh", DonGia: 45000, SoQuyen: 3, NamXuatBan: 2019, MaNXB: "NXB02" },
  { MaSach: "S008", TenSach: "Toán Cao Cấp - Giải Tích 1", TacGia: "Nguyễn Đình Trí", DonGia: 78000, SoQuyen: 12, NamXuatBan: 2015, MaNXB: "NXB03" },
  { MaSach: "S009", TenSach: "Cấu Trúc Dữ Liệu Và Thuật Toán", TacGia: "Đỗ Xuân Lôi", DonGia: 85000, SoQuyen: 9, NamXuatBan: 2014, MaNXB: "NXB03" },
  { MaSach: "S010", TenSach: "Nhập Môn Lập Trình Python", TacGia: "Trần Văn Minh", DonGia: 92000, SoQuyen: 6, NamXuatBan: 2022, MaNXB: "NXB03" },
  { MaSach: "S011", TenSach: "Sài Gòn - Chuyện Đời Của Phố", TacGia: "Phạm Công Luận", DonGia: 135000, SoQuyen: 2, NamXuatBan: 2019, MaNXB: "NXB04" },
  { MaSach: "S012", TenSach: "Lịch Sử Việt Nam Bằng Hình", TacGia: "Nhiều tác giả", DonGia: 250000, SoQuyen: 1, NamXuatBan: 2021, MaNXB: "NXB04" },
  { MaSach: "S013", TenSach: "Lập Trình Web Với Node.js", TacGia: "Nguyễn Hữu Phát", DonGia: 145000, SoQuyen: 5, NamXuatBan: 2023, MaNXB: "NXB05" },
  { MaSach: "S014", TenSach: "Nhập Môn Cơ Sở Dữ Liệu", TacGia: "Phạm Thị Xuân Lộc", DonGia: 98000, SoQuyen: 4, NamXuatBan: 2020, MaNXB: "NXB05" },
  { MaSach: "S015", TenSach: "Trí Tuệ Nhân Tạo Căn Bản", TacGia: "Trần Cao Đệ", DonGia: 160000, SoQuyen: 0, NamXuatBan: 2024, MaNXB: "NXB05" },
];

const dsDocGia = [
  { MaDocGia: "DG01", HoLot: "Nguyễn Văn", Ten: "An", NgaySinh: "2003-05-12", Phai: "Nam", DiaChi: "12 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ", DienThoai: "0901234567" },
  { MaDocGia: "DG02", HoLot: "Trần Thị", Ten: "Bích", NgaySinh: "2004-08-30", Phai: "Nữ", DiaChi: "45 Mậu Thân, Xuân Khánh, Cần Thơ", DienThoai: "0912345678" },
  { MaDocGia: "DG03", HoLot: "Lê Hoàng", Ten: "Cường", NgaySinh: "2002-11-02", Phai: "Nam", DiaChi: "78 Đường 3/2, Ninh Kiều, Cần Thơ", DienThoai: "0923456789" },
  { MaDocGia: "DG04", HoLot: "Phạm Ngọc", Ten: "Dung", NgaySinh: "2005-01-25", Phai: "Nữ", DiaChi: "156 Trần Hưng Đạo, Ninh Kiều, Cần Thơ", DienThoai: "0934567890" },
  { MaDocGia: "DG05", HoLot: "Võ Minh", Ten: "Đức", NgaySinh: "2001-07-19", Phai: "Nam", DiaChi: "9 Lý Tự Trọng, Ninh Kiều, Cần Thơ", DienThoai: "0945678901" },
  { MaDocGia: "DG06", HoLot: "Đặng Thu", Ten: "Hà", NgaySinh: "2003-03-08", Phai: "Nữ", DiaChi: "233 Nguyễn Trãi, Ninh Kiều, Cần Thơ", DienThoai: "0956789012" },
  { MaDocGia: "DG07", HoLot: "Huỳnh Gia", Ten: "Khang", NgaySinh: "2004-12-15", Phai: "Nam", DiaChi: "67 Hoà Bình, Ninh Kiều, Cần Thơ", DienThoai: "0967890123" },
  { MaDocGia: "DG08", HoLot: "Bùi Thanh", Ten: "Lam", NgaySinh: "2002-09-27", Phai: "Nữ", DiaChi: "88 Đề Thám, Ninh Kiều, Cần Thơ", DienThoai: "0978901234" },
];

const dsNhanVien = [
  { MSNV: "NV01", HoTenNV: "Trần Quốc Bảo", Password: "123456", ChucVu: "Quản lý", DiaChi: "Khu II, Đại học Cần Thơ", SoDienThoai: "0900000001" },
  { MSNV: "NV02", HoTenNV: "Lê Thị Hồng Nhung", Password: "123456", ChucVu: "Nhân viên", DiaChi: "34 Mậu Thân, Cần Thơ", SoDienThoai: "0900000002" },
  { MSNV: "NV03", HoTenNV: "Nguyễn Tấn Phát", Password: "123456", ChucVu: "Nhân viên", DiaChi: "120 Nguyễn Văn Cừ, Cần Thơ", SoDienThoai: "0900000003" },
  { MSNV: "NV04", HoTenNV: "Đỗ Thị Mỹ Duyên", Password: "123456", ChucVu: "Nhân viên", DiaChi: "5 Trần Văn Hoài, Cần Thơ", SoDienThoai: "0900000004" },
];

// traCachDay = null nghia la chua tra
const dsPhieu = [
  { MaDocGia: "DG01", MaSach: "S001", muonCachDay: 2, traCachDay: null, MSNV_Lap: "NV02" },
  { MaDocGia: "DG01", MaSach: "S008", muonCachDay: 1, traCachDay: null, MSNV_Lap: "NV02" },
  { MaDocGia: "DG02", MaSach: "S002", muonCachDay: 3, traCachDay: null, MSNV_Lap: "NV03" },
  { MaDocGia: "DG03", MaSach: "S005", muonCachDay: 0, traCachDay: null, MSNV_Lap: "NV01" },
  { MaDocGia: "DG04", MaSach: "S003", muonCachDay: 20, traCachDay: null, MSNV_Lap: "NV02" },
  { MaDocGia: "DG05", MaSach: "S011", muonCachDay: 15, traCachDay: null, MSNV_Lap: "NV04" },
  { MaDocGia: "DG02", MaSach: "S013", muonCachDay: 12, traCachDay: null, MSNV_Lap: "NV03" },
  { MaDocGia: "DG06", MaSach: "S004", muonCachDay: 30, traCachDay: 25, MSNV_Lap: "NV02" },
  { MaDocGia: "DG07", MaSach: "S009", muonCachDay: 25, traCachDay: 20, MSNV_Lap: "NV03" },
  { MaDocGia: "DG08", MaSach: "S010", muonCachDay: 18, traCachDay: 12, MSNV_Lap: "NV04" },
  { MaDocGia: "DG01", MaSach: "S007", muonCachDay: 40, traCachDay: 35, MSNV_Lap: "NV01" },
];

function ngayTruoc(so) {
  const d = new Date();
  d.setDate(d.getDate() - so);
  d.setHours(9, 0, 0, 0);
  return d;
}

function congNgay(ngay, so) {
  const d = new Date(ngay);
  d.setDate(d.getDate() + so);
  return d;
}

async function run() {
  const client = await MongoDB.connect(config.db.uri);
  const db = client.db();

  await db.collection("nhaxuatban").deleteMany({});
  await db.collection("sach").deleteMany({});
  await db.collection("docgia").deleteMany({});
  await db.collection("nhanvien").deleteMany({});
  await db.collection("theodoimuonsach").deleteMany({});
  console.log("Đã xoá dữ liệu cũ");

  await db.collection("nhaxuatban").insertMany(dsNXB);

  // SoQuyen trong dsSach la so luong ban dau, phai tru di nhung cuon dang cho muon
  const sach = dsSach.map((s) => ({ ...s }));
  dsPhieu.forEach((p) => {
    if (p.traCachDay === null) {
      const s = sach.find((x) => x.MaSach === p.MaSach);
      if (s) {
        s.SoQuyen = s.SoQuyen - 1;
      }
    }
  });
  await db.collection("sach").insertMany(sach);

  await db.collection("docgia").insertMany(dsDocGia);

  const nhanVien = [];
  for (const nv of dsNhanVien) {
    const matKhauHash = await bcrypt.hash(nv.Password, 10);
    nhanVien.push({ ...nv, Password: matKhauHash });
  }
  await db.collection("nhanvien").insertMany(nhanVien);

  const phieu = dsPhieu.map((p) => {
    const ngayMuon = ngayTruoc(p.muonCachDay);
    return {
      MaDocGia: p.MaDocGia,
      MaSach: p.MaSach,
      NgayMuon: ngayMuon,
      NgayHenTra: congNgay(ngayMuon, 7),
      NgayTra: p.traCachDay === null ? null : ngayTruoc(p.traCachDay),
      MSNV_Lap: p.MSNV_Lap,
    };
  });
  await db.collection("theodoimuonsach").insertMany(phieu);

  console.log("NXB:", dsNXB.length);
  console.log("Sach:", sach.length);
  console.log("Doc gia:", dsDocGia.length);
  console.log("Nhan vien:", nhanVien.length);
  console.log("Phieu muon:", phieu.length);
  console.log("Dang nhap: NV01 / 123456 (Quan ly)");
  process.exit();
}

run();
