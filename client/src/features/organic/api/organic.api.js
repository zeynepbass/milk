import apiClient from "@/shared/api/apiClient";

const BASE = "/organic-applications";

export const organicApi = {
  submit: (formData) => apiClient.post(BASE, formData),
  getMine: () => apiClient.get(`${BASE}/mine`),
  list: (params) => apiClient.get(BASE, { params }),
  review: (applicationId, body) => apiClient.patch(`${BASE}/${applicationId}`, body),
  getDocument: (applicationId) =>
    apiClient.get(`${BASE}/${applicationId}/document`, { responseType: "blob" }),
};
