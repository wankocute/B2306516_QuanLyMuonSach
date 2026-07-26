import Swal from "sweetalert2";

// heightAuto: false để SweetAlert2 không sửa chiều cao body,
// tránh trang bị giật ngang khi mở hộp thoại.
const chung = {
  heightAuto: false,
  reverseButtons: true,
  buttonsStyling: true,
};

export async function xacNhanXoa(noiDung) {
  const kq = await Swal.fire({
    ...chung,
    title: "Xoá dữ liệu",
    text: noiDung,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
    confirmButtonColor: "#b3261e",
    cancelButtonColor: "#6b7785",
    focusCancel: true,
  });
  return kq.isConfirmed;
}

export async function xacNhan(tieuDe, noiDung) {
  const kq = await Swal.fire({
    ...chung,
    title: tieuDe,
    text: noiDung,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Huỷ",
    confirmButtonColor: "#16558f",
    cancelButtonColor: "#6b7785",
  });
  return kq.isConfirmed;
}

export function thongBao(noiDung) {
  Swal.fire({
    heightAuto: false,
    toast: true,
    position: "top-end",
    icon: "success",
    title: noiDung,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
}
