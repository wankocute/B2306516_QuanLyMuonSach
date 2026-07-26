<template>
  <Form @submit="submitNhaXuatBan" :validation-schema="nxbFormSchema">
    <div class="form-group">
      <label for="MaNXB">Mã NXB</label>
      <Field
        name="MaNXB"
        type="text"
        class="form-control"
        v-model="nxbLocal.MaNXB"
      />
      <ErrorMessage name="MaNXB" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="TenNXB">Tên NXB</label>
      <Field
        name="TenNXB"
        type="text"
        class="form-control"
        v-model="nxbLocal.TenNXB"
      />
      <ErrorMessage name="TenNXB" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="DiaChi">Địa chỉ</label>
      <Field
        name="DiaChi"
        type="text"
        class="form-control"
        v-model="nxbLocal.DiaChi"
      />
      <ErrorMessage name="DiaChi" class="error-feedback" />
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
  emits: ["submit:nhaxuatban", "cancel"],
  props: {
    nhaXuatBan: { type: Object, required: true },
  },
  data() {
    const nxbFormSchema = yup.object().shape({
      MaNXB: yup
        .string()
        .required("Mã NXB phải có giá trị.")
        .max(20, "Mã NXB tối đa 20 ký tự."),
      TenNXB: yup
        .string()
        .required("Tên NXB phải có giá trị.")
        .min(2, "Tên NXB phải ít nhất 2 ký tự.")
        .max(100, "Tên NXB tối đa 100 ký tự."),
      DiaChi: yup.string().max(200, "Địa chỉ tối đa 200 ký tự."),
    });

    return {
      nxbLocal: this.nhaXuatBan,
      nxbFormSchema,
    };
  },
  methods: {
    submitNhaXuatBan() {
      this.$emit("submit:nhaxuatban", this.nxbLocal);
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
