<template>
  <div>
    <h3>Quản lý nhân viên</h3>

    <p v-if="message" class="text-danger">{{ message }}</p>

    <div class="row">
      <div class="col-md-8">
        <table class="table table-bordered table-hover table-sm">
          <thead class="thead-light">
            <tr>
              <th>MSNV</th>
              <th>Họ tên</th>
              <th>Chức vụ</th>
              <th>Địa chỉ</th>
              <th>Điện thoại</th>
              <th style="width: 120px">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="nv in danhSach" :key="nv._id">
              <td>{{ nv.MSNV }}</td>
              <td>{{ nv.HoTenNV }}</td>
              <td>{{ nv.ChucVu }}</td>
              <td>{{ nv.DiaChi }}</td>
              <td>{{ nv.SoDienThoai }}</td>
              <td>
                <button class="btn btn-sm btn-warning mr-1" @click="chon(nv)">
                  Sửa
                </button>
                <button class="btn btn-sm btn-danger" @click="xoa(nv)">
                  Xoá
                </button>
              </td>
            </tr>
            <tr v-if="danhSach.length === 0">
              <td colspan="6" class="text-center">Không có nhân viên nào</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5>{{ form._id ? "Cập nhật nhân viên" : "Thêm nhân viên mới" }}</h5>
            <div class="form-group">
              <label>MSNV</label>
              <input v-model="form.MSNV" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Họ tên</label>
              <input v-model="form.HoTenNV" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>
                Mật khẩu
                <small v-if="form._id" class="text-muted">
                  (bỏ trống nếu không đổi)
                </small>
              </label>
              <input v-model="form.Password" type="password" class="form-control" />
            </div>
            <div class="form-group">
              <label>Chức vụ</label>
              <select v-model="form.ChucVu" class="form-control">
                <option value="Nhân viên">Nhân viên</option>
                <option value="Quản lý">Quản lý</option>
              </select>
            </div>
            <div class="form-group">
              <label>Địa chỉ</label>
              <input v-model="form.DiaChi" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input v-model="form.SoDienThoai" type="text" class="form-control" />
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
import NhanVienService from "@/services/nhanvien.service";

export default {
  data() {
    return {
      danhSach: [],
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
        MSNV: "",
        HoTenNV: "",
        Password: "",
        ChucVu: "Nhân viên",
        DiaChi: "",
        SoDienThoai: "",
      };
    },
    async load() {
      try {
        this.danhSach = await NhanVienService.getAll();
      } catch (error) {
        this.message = "Không tải được danh sách nhân viên";
      }
    },
    chon(nv) {
      this.form = { ...nv, Password: "" };
    },
    reset() {
      this.form = this.formRong();
      this.message = "";
    },
    async luu() {
      if (!this.form.MSNV || !this.form.HoTenNV) {
        this.message = "Phải nhập MSNV và Họ tên";
        return;
      }
      if (!this.form._id && !this.form.Password) {
        this.message = "Phải nhập mật khẩu cho nhân viên mới";
        return;
      }
      try {
        const data = { ...this.form };
        if (data._id && !data.Password) {
          delete data.Password;
        }
        if (data._id) {
          await NhanVienService.update(data._id, data);
        } else {
          await NhanVienService.create(data);
        }
        this.reset();
        this.load();
      } catch (error) {
        this.message = error.response?.data?.message || "Lưu thất bại";
      }
    },
    async xoa(nv) {
      if (!confirm(`Xoá nhân viên ${nv.HoTenNV}?`)) return;
      try {
        await NhanVienService.delete(nv._id);
        this.load();
      } catch (error) {
        this.message = error.response?.data?.message || "Xoá thất bại";
      }
    },
  },
};
</script>
