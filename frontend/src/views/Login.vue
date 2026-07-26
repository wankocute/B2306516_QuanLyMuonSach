<template>
  <div class="auth-wrap">
    <div class="auth-card">
      <span class="brand-mark"><i class="fas fa-book"></i></span>
      <h4>Đăng nhập</h4>
      <p class="auth-sub">Hệ thống quản lý mượn sách</p>

      <div v-if="message" class="msg msg-error">
        <i class="fas fa-circle-exclamation"></i> {{ message }}
      </div>

      <div class="form-group">
        <label for="msnv">Mã số nhân viên</label>
        <input
          id="msnv"
          ref="oMSNV"
          v-model="MSNV"
          type="text"
          class="form-control"
          placeholder="VD: NV01"
          @keyup.enter="login"
        />
      </div>
      <div class="form-group">
        <label for="matkhau">Mật khẩu</label>
        <input
          id="matkhau"
          v-model="Password"
          type="password"
          class="form-control"
          @keyup.enter="login"
        />
      </div>

      <button
        class="btn btn-primary btn-block mt-3"
        :disabled="dangGui"
        @click="login"
      >
        {{ dangGui ? "Đang đăng nhập..." : "Đăng nhập" }}
      </button>
    </div>
  </div>
</template>

<script>
import NhanVienService from "@/services/nhanvien.service";

export default {
  data() {
    return {
      MSNV: "",
      Password: "",
      message: "",
      dangGui: false,
    };
  },
  mounted() {
    this.$refs.oMSNV.focus();
  },
  methods: {
    async login() {
      if (this.dangGui) return;
      this.message = "";

      if (!this.MSNV || !this.Password) {
        this.message = "Nhập mã số nhân viên và mật khẩu";
        return;
      }

      this.dangGui = true;
      try {
        const res = await NhanVienService.login({
          MSNV: this.MSNV,
          Password: this.Password,
        });
        localStorage.setItem("token", res.token);
        localStorage.setItem("hoTen", res.nhanVien.HoTenNV);
        localStorage.setItem("chucVu", res.nhanVien.ChucVu);
        this.$router.push("/");
      } catch (error) {
        this.message = error.response?.data?.message || "Đăng nhập thất bại";
      } finally {
        this.dangGui = false;
      }
    },
  },
};
</script>
