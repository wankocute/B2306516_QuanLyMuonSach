<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">Nghiệp vụ</span>
        <h3>Mượn / Trả sách</h3>
      </div>
    </div>

    <div v-if="message" class="msg" :class="thanhCong ? 'msg-ok' : 'msg-error'">
      <i
        class="fas"
        :class="thanhCong ? 'fa-circle-check' : 'fa-circle-exclamation'"
      ></i>
      {{ message }}
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <h5>Lập phiếu mượn</h5>
        <div class="form-row align-items-end">
          <div class="col-md-4">
            <label>Độc giả</label>
            <select v-model="form.MaDocGia" class="form-control">
              <option value="">-- Chọn độc giả --</option>
              <option v-for="dg in dsDocGia" :key="dg._id" :value="dg.MaDocGia">
                {{ dg.MaDocGia }} - {{ dg.HoLot }} {{ dg.Ten }}
              </option>
            </select>
          </div>
          <div class="col-md-5">
            <label>Sách</label>
            <select v-model="form.MaSach" class="form-control">
              <option value="">-- Chọn sách --</option>
              <option v-for="s in dsSach" :key="s._id" :value="s.MaSach">
                {{ s.MaSach }} - {{ s.TenSach }} (còn {{ s.SoQuyen }})
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <button class="btn btn-primary btn-block" @click="muonSach">
              Lập phiếu mượn
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="btn-group mb-2">
      <button
        v-for="bo in boLoc"
        :key="bo.value"
        class="btn"
        :class="trangThai === bo.value ? 'btn-primary' : 'btn-outline-primary'"
        @click="doiLoc(bo.value)"
      >
        {{ bo.text }}
      </button>
    </div>

    <table class="table table-bordered table-hover table-sm">
      <thead class="thead-light">
        <tr>
          <th>Độc giả</th>
          <th>Sách</th>
          <th>Ngày mượn</th>
          <th>Hẹn trả</th>
          <th>Ngày trả</th>
          <th>Trạng thái</th>
          <th style="width: 140px">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in danhSach" :key="p._id">
          <td>{{ tenDocGia(p.MaDocGia) }}</td>
          <td>{{ tenSach(p.MaSach) }}</td>
          <td>{{ dinhDangNgay(p.NgayMuon) }}</td>
          <td>{{ dinhDangNgay(p.NgayHenTra) }}</td>
          <td>{{ dinhDangNgay(p.NgayTra) }}</td>
          <td>
            <span class="badge" :class="lopBadge(p)">{{
              nhanTrangThai(p)
            }}</span>
          </td>
          <td>
            <button
              v-if="!p.NgayTra"
              class="btn btn-sm btn-success mr-1"
              @click="traSach(p)"
            >
              Trả sách
            </button>
            <button class="btn btn-sm btn-danger" @click="xoa(p)">Xoá</button>
          </td>
        </tr>
        <tr v-if="danhSach.length === 0" class="empty-state">
          <td colspan="7">Không có phiếu nào</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";
import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";
import { xacNhan, xacNhanXoa } from "@/utils/hoithoai";

export default {
  data() {
    return {
      danhSach: [],
      dsDocGia: [],
      dsSach: [],
      form: { MaDocGia: "", MaSach: "" },
      trangThai: "",
      boLoc: [
        { value: "", text: "Tất cả" },
        { value: "dangmuon", text: "Đang mượn" },
        { value: "datra", text: "Đã trả" },
      ],
      message: "",
      thanhCong: false,
    };
  },
  created() {
    this.load();
    this.loadDanhMuc();
  },
  methods: {
    async load() {
      try {
        this.danhSach = await TheoDoiMuonSachService.getAll(this.trangThai);
      } catch (error) {
        this.baoLoi("Không tải được danh sách phiếu mượn");
      }
    },
    async loadDanhMuc() {
      try {
        this.dsDocGia = await DocGiaService.getAll();
        this.dsSach = await SachService.getAll();
      } catch (error) {
        this.dsDocGia = [];
        this.dsSach = [];
      }
    },
    tenDocGia(ma) {
      const dg = this.dsDocGia.find((x) => x.MaDocGia === ma);
      return dg ? `${dg.HoLot} ${dg.Ten}` : ma;
    },
    tenSach(ma) {
      const s = this.dsSach.find((x) => x.MaSach === ma);
      return s ? s.TenSach : ma;
    },
    dinhDangNgay(ngay) {
      if (!ngay) return "-";
      return new Date(ngay).toLocaleDateString("vi-VN");
    },
    quaHan(p) {
      return !p.NgayTra && p.NgayHenTra && new Date(p.NgayHenTra) < new Date();
    },
    nhanTrangThai(p) {
      if (p.NgayTra) return "Đã trả";
      return this.quaHan(p) ? "Quá hạn" : "Đang mượn";
    },
    lopBadge(p) {
      if (p.NgayTra) return "badge-success";
      return this.quaHan(p) ? "badge-danger" : "badge-warning";
    },
    doiLoc(value) {
      this.trangThai = value;
      this.load();
    },
    baoLoi(text) {
      this.message = text;
      this.thanhCong = false;
    },
    baoOk(text) {
      this.message = text;
      this.thanhCong = true;
    },
    async muonSach() {
      if (!this.form.MaDocGia || !this.form.MaSach) {
        this.baoLoi("Phải chọn độc giả và sách");
        return;
      }
      try {
        await TheoDoiMuonSachService.muonSach(this.form);
        this.form = { MaDocGia: "", MaSach: "" };
        this.baoOk("Lập phiếu mượn thành công");
        this.load();
        this.loadDanhMuc();
      } catch (error) {
        this.baoLoi(error.response?.data?.message || "Lập phiếu thất bại");
      }
    },
    async traSach(p) {
      const dongY = await xacNhan(
        "Xác nhận trả sách",
        `Độc giả đã trả cuốn "${this.tenSach(p.MaSach)}"?`,
      );
      if (!dongY) return;
      try {
        await TheoDoiMuonSachService.traSach(p._id);
        this.baoOk("Trả sách thành công");
        this.load();
        this.loadDanhMuc();
      } catch (error) {
        this.baoLoi(error.response?.data?.message || "Trả sách thất bại");
      }
    },
    async xoa(p) {
      const dongY = await xacNhanXoa(
        "Xoá phiếu mượn này? Thao tác không thể hoàn tác.",
      );
      if (!dongY) return;
      try {
        await TheoDoiMuonSachService.delete(p._id);
        this.load();
      } catch (error) {
        this.baoLoi("Xoá thất bại");
      }
    },
  },
};
</script>
