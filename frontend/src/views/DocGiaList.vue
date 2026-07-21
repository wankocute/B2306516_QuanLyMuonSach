<template>
  <div>
    <h3>Quản lý độc giả</h3>

    <p v-if="message" class="text-danger">{{ message }}</p>

    <div class="row">
      <div class="col-md-8">
        <div class="input-group mb-2">
          <input
            v-model="keyword"
            type="text"
            class="form-control"
            placeholder="Tìm theo tên hoặc số điện thoại"
            @keyup.enter="load"
          />
          <div class="input-group-append">
            <button class="btn btn-primary" @click="load">Tìm</button>
            <button class="btn btn-secondary" @click="xoaTimKiem">Xoá lọc</button>
          </div>
        </div>

        <table class="table table-bordered table-hover table-sm">
          <thead class="thead-light">
            <tr>
              <th>Mã ĐG</th>
              <th>Họ lót</th>
              <th>Tên</th>
              <th>Ngày sinh</th>
              <th>Phái</th>
              <th>Địa chỉ</th>
              <th>Điện thoại</th>
              <th style="width: 120px">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dg in danhSach" :key="dg._id">
              <td>{{ dg.MaDocGia }}</td>
              <td>{{ dg.HoLot }}</td>
              <td>{{ dg.Ten }}</td>
              <td>{{ dinhDangNgay(dg.NgaySinh) }}</td>
              <td>{{ dg.Phai }}</td>
              <td>{{ dg.DiaChi }}</td>
              <td>{{ dg.DienThoai }}</td>
              <td>
                <button class="btn btn-sm btn-warning mr-1" @click="chon(dg)">
                  Sửa
                </button>
                <button class="btn btn-sm btn-danger" @click="xoa(dg)">
                  Xoá
                </button>
              </td>
            </tr>
            <tr v-if="danhSach.length === 0">
              <td colspan="8" class="text-center">Không có độc giả nào</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5>{{ form._id ? "Cập nhật độc giả" : "Thêm độc giả mới" }}</h5>
            <div class="form-group">
              <label>Mã độc giả</label>
              <input v-model="form.MaDocGia" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Họ lót</label>
              <input v-model="form.HoLot" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Tên</label>
              <input v-model="form.Ten" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Ngày sinh</label>
              <input v-model="form.NgaySinh" type="date" class="form-control" />
            </div>
            <div class="form-group">
              <label>Phái</label>
              <select v-model="form.Phai" class="form-control">
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
              </select>
            </div>
            <div class="form-group">
              <label>Địa chỉ</label>
              <input v-model="form.DiaChi" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Điện thoại</label>
              <input v-model="form.DienThoai" type="text" class="form-control" />
            </div>
            <button class="btn btn-primary mr-2" @click="luu">Lưu</button>
            <button class="btn btn-secondary" @click="reset">Huỷ</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DocGiaService from "@/services/docgia.service";

export default {
  data() {
    return {
      danhSach: [],
      keyword: "",
      form: this.formRong(),
      message: "",
    };
  },
  created() {
    this.load();
  },
  methods: {
    formRong() {
      return {
        MaDocGia: "",
        HoLot: "",
        Ten: "",
        NgaySinh: "",
        Phai: "Nam",
        DiaChi: "",
        DienThoai: "",
      };
    },
    dinhDangNgay(ngay) {
      if (!ngay) return "";
      return new Date(ngay).toLocaleDateString("vi-VN");
    },
    async load() {
      try {
        this.danhSach = await DocGiaService.getAll(this.keyword);
      } catch (error) {
        this.message = "Không tải được danh sách độc giả";
      }
    },
    xoaTimKiem() {
      this.keyword = "";
      this.load();
    },
    chon(dg) {
      this.form = { ...dg };
      // input type=date chỉ nhận chuỗi yyyy-MM-dd
      if (this.form.NgaySinh) {
        this.form.NgaySinh = new Date(this.form.NgaySinh)
          .toISOString()
          .slice(0, 10);
      }
    },
    reset() {
      this.form = this.formRong();
      this.message = "";
    },
    async luu() {
      if (!this.form.MaDocGia || !this.form.Ten) {
        this.message = "Phải nhập Mã độc giả và Tên";
        return;
      }
      try {
        if (this.form._id) {
          await DocGiaService.update(this.form._id, this.form);
        } else {
          await DocGiaService.create(this.form);
        }
        this.reset();
        this.load();
      } catch (error) {
        this.message = error.response?.data?.message || "Lưu thất bại";
      }
    },
    async xoa(dg) {
      if (!confirm(`Xoá độc giả ${dg.HoLot} ${dg.Ten}?`)) return;
      try {
        await DocGiaService.delete(dg._id);
        this.load();
      } catch (error) {
        this.message = "Xoá thất bại";
      }
    },
  },
};
</script>
