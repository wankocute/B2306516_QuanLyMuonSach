import createApiClient from "./api.service";

class TheoDoiMuonSachService {
  constructor(baseUrl = "/api/theodoimuonsach") {
    this.api = createApiClient(baseUrl);
  }
  async getAll(trangThai) {
    const url = trangThai ? `/?trangThai=${trangThai}` : "/";
    return (await this.api.get(url)).data;
  }
  async muonSach(data) {
    return (await this.api.post("/", data)).data;
  }
  async traSach(id) {
    return (await this.api.put(`/${id}/tra`)).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new TheoDoiMuonSachService();
