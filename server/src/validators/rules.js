export const RULES = Object.freeze({
  name: { min: 1, max: 50 },
  password: { min: 8, maxBytes: 72 },
  location: { max: 60 },
  organic: { max: 500 },
  postTitle: { min: 1, max: 120 },
  postDescription: { max: 2000 },
  postImages: { max: 5 },
  comment: { min: 1, max: 500 },
  message: { min: 1, max: 2000 },
  feedback: { min: 1, max: 2000 },
  searchTitle: { max: 100 },
  pageSize: { default: 20, max: 50 },
});

export const ROLES = Object.freeze(["alici", "satici", "admin"]);
export const SELF_ASSIGNABLE_ROLES = Object.freeze(["alici", "satici"]);
export const POST_CATEGORIES = Object.freeze([
  "sut_urunleri",
  "bal",
  "zeytinyagi",
  "peynir",
  "sebze",
  "meyve",
]);
export const FEEDBACK_TYPES = Object.freeze(["genel", "hata", "talep"]);
