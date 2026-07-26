<template>
  <Form @submit="submitDocGia" :validation-schema="docGiaFormSchema">
    <div class="form-group">
      <label for="MaDocGia">Mã độc giả</label>
      <Field
        name="MaDocGia"
        type="text"
        class="form-control"
        v-model="docGiaLocal.MaDocGia"
      />
      <ErrorMessage name="MaDocGia" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="HoLot">Họ lót</label>
      <Field
        name="HoLot"
        type="text"
        class="form-control"
        v-model="docGiaLocal.HoLot"
      />
      <ErrorMessage name="HoLot" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="Ten">Tên</label>
      <Field
        name="Ten"
        type="text"
        class="form-control"
        v-model="docGiaLocal.Ten"
      />
      <ErrorMessage name="Ten" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="NgaySinh">Ngày sinh</label>
      <Field
        name="NgaySinh"
        type="date"
        class="form-control"
        v-model="docGiaLocal.NgaySinh"
      />
      <ErrorMessage name="NgaySinh" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="Phai">Phái</label>
      <Field
        name="Phai"
        as="select"
        class="form-control"
        v-model="docGiaLocal.Phai"
      >
        <option value="Nam">Nam</option>
        <option value="Nu">Nữ</option>
      </Field>
      <ErrorMessage name="Phai" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="DiaChi">Địa chỉ</label>
      <Field
        name="DiaChi"
        type="text"
        class="form-control"
        v-model="docGiaLocal.DiaChi"
      />
      <ErrorMessage name="DiaChi" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="DienThoai">Điện thoại</label>
      <Field
        name="DienThoai"
        type="tel"
        class="form-control"
        v-model="docGiaLocal.DienThoai"
      />
      <ErrorMessage name="DienThoai" class="error-feedback" />
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
  emits: ["submit:docgia", "cancel"],
  props: {
    docGia: { type: Object, required: true },
  },
  data() {
    const docGiaFormSchema = yup.object().shape({
      MaDocGia: yup
        .string()
        .required("Mã độc giả phải có giá trị.")
        .max(20, "Mã độc giả tối đa 20 ký tự."),
      HoLot: yup.string().max(50, "Họ lót tối đa 50 ký tự."),
      Ten: yup
        .string()
        .required("Tên phải có giá trị.")
        .max(50, "Tên tối đa 50 ký tự."),
      NgaySinh: yup
        .date()
        .typeError("Ngày sinh không hợp lệ.")
        .required("Ngày sinh phải có giá trị.")
        .max(new Date(), "Ngày sinh không được là ngày trong tương lai."),
      Phai: yup.string().required("Phải chọn phái."),
      DiaChi: yup.string().max(200, "Địa chỉ tối đa 200 ký tự."),
      DienThoai: yup
        .string()
        .required("Điện thoại phải có giá trị.")
        .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          "Số điện thoại không hợp lệ."
        ),
    });

    return {
      docGiaLocal: this.docGia,
      docGiaFormSchema,
    };
  },
  methods: {
    submitDocGia() {
      this.$emit("submit:docgia", this.docGiaLocal);
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
