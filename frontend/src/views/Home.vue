<template>
  <div>
    <h3>Trang chủ</h3>
    <p>Xin chào {{ hoTen }} ({{ chucVu }})</p>
    <div class="row mt-4">
      <div class="col-md-3" v-for="item in menu" :key="item.to">
        <router-link :to="item.to" class="btn btn-outline-primary btn-block p-4">
          {{ item.text }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hoTen: localStorage.getItem("hoTen"),
      chucVu: localStorage.getItem("chucVu"),
      menu: [
        { to: "/sach", text: "Quản lý sách" },
        { to: "/docgia", text: "Quản lý độc giả" },
        { to: "/nhaxuatban", text: "Nhà xuất bản" },
        { to: "/muonsach", text: "Mượn / Trả sách" },
      ],
    };
  },
};
</script>
