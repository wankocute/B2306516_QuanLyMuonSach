<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-4">
      <h4 class="text-center mb-3">Đăng nhập</h4>
      <div class="form-group">
        <label>MSNV</label>
        <input v-model="MSNV" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label>Mật khẩu</label>
        <input
          v-model="Password"
          type="password"
          class="form-control"
          @keyup.enter="login"
        />
      </div>
      <button class="btn btn-primary btn-block" @click="login">
        Đăng nhập
      </button>
      <p v-if="message" class="text-danger mt-2">{{ message }}</p>
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
    };
  },
  methods: {
    async login() {
      this.message = "";
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
        this.message =
          error.response?.data?.message || "Đăng nhập thất bại";
      }
    },
  },
};
</script>
