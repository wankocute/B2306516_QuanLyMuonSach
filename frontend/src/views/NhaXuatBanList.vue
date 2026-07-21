<template>
  <div>
    <h3>Nhà xuất bản</h3>

    <p v-if="message" class="text-danger">{{ message }}</p>

    <div class="row">
      <div class="col-md-7">
        <table class="table table-bordered table-hover">
          <thead class="thead-light">
            <tr>
              <th>Mã NXB</th>
              <th>Tên NXB</th>
              <th>Địa chỉ</th>
              <th style="width: 130px">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="nxb in danhSach" :key="nxb._id">
              <td>{{ nxb.MaNXB }}</td>
              <td>{{ nxb.TenNXB }}</td>
              <td>{{ nxb.DiaChi }}</td>
              <td>
                <button class="btn btn-sm btn-warning mr-1" @click="chon(nxb)">
                  Sửa
                </button>
                <button class="btn btn-sm btn-danger" @click="xoa(nxb)">
                  Xoá
                </button>
              </td>
            </tr>
            <tr v-if="danhSach.length === 0">
              <td colspan="4" class="text-center">Chưa có nhà xuất bản nào</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-md-5">
        <div class="card">
          <div class="card-body">
            <h5>{{ form._id ? "Cập nhật" : "Thêm mới" }}</h5>
            <div class="form-group">
              <label>Mã NXB</label>
              <input v-model="form.MaNXB" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Tên NXB</label>
              <input v-model="form.TenNXB" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Địa chỉ</label>
              <input v-model="form.DiaChi" type="text" class="form-control" />
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
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
  data() {
    return {
      danhSach: [],
      form: { MaNXB: "", TenNXB: "", DiaChi: "" },
      message: "",
    };
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      try {
        this.danhSach = await NhaXuatBanService.getAll();
      } catch (error) {
        this.message = "Không tải được danh sách";
      }
    },
    chon(nxb) {
      this.form = { ...nxb };
    },
    reset() {
      this.form = { MaNXB: "", TenNXB: "", DiaChi: "" };
      this.message = "";
    },
    async luu() {
      if (!this.form.MaNXB || !this.form.TenNXB) {
        this.message = "Phải nhập Mã NXB và Tên NXB";
        return;
      }
      try {
        if (this.form._id) {
          await NhaXuatBanService.update(this.form._id, this.form);
        } else {
          await NhaXuatBanService.create(this.form);
        }
        this.reset();
        this.load();
      } catch (error) {
        this.message = error.response?.data?.message || "Lưu thất bại";
      }
    },
    async xoa(nxb) {
      if (!confirm(`Xoá nhà xuất bản ${nxb.TenNXB}?`)) return;
      try {
        await NhaXuatBanService.delete(nxb._id);
        this.load();
      } catch (error) {
        this.message = "Xoá thất bại";
      }
    },
  },
};
</script>
