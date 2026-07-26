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
            <NhanVienForm
              :key="form._id || 'moi'"
              :nhanVien="form"
              @submit:nhanvien="luu"
              @cancel="reset"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NhanVienService from "@/services/nhanvien.service";
import NhanVienForm from "@/components/NhanVienForm.vue";

export default {
  components: {
    NhanVienForm,
  },
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
      this.message = "";
    },
    reset() {
      this.form = this.formRong();
      this.message = "";
    },
    async luu(data) {
      try {
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
