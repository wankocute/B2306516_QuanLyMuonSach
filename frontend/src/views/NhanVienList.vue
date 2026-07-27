<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">Hệ thống</span>
        <h3>Quản lý nhân viên</h3>
      </div>

      <button class="btn btn-primary" @click="themMoi">
        <i class="fas fa-plus"></i> Thêm mới
      </button>
    </div>

    <div v-if="message" class="msg msg-error">
      <i class="fas fa-circle-exclamation"></i> {{ message }}
    </div>

    <div class="row">
      <div :class="hienForm ? 'col-md-8' : 'col-12'">
        <div class="table-wrap">
          <table class="table table-hover table-sm">
            <thead class="thead-light">
              <tr>
                <th>MSNV</th>
                <th>Họ tên</th>
                <th>Chức vụ</th>
                <th class="cell-wide">Địa chỉ</th>
                <th>Điện thoại</th>
                <th style="width: 120px">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nv in danhSach" :key="nv._id">
                <td>{{ nv.MSNV }}</td>
                <td>{{ nv.HoTenNV }}</td>
                <td>{{ nv.ChucVu }}</td>
                <td class="cell-wide">{{ nv.DiaChi }}</td>
                <td>{{ nv.SoDienThoai }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-primary mr-1"
                    @click="chon(nv)"
                  >
                    Sửa
                  </button>
                  <button class="btn btn-sm btn-danger" @click="xoa(nv)">
                    Xoá
                  </button>
                </td>
              </tr>
              <tr v-if="danhSach.length === 0" class="empty-state">
                <td colspan="6">Không có nhân viên nào</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="hienForm" class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5>
              {{ form._id ? "Cập nhật nhân viên" : "Thêm nhân viên mới" }}
            </h5>
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
import { thongBao, xacNhanXoa } from "@/utils/hoithoai";

export default {
  components: {
    NhanVienForm,
  },
  data() {
    return {
      danhSach: [],
      form: this.formRong(),
      hienForm: false,
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
      this.hienForm = true;
      this.message = "";
    },
    themMoi() {
      this.form = this.formRong();
      this.hienForm = true;
      this.message = "";
    },
    reset() {
      this.form = this.formRong();
      this.hienForm = false;
      this.message = "";
    },
    async luu(data) {
      try {
        if (data._id) {
          await NhanVienService.update(data._id, data);
        } else {
          await NhanVienService.create(data);
        }
        thongBao(data._id ? "Đã cập nhật" : "Đã thêm mới");
        this.reset();
        this.load();
      } catch (error) {
        this.message = error.response?.data?.message || "Lưu thất bại";
      }
    },
    async xoa(nv) {
      const dongY = await xacNhanXoa(`Xoá nhân viên ${nv.HoTenNV}?`);
      if (!dongY) return;
      try {
        await NhanVienService.delete(nv._id);
        thongBao("Đã xoá");
        this.load();
      } catch (error) {
        this.message = error.response?.data?.message || "Xoá thất bại";
      }
    },
  },
};
</script>
