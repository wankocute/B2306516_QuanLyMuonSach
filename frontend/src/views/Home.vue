<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">Tổng quan</span>
        <h3>Xin chào, {{ hoTen }}</h3>
      </div>
      <span class="badge badge-warning">{{ chucVu }}</span>
    </div>

    <div v-if="message" class="msg msg-error">
      <i class="fas fa-circle-exclamation"></i> {{ message }}
    </div>

    <div class="row">
      <div class="col-md-3 mb-3">
        <router-link to="/sach" class="stat-card">
          <span class="stat-icon"><i class="fas fa-book"></i></span>
          <div class="stat-value">{{ hienThi(soSach) }}</div>
          <div class="stat-label">Đầu sách</div>
        </router-link>
      </div>
      <div class="col-md-3 mb-3">
        <router-link to="/docgia" class="stat-card">
          <span class="stat-icon"><i class="fas fa-users"></i></span>
          <div class="stat-value">{{ hienThi(soDocGia) }}</div>
          <div class="stat-label">Độc giả</div>
        </router-link>
      </div>
      <div class="col-md-3 mb-3">
        <router-link to="/muonsach" class="stat-card">
          <span class="stat-icon">
            <i class="fas fa-arrow-right-arrow-left"></i>
          </span>
          <div class="stat-value">{{ hienThi(soDangMuon) }}</div>
          <div class="stat-label">Đang mượn</div>
        </router-link>
      </div>
      <div class="col-md-3 mb-3">
        <router-link to="/muonsach" class="stat-card is-warning">
          <span class="stat-icon">
            <i class="fas fa-triangle-exclamation"></i>
          </span>
          <div class="stat-value">{{ hienThi(soQuaHan) }}</div>
          <div class="stat-label">Quá hạn trả</div>
        </router-link>
      </div>
    </div>

    <div class="page-head mt-4">
      <div>
        <span class="eyebrow">Hoạt động</span>
        <h3>Phiếu mượn gần đây</h3>
      </div>
      <router-link to="/muonsach" class="btn btn-secondary btn-sm">
        Xem tất cả
      </router-link>
    </div>

    <div class="table-wrap">
      <table class="table table-hover table-sm">
        <thead class="thead-light">
          <tr>
            <th>Độc giả</th>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Hẹn trả</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in phieuGanDay" :key="p._id">
            <td>{{ tenDocGia(p.MaDocGia) }}</td>
            <td>{{ tenSach(p.MaSach) }}</td>
            <td>{{ dinhDangNgay(p.NgayMuon) }}</td>
            <td>{{ dinhDangNgay(p.NgayHenTra) }}</td>
            <td>
              <span class="badge" :class="lopBadge(p)">
                {{ nhanTrangThai(p) }}
              </span>
            </td>
          </tr>
          <tr v-if="!dangTai && phieuGanDay.length === 0" class="empty-state">
            <td colspan="5">Chưa có phiếu mượn nào</td>
          </tr>
          <tr v-if="dangTai" class="empty-state">
            <td colspan="5">Đang tải...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import DocGiaService from "@/services/docgia.service";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";

export default {
  data() {
    return {
      hoTen: localStorage.getItem("hoTen") || "",
      chucVu: localStorage.getItem("chucVu") || "",
      dsSach: [],
      dsDocGia: [],
      dsPhieu: [],
      dangTai: true,
      message: "",
    };
  },
  computed: {
    soSach() {
      return this.dsSach.length;
    },
    soDocGia() {
      return this.dsDocGia.length;
    },
    soDangMuon() {
      return this.dsPhieu.filter((p) => !p.NgayTra).length;
    },
    soQuaHan() {
      return this.dsPhieu.filter((p) => this.quaHan(p)).length;
    },
    phieuGanDay() {
      const sapXep = [...this.dsPhieu].sort(
        (a, b) => new Date(b.NgayMuon) - new Date(a.NgayMuon)
      );
      return sapXep.slice(0, 5);
    },
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      try {
        this.dsSach = await SachService.getAll();
        this.dsDocGia = await DocGiaService.getAll();
        this.dsPhieu = await TheoDoiMuonSachService.getAll();
      } catch (error) {
        this.message = "Không tải được số liệu tổng quan";
      } finally {
        this.dangTai = false;
      }
    },
    hienThi(so) {
      return this.dangTai ? "—" : so;
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
  },
};
</script>
