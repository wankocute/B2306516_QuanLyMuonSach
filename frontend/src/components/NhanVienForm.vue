<template>
  <Form @submit="submitNhanVien" :validation-schema="nhanVienFormSchema">
    <div class="form-group">
      <label for="MSNV">MSNV</label>
      <Field
        name="MSNV"
        type="text"
        class="form-control"
        v-model="nhanVienLocal.MSNV"
      />
      <ErrorMessage name="MSNV" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="HoTenNV">Họ tên</label>
      <Field
        name="HoTenNV"
        type="text"
        class="form-control"
        v-model="nhanVienLocal.HoTenNV"
      />
      <ErrorMessage name="HoTenNV" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="Password">
        Mật khẩu
        <small v-if="!laThemMoi" class="text-muted">
          (bỏ trống nếu không đổi)
        </small>
      </label>
      <Field
        name="Password"
        type="password"
        class="form-control"
        v-model="nhanVienLocal.Password"
      />
      <ErrorMessage name="Password" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="ChucVu">Chức vụ</label>
      <Field
        name="ChucVu"
        as="select"
        class="form-control"
        v-model="nhanVienLocal.ChucVu"
      >
        <option value="Nhân viên">Nhân viên</option>
        <option value="Quản lý">Quản lý</option>
      </Field>
      <ErrorMessage name="ChucVu" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="DiaChi">Địa chỉ</label>
      <Field
        name="DiaChi"
        type="text"
        class="form-control"
        v-model="nhanVienLocal.DiaChi"
      />
      <ErrorMessage name="DiaChi" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="SoDienThoai">Số điện thoại</label>
      <Field
        name="SoDienThoai"
        type="tel"
        class="form-control"
        v-model="nhanVienLocal.SoDienThoai"
      />
      <ErrorMessage name="SoDienThoai" class="error-feedback" />
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
  emits: ["submit:nhanvien", "cancel"],
  props: {
    nhanVien: { type: Object, required: true },
  },
  data() {
    const laThemMoi = !this.nhanVien._id;

    // Thêm mới: bắt buộc nhập mật khẩu.
    // Sửa: bỏ trống là giữ mật khẩu cũ, nhưng nếu có nhập thì phải đủ 6 ký tự.
    let luatPassword;
    if (laThemMoi) {
      luatPassword = yup
        .string()
        .required("Phải nhập mật khẩu cho nhân viên mới.")
        .min(6, "Mật khẩu phải ít nhất 6 ký tự.");
    } else {
      luatPassword = yup
        .string()
        .test(
          "do-dai-mat-khau",
          "Mật khẩu phải ít nhất 6 ký tự.",
          (value) => !value || value.length >= 6
        );
    }

    const nhanVienFormSchema = yup.object().shape({
      MSNV: yup
        .string()
        .required("MSNV phải có giá trị.")
        .max(20, "MSNV tối đa 20 ký tự."),
      HoTenNV: yup
        .string()
        .required("Họ tên phải có giá trị.")
        .min(2, "Họ tên phải ít nhất 2 ký tự.")
        .max(100, "Họ tên tối đa 100 ký tự."),
      Password: luatPassword,
      ChucVu: yup.string().required("Phải chọn chức vụ."),
      DiaChi: yup.string().max(200, "Địa chỉ tối đa 200 ký tự."),
      SoDienThoai: yup
        .string()
        .required("Số điện thoại phải có giá trị.")
        .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          "Số điện thoại không hợp lệ."
        ),
    });

    return {
      nhanVienLocal: this.nhanVien,
      nhanVienFormSchema,
      laThemMoi,
    };
  },
  methods: {
    submitNhanVien() {
      const data = { ...this.nhanVienLocal };
      // Sửa mà bỏ trống mật khẩu thì không gửi field này lên server
      if (data._id && !data.Password) {
        delete data.Password;
      }
      this.$emit("submit:nhanvien", data);
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
