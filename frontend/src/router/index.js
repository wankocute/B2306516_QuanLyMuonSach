import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/sach",
    name: "sach",
    component: () => import("@/views/SachList.vue"),
  },
  {
    path: "/docgia",
    name: "docgia",
    component: () => import("@/views/DocGiaList.vue"),
  },
  {
    path: "/nhaxuatban",
    name: "nhaxuatban",
    component: () => import("@/views/NhaXuatBanList.vue"),
  },
  {
    path: "/muonsach",
    name: "muonsach",
    component: () => import("@/views/MuonSachList.vue"),
  },
  {
    path: "/nhanvien",
    name: "nhanvien",
    component: () => import("@/views/NhanVienList.vue"),
    meta: { chiQuanLy: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Chưa đăng nhập thì đá về /login
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const chucVu = localStorage.getItem("chucVu");

  if (to.name !== "login" && !token) {
    next({ name: "login" });
  } else if (to.meta.chiQuanLy && chucVu !== "Quản lý") {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
