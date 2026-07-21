<template>
  <div>
    <nav v-if="isLoggedIn" class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">
        <i class="fas fa-book"></i> Quản lý mượn sách
      </router-link>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/sach" class="nav-link">Sách</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/docgia" class="nav-link">Độc giả</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/nhaxuatban" class="nav-link">Nhà xuất bản</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/muonsach" class="nav-link">Mượn / Trả</router-link>
        </li>
        <li class="nav-item" v-if="laQuanLy">
          <router-link to="/nhanvien" class="nav-link">Nhân viên</router-link>
        </li>
      </div>
      <div class="navbar-nav">
        <li class="nav-item">
          <a href="#" class="nav-link" @click.prevent="logout">
            Đăng xuất ({{ hoTen }})
          </a>
        </li>
      </div>
    </nav>

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      laQuanLy: false,
      hoTen: "",
    };
  },
  watch: {
    $route() {
      this.checkLogin();
    },
  },
  created() {
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      this.isLoggedIn = !!localStorage.getItem("token");
      this.hoTen = localStorage.getItem("hoTen") || "";
      this.laQuanLy = localStorage.getItem("chucVu") === "Quản lý";
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("hoTen");
      localStorage.removeItem("chucVu");
      this.$router.push("/login");
    },
  },
};
</script>
