<template>
  <div>
    <h3>Quản lý sách</h3>

    <p v-if="message" class="text-danger">{{ message }}</p>

    <div class="row">
      <div class="col-md-8">
        <div class="input-group mb-2">
          <input
            v-model="keyword"
            type="text"
            class="form-control"
            placeholder="Tìm theo tên sách hoặc tác giả"
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
              <th>Mã</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Đơn giá</th>
              <th>Số quyển</th>
              <th>Năm XB</th>
              <th>NXB</th>
              <th style="width: 120px">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in danhSach" :key="s._id">
              <td>{{ s.MaSach }}</td>
              <td>{{ s.TenSach }}</td>
              <td>{{ s.TacGia }}</td>
              <td>{{ s.DonGia }}</td>
              <td>{{ s.SoQuyen }}</td>
              <td>{{ s.NamXuatBan }}</td>
              <td>{{ tenNXB(s.MaNXB) }}</td>
              <td>
                <button class="btn btn-sm btn-warning mr-1" @click="chon(s)">
                  Sửa
                </button>
                <button class="btn btn-sm btn-danger" @click="xoa(s)">
                  Xoá
                </button>
              </td>
            </tr>
            <tr v-if="danhSach.length === 0">
              <td colspan="8" class="text-center">Không có sách nào</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5>{{ form._id ? "Cập nhật sách" : "Thêm sách mới" }}</h5>
            <div class="form-group">
              <label>Mã sách</label>
              <input v-model="form.MaSach" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Tên sách</label>
              <input v-model="form.TenSach" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Tác giả</label>
              <input v-model="form.TacGia" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Đơn giá</label>
              <input v-model.number="form.DonGia" type="number" class="form-control" />
            </div>
            <div class="form-group">
              <label>Số quyển</label>
              <input v-model.number="form.SoQuyen" type="number" class="form-control" />
            </div>
            <div class="form-group">
              <label>Năm xuất bản</label>
              <input v-model.number="form.NamXuatBan" type="number" class="form-control" />
            </div>
            <div class="form-group">
              <label>Nhà xuất bản</label>
              <select v-model="form.MaNXB" class="form-control">
                <option value="">-- Chọn NXB --</option>
                <option v-for="nxb in dsNXB" :key="nxb._id" :value="nxb.MaNXB">
                  {{ nxb.TenNXB }}
                </option>
              </select>
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
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
  data() {
    return {
      danhSach: [],
      dsNXB: [],
      keyword: "",
      form: this.formRong(),
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
    },
    reset() {
      this.form = this.formRong();
      this.message = "";
    },
    async luu() {
      if (!this.form.MaSach || !this.form.TenSach) {
        this.message = "Phải nhập Mã sách và Tên sách";
        return;
      }
      try {
        if (this.form._id) {
          await SachService.update(this.form._id, this.form);
        } else {
          await SachService.create(this.form);
        }
        this.reset();
        this.load();
      } catch (error) {
        this.message = error.response?.data?.message || "Lưu thất bại";
      }
    },
    async xoa(s) {
      if (!confirm(`Xoá sách ${s.TenSach}?`)) return;
      try {
        await SachService.delete(s._id);
        this.load();
      } catch (error) {
        this.message = "Xoá thất bại";
      }
    },
  },
};
</script>
