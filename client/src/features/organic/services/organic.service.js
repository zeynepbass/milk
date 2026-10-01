import { organicRepository } from "../repositories/organic.repository";

export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

const DOCUMENT_URL_LIFETIME_MS = 60 * 1000;

export const validateDocument = (file) => {
  if (!file) return "Belge seçilmedi";
  if (file.type !== "application/pdf") return "Sadece PDF belgeler yüklenebilir";
  if (file.size > MAX_DOCUMENT_SIZE) return "Belge en fazla 10 MB olabilir";
  return null;
};

export const organicService = {
  submit(file) {
    const formData = new FormData();
    formData.append("document", file);
    return organicRepository.submit(formData);
  },

  getMine: async () => (await organicRepository.getMine()).application,

  list: ({ status, cursor } = {}) =>
    organicRepository.list(
      Object.fromEntries(Object.entries({ status, cursor }).filter(([, value]) => value))
    ),

  review: (applicationId, { decision, note }) =>
    organicRepository.review(applicationId, note ? { decision, note } : { decision }),

  async openDocument(applicationId) {
    const blob = await organicRepository.getDocument(applicationId);
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), DOCUMENT_URL_LIFETIME_MS);
  },
};
