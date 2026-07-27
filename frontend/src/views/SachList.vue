<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">Danh mục</span>
        <h3>Quản lý sách</h3>
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
        <div class="toolbar">
          <div class="search-box">
            <i class="fas fa-magnifying-glass"></i>
            <input
              v-model="keyword"
              type="text"
              class="form-control"
              placeholder="Tìm theo tên sách hoặc tác giả"
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
                <th>Mã</th>
                <th class="cell-wrap">Tên sách</th>
                <th>Tác giả</th>
                <th>Đơn giá</th>
                <th>Số quyển</th>
                <th>Năm XB</th>
                <th class="cell-wrap">NXB</th>
                <th style="width: 120px">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in danhSach" :key="s._id">
                <td>{{ s.MaSach }}</td>
                <td class="cell-wrap">{{ s.TenSach }}</td>
                <td>{{ s.TacGia }}</td>
                <td>{{ s.DonGia }}</td>
                <td>{{ s.SoQuyen }}</td>
                <td>{{ s.NamXuatBan }}</td>
                <td class="cell-wrap">{{ tenNXB(s.MaNXB) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-primary mr-1"
                    @click="chon(s)"
                  >
                    Sửa
                  </button>
                  <button class="btn btn-sm btn-danger" @click="xoa(s)">
                    Xoá
                  </button>
                </td>
              </tr>
              <tr v-if="danhSach.length === 0" class="empty-state">
                <td colspan="8">Không có sách nào</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="hienForm" class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5>{{ form._id ? "Cập nhật sách" : "Thêm sách mới" }}</h5>
            <SachForm
              :key="form._id || 'moi'"
              :sach="form"
              :dsNXB="dsNXB"
              @submit:sach="luu"
              @cancel="reset"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import SachForm from "@/components/SachForm.vue";
import { thongBao, xacNhanXoa } from "@/utils/hoithoai";

export default {
  components: {
    SachForm,
  },
  data() {
    return {
      danhSach: [],
      dsNXB: [],
      keyword: "",
      form: this.formRong(),
      hienForm: false,
      message: "",
    };
  },
  created() {
    this.load();
    this.loadNXB();
  },
  methods: {
    formRong() {
      return {
        MaSach: "",
        TenSach: "",
        TacGia: "",
        DonGia: 0,
        SoQuyen: 0,
        NamXuatBan: new Date().getFullYear(),
        MaNXB: "",
      };
    },
    async load() {
      try {
        this.danhSach = await SachService.getAll(this.keyword);
      } catch (error) {
        this.message = "Không tải được danh sách sách";
      }
    },
    async loadNXB() {
      try {
        this.dsNXB = await NhaXuatBanService.getAll();
      } catch (error) {
        this.dsNXB = [];
      }
    },
    tenNXB(maNXB) {
      const nxb = this.dsNXB.find((x) => x.MaNXB === maNXB);
      return nxb ? nxb.TenNXB : maNXB;
    },
    xoaTimKiem() {
      this.keyword = "";
      this.load();
    },
    chon(s) {
      this.form = { ...s };
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
          await SachService.update(data._id, data);
        } else {
          await SachService.create(data);
        }
        thongBao(data._id ? "Đã cập nhật" : "Đã thêm mới");
        this.reset();
        this.load();
      } catch (error) {
        this.message = error.response?.data?.message || "Lưu thất bại";
      }
    },
    async xoa(s) {
      const dongY = await xacNhanXoa(`Xoá sách ${s.TenSach}?`);
      if (!dongY) return;
      try {
        await SachService.delete(s._id);
        thongBao("Đã xoá");
        this.load();
      } catch (error) {
        this.message = "Xoá thất bại";
      }
    },
  },
};
</script>
