<template>
  <div>
    <nav v-if="isLoggedIn" class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">
        <i class="fas fa-book"></i> Quản lý mượn sách
      </router-link>

      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <i class="fas fa-gauge"></i> Trang chủ
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/sach" class="nav-link">
            <i class="fas fa-book"></i> Sách
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/docgia" class="nav-link">
            <i class="fas fa-users"></i> Độc giả
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/nhaxuatban" class="nav-link">
            <i class="fas fa-building"></i> Nhà xuất bản
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/muonsach" class="nav-link">
            <i class="fas fa-arrow-right-arrow-left"></i> Mượn / Trả
          </router-link>
        </li>
        <li class="nav-item" v-if="laQuanLy">
          <router-link to="/nhanvien" class="nav-link">
            <i class="fas fa-user-tie"></i> Nhân viên
          </router-link>
        </li>
      </ul>

      <div class="navbar-user">
        <span class="user-name">{{ hoTen }}</span>
        <span class="user-role">{{ chucVu }}</span>
      </div>
      <a href="#" class="nav-link logout-link" @click.prevent="logout">
        <i class="fas fa-arrow-right-from-bracket"></i>
      </a>
    </nav>

    <div
      :key="$route.path"
      :class="isLoggedIn ? 'container py-4 page-enter' : ''"
    >
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
      chucVu: "",
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
      this.chucVu = localStorage.getItem("chucVu") || "";
      this.laQuanLy = this.chucVu === "Quản lý";
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

<style scoped>
.navbar-user {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  text-align: right;
  margin-right: 0.75rem;
}

.user-name {
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
}

.user-role {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.logout-link {
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: background-color 150ms, color 150ms;
}

.logout-link:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.12);
}
</style>
