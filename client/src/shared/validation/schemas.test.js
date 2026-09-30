import { describe, expect, it } from "vitest";
import { profileSchema, registerSchema, postSchema } from "./schemas";

describe("form şemaları", () => {
  it("kayıtta admin rolüne izin vermez ve e-postayı normalize eder", () => {
    const base = { name: "Ali", surname: "Kaya", email: " ALI@Ornek.com ", password: "gizli-sifre" };

    expect(registerSchema.safeParse({ ...base, role: "admin" }).success).toBe(false);
    expect(registerSchema.parse({ ...base, role: "satici" }).email).toBe("ali@ornek.com");
  });

  it("e-posta değişince mevcut şifre ister", () => {
    const values = {
      name: "Ali",
      surname: "Kaya",
      province: "",
      district: "",
      email: "yeni@ornek.com",
      originalEmail: "eski@ornek.com",
      currentPassword: "",
    };

    const result = profileSchema.safeParse(values);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toEqual(["currentPassword"]);
    expect(profileSchema.safeParse({ ...values, currentPassword: "x" }).success).toBe(true);
  });

  it("gönderi başlığı sınırını uygular", () => {
    expect(postSchema.safeParse({ title: "a".repeat(121), category: "bal" }).success).toBe(false);
    expect(postSchema.safeParse({ title: "Bal", category: "silah" }).success).toBe(false);
  });
});
