import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const API = "http://localhost:5346/api";

export const server = setupServer();

export { http, HttpResponse };

export const page = (items, nextCursor = null) => ({ items, nextCursor });

export const buildPost = (overrides = {}) => ({
  _id: "post-1",
  title: "Taze süt",
  description: "Sabah sağımı",
  images: [],
  category: "sut_urunleri",
  likesCount: 2,
  savesCount: 0,
  likedByMe: false,
  savedByMe: false,
  isFollowingAuthor: false,
  createdAt: "2026-09-30T10:00:00.000Z",
  user: { _id: "seller-1", name: "Mehmet", surname: "Demir", role: "satici", dogrulanmisSatici: true },
  ...overrides,
});

export const buildUser = (overrides = {}) => ({
  _id: "me-1",
  name: "Ayşe",
  surname: "Kaya",
  email: "ayse@ornek.com",
  role: "alici",
  followersCount: 0,
  followingCount: 0,
  ...overrides,
});
