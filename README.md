# B2306516_QuanLyMuonSach

Bài tập lớn học phần **CT449 - Phát triển ứng dụng Web**
Trường Công nghệ Thông tin & Truyền thông - Đại học Cần Thơ

- **Đề tài:** Xây dựng website quản lý mượn sách
- **Sinh viên:** Trần Quang Bảo - MSSV: B2306516
- **Giáo viên hướng dẫn:** ThS.GVC Nguyễn Minh Trung

---

## 1. Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Backend | Node.js, Express, MongoDB (driver `mongodb` thuần) |
| Frontend | Vue 3 (Options API), Vite, Vue Router, Axios |
| Giao diện | Bootstrap 4, Font Awesome, SweetAlert2 |
| Kiểm tra dữ liệu | vee-validate + yup |
| Bảo mật | JSON Web Token, bcryptjs |

---

## 2. Yêu cầu môi trường

- Node.js phiên bản 20.19 trở lên
- MongoDB Community Server (chạy ở cổng mặc định 27017)

---

## 3. Cài đặt

Tải mã nguồn về máy:

```bash
git clone https://github.com/wankocute/B2306516_QuanLyMuonSach.git
cd B2306516_QuanLyMuonSach
```

Cài thư viện cho backend:

```bash
cd backend
npm install
```

Cài thư viện cho frontend:

```bash
cd ../frontend
npm install
```

---

## 4. Tạo dữ liệu mẫu

Đứng tại thư mục `backend`, chạy:

```bash
node seed-data.js
```

Lệnh này **xoá toàn bộ dữ liệu cũ** rồi nạp lại dữ liệu mẫu gồm 5 nhà xuất bản,
15 đầu sách, 8 độc giả, 4 nhân viên và 11 phiếu mượn đủ ba trạng thái
(đang mượn, đã trả, quá hạn).

Nếu chỉ cần tạo một tài khoản quản lý đầu tiên thì chạy:

```bash
node seed-admin.js
```

---

## 5. Chạy ứng dụng

Mở hai cửa sổ terminal.

**Terminal 1** - máy chủ API (cổng 3000), đứng tại thư mục `backend`:

```bash
npm start
```

**Terminal 2** - giao diện web (cổng 3001), đứng tại thư mục `frontend`:

```bash
npm run dev
```

Sau đó mở trình duyệt vào địa chỉ: <http://localhost:3001>

---

## 6. Tài khoản đăng nhập

| MSNV | Mật khẩu | Chức vụ |
|---|---|---|
| NV01 | 123456 | Quản lý |
| NV02 | 123456 | Nhân viên |
| NV03 | 123456 | Nhân viên |
| NV04 | 123456 | Nhân viên |

Tài khoản chức vụ **Quản lý** có thêm quyền quản lý danh sách nhân viên.

---

## 7. Cấu trúc thư mục

```
B2306516_QuanLyMuonSach/
├── backend/
│   ├── server.js                 Khởi động máy chủ, kết nối MongoDB
│   ├── app.js                    Khởi tạo Express, đăng ký route và middleware
│   ├── seed-admin.js             Tạo tài khoản quản lý đầu tiên
│   ├── seed-data.js              Nạp dữ liệu mẫu
│   └── app/
│       ├── api-error.js          Lớp ApiError
│       ├── config/               Cấu hình cổng, chuỗi kết nối, khoá JWT
│       ├── utils/                Lớp MongoDB dùng chung một kết nối
│       ├── routes/               5 tệp định tuyến
│       ├── controllers/          5 tệp controller
│       ├── services/             5 tệp service thao tác collection
│       └── middlewares/          Kiểm tra token và chức vụ
└── frontend/
    ├── vite.config.js            Cổng 3001, proxy /api sang cổng 3000
    └── src/
        ├── App.vue               Thanh điều hướng, thông tin đăng nhập
        ├── router/               Khai báo trang và kiểm tra đăng nhập
        ├── services/             Đối tượng Axios dùng chung và 5 service
        ├── views/                8 trang giao diện
        ├── components/           4 biểu mẫu dùng lại
        ├── utils/                Hộp thoại SweetAlert2
        └── assets/               Bảng màu, font chữ, kiểu biểu mẫu
```

---

## 8. Các chức năng chính

- Đăng nhập, đăng xuất bằng JWT; phân quyền theo chức vụ
- Trang tổng quan thống kê số đầu sách, độc giả, phiếu đang mượn, phiếu quá hạn
- Quản lý sách, độc giả, nhà xuất bản (thêm, sửa, xoá, tìm kiếm)
- Lập phiếu mượn và xác nhận trả sách
- Lọc danh sách phiếu mượn theo trạng thái: đang mượn, đã trả, quá hạn
- Quản lý tài khoản nhân viên (dành riêng cho chức vụ Quản lý)

---

## 9. Ràng buộc nghiệp vụ

- Không cho mượn khi số quyển trong kho bằng 0
- Một độc giả không mượn hai lần cùng một cuốn sách khi chưa trả
- Mỗi độc giả chỉ được mượn tối đa 3 cuốn cùng lúc
- Mượn sách thì trừ một quyển, trả sách hoặc xoá phiếu chưa trả thì cộng lại một quyển
- Không xác nhận trả hai lần cho cùng một phiếu
- Phiếu chưa trả mà quá ngày hẹn trả được xem là quá hạn
- Mã sách, mã độc giả, mã nhà xuất bản và mã số nhân viên là duy nhất
- Mật khẩu nhân viên luôn được băm bằng bcrypt và không trả về cho giao diện
