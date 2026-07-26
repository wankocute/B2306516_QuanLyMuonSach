<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">Danh mục</span>
        <h3>Quản lý độc giả</h3>
      </div>
    </div>

    <div v-if="message" class="msg msg-error">
      <i class="fas fa-circle-exclamation"></i> {{ message }}
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="toolbar">
          <div class="search-box">
            <i class="fas fa-magnifying-glass"></i>
            <input
              v-model="keyword"
              type="text"
              class="form-control"
              placeholder="Tìm theo tên hoặc số điện thoại"
              @keyup.enter="load"
            />
          </div>
          <button class="btn btn-primary" @click="load">Tìm</button>
          <button class="btn btn-secondary" @click="xoaTimKiem">Xoá lọc</button>
        </div>

        <div class="table-wrap">
          <table class="table table-hover table-sm">
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
                  <button
                    class="btn btn-sm btn-outline-primary mr-1"
                    @click="chon(dg)"
                  >
                    Sửa
                  </button>
                  <button class="btn btn-sm btn-danger" @click="xoa(dg)">
                    Xoá
                  </button>
                </td>
              </tr>
              <tr v-if="danhSach.length === 0" class="empty-state">
                <td colspan="8">Không có độc giả nào</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5>{{ form._id ? "Cập nhật độc giả" : "Thêm độc giả mới" }}</h5>
            <DocGiaForm
              :key="form._id || 'moi'"
              :docGia="form"
              @submit:docgia="luu"
              @cancel="reset"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DocGiaService from "@/services/docgia.service";
import DocGiaForm from "@/components/DocGiaForm.vue";
import { thongBao, xacNhanXoa } from "@/utils/hoithoai";

export default {
  components: {
    DocGiaForm,
  },
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
      this.message = "";
    },
    reset() {
      this.form = this.formRong();
      this.message = "";
    },
    async luu(data) {
      try {
        if (data._id) {
          await DocGiaService.update(data._id, data);
        } else {
          await DocGiaService.create(data);
        }
        thongBao(data._id ? "Đã cập nhật" : "Đã thêm mới");
        this.reset();
        this.load();
      } catch (error) {
        this.message = error.response?.data?.message || "Lưu thất bại";
      }
    },
    async xoa(dg) {
      const dongY = await xacNhanXoa(`Xoá độc giả ${dg.HoLot} ${dg.Ten}?`);
      if (!dongY) return;
      try {
        await DocGiaService.delete(dg._id);
        thongBao("Đã xoá");
        this.load();
      } catch (error) {
        this.message = "Xoá thất bại";
      }
    },
  },
};
</script>
