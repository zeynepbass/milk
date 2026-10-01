import { organicApi } from "../api/organic.api";

const unwrap = async (request) => (await request).data;

export const organicRepository = {
  submit: (formData) => unwrap(organicApi.submit(formData)),
  getMine: () => unwrap(organicApi.getMine()),
  list: (params) => unwrap(organicApi.list(params)),
  review: (applicationId, body) => unwrap(organicApi.review(applicationId, body)),
  getDocument: (applicationId) => unwrap(organicApi.getDocument(applicationId)),
};
