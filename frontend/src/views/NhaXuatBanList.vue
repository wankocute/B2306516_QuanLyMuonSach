<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">Danh mục</span>
        <h3>Nhà xuất bản</h3>
      </div>
    </div>

    <div v-if="message" class="msg msg-error">
      <i class="fas fa-circle-exclamation"></i> {{ message }}
    </div>

    <div class="row">
      <div class="col-md-7">
        <div class="table-wrap">
          <table class="table table-hover">
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
                  <button
                    class="btn btn-sm btn-outline-primary mr-1"
                    @click="chon(nxb)"
                  >
                    Sửa
                  </button>
                  <button class="btn btn-sm btn-danger" @click="xoa(nxb)">
                    Xoá
                  </button>
                </td>
              </tr>
              <tr v-if="danhSach.length === 0" class="empty-state">
                <td colspan="4">Chưa có nhà xuất bản nào</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-md-5">
        <div class="card">
          <div class="card-body">
            <h5>{{ form._id ? "Cập nhật" : "Thêm mới" }}</h5>
            <NhaXuatBanForm
              :key="form._id || 'moi'"
              :nhaXuatBan="form"
              @submit:nhaxuatban="luu"
              @cancel="reset"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NhaXuatBanService from "@/services/nhaxuatban.service";
import NhaXuatBanForm from "@/components/NhaXuatBanForm.vue";
import { thongBao, xacNhanXoa } from "@/utils/hoithoai";

export default {
  components: {
    NhaXuatBanForm,
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
      return { MaNXB: "", TenNXB: "", DiaChi: "" };
    },
    async load() {
      try {
        this.danhSach = await NhaXuatBanService.getAll();
      } catch (error) {
        this.message = "Không tải được danh sách";
      }
    },
    chon(nxb) {
      this.form = { ...nxb };
      this.message = "";
    },
    reset() {
      this.form = this.formRong();
      this.message = "";
    },
    async luu(data) {
      try {
        if (data._id) {
          await NhaXuatBanService.update(data._id, data);
        } else {
          await NhaXuatBanService.create(data);
        }
        thongBao(data._id ? "Đã cập nhật" : "Đã thêm mới");
        this.reset();
        this.load();
      } catch (error) {
        this.message = error.response?.data?.message || "Lưu thất bại";
      }
    },
    async xoa(nxb) {
      const dongY = await xacNhanXoa(`Xoá nhà xuất bản ${nxb.TenNXB}?`);
      if (!dongY) return;
      try {
        await NhaXuatBanService.delete(nxb._id);
        thongBao("Đã xoá");
        this.load();
      } catch (error) {
        this.message = "Xoá thất bại";
      }
    },
  },
};
</script>
