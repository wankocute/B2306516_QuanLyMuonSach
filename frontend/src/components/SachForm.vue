<template>
  <Form @submit="submitSach" :validation-schema="sachFormSchema">
    <div class="form-group">
      <label for="MaSach">Mã sách</label>
      <Field
        name="MaSach"
        type="text"
        class="form-control"
        v-model="sachLocal.MaSach"
      />
      <ErrorMessage name="MaSach" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="TenSach">Tên sách</label>
      <Field
        name="TenSach"
        type="text"
        class="form-control"
        v-model="sachLocal.TenSach"
      />
      <ErrorMessage name="TenSach" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="TacGia">Tác giả</label>
      <Field
        name="TacGia"
        type="text"
        class="form-control"
        v-model="sachLocal.TacGia"
      />
      <ErrorMessage name="TacGia" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="DonGia">Đơn giá</label>
      <Field
        name="DonGia"
        type="number"
        class="form-control"
        v-model="sachLocal.DonGia"
      />
      <ErrorMessage name="DonGia" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="SoQuyen">Số quyển</label>
      <Field
        name="SoQuyen"
        type="number"
        class="form-control"
        v-model="sachLocal.SoQuyen"
      />
      <ErrorMessage name="SoQuyen" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="NamXuatBan">Năm xuất bản</label>
      <Field
        name="NamXuatBan"
        type="number"
        class="form-control"
        v-model="sachLocal.NamXuatBan"
      />
      <ErrorMessage name="NamXuatBan" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="MaNXB">Nhà xuất bản</label>
      <Field
        name="MaNXB"
        as="select"
        class="form-control"
        v-model="sachLocal.MaNXB"
      >
        <option value="">-- Chọn NXB --</option>
        <option v-for="nxb in dsNXB" :key="nxb._id" :value="nxb.MaNXB">
          {{ nxb.TenNXB }}
        </option>
      </Field>
      <ErrorMessage name="MaNXB" class="error-feedback" />
    </div>

    <div class="form-group">
      <button class="btn btn-primary mr-2">Lưu</button>
      <button type="button" class="btn btn-secondary" @click="cancel">
        Huỷ
      </button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:sach", "cancel"],
  props: {
    sach: { type: Object, required: true },
    dsNXB: { type: Array, default: () => [] },
  },
  data() {
    const namHienTai = new Date().getFullYear();
    const sachFormSchema = yup.object().shape({
      MaSach: yup
        .string()
        .required("Mã sách phải có giá trị.")
        .max(20, "Mã sách tối đa 20 ký tự."),
      TenSach: yup
        .string()
        .required("Tên sách phải có giá trị.")
        .min(2, "Tên sách phải ít nhất 2 ký tự.")
        .max(100, "Tên sách tối đa 100 ký tự."),
      TacGia: yup
        .string()
        .required("Tác giả phải có giá trị.")
        .max(100, "Tác giả tối đa 100 ký tự."),
      DonGia: yup
        .number()
        .typeError("Đơn giá phải là số.")
        .required("Đơn giá phải có giá trị.")
        .min(0, "Đơn giá không được âm."),
      SoQuyen: yup
        .number()
        .typeError("Số quyển phải là số.")
        .required("Số quyển phải có giá trị.")
        .integer("Số quyển phải là số nguyên.")
        .min(0, "Số quyển không được âm."),
      NamXuatBan: yup
        .number()
        .typeError("Năm xuất bản phải là số.")
        .required("Năm xuất bản phải có giá trị.")
        .integer("Năm xuất bản phải là số nguyên.")
        .min(1900, "Năm xuất bản phải từ 1900.")
        .max(namHienTai, "Năm xuất bản không được lớn hơn năm hiện tại."),
      MaNXB: yup.string().required("Phải chọn nhà xuất bản."),
    });

    return {
      // Không hiệu chỉnh trực tiếp props, nên tạo biến cục bộ để bind vào form
      sachLocal: this.sach,
      sachFormSchema,
    };
  },
  methods: {
    submitSach() {
      // input type=number trả về chuỗi, phải ép về số trước khi gửi lên server
      const data = {
        ...this.sachLocal,
        DonGia: Number(this.sachLocal.DonGia),
        SoQuyen: Number(this.sachLocal.SoQuyen),
        NamXuatBan: Number(this.sachLocal.NamXuatBan),
      };
      this.$emit("submit:sach", data);
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
