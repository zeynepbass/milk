import { expect, test } from "@playwright/test";

const stamp = Date.now();
const seller = {
  name: "Mehmet",
  surname: "Demir",
  email: `satici-${stamp}@ornek.com`,
  password: "sifre12345",
  role: "satici",
};
const buyer = {
  name: "Ayşe",
  surname: "Kaya",
  email: `alici-${stamp}@ornek.com`,
  password: "sifre12345",
  role: "alici",
};

const screenshot = (page, name) => page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage: false });

const registerAndLogin = async (page, account) => {
  await page.goto("/uye-ol");
  await page.getByLabel("Ad", { exact: true }).fill(account.name);
  await page.getByLabel("Soyad").fill(account.surname);
  await page.getByLabel("E-posta").fill(account.email);
  await page.getByLabel("Parola").fill(account.password);
  await page.getByLabel("Üyelik türü").selectOption(account.role);
  await page.getByRole("button", { name: "Üye Ol" }).click();

  await expect(page).toHaveURL(/\/giris-yap$/);
  await page.getByLabel("E-posta").fill(account.email);
  await page.getByLabel("Parola").fill(account.password);
  await page.getByRole("button", { name: "Giriş Yap" }).click();
  await expect(page.getByRole("navigation", { name: "Ana gezinme" })).toBeVisible();
};

test("satıcı paylaşır, alıcı takip edip etkileşir, bildirim ve mesajlaşma anlık çalışır", async ({
  browser,
}) => {
  const sellerContext = await browser.newContext();
  const buyerContext = await browser.newContext();
  const sellerPage = await sellerContext.newPage();
  const buyerPage = await buyerContext.newPage();

  await registerAndLogin(sellerPage, seller);

  await sellerPage.goto("/profil");
  await sellerPage.getByRole("button", { name: "Gönderi paylaş" }).click();
  const dialog = sellerPage.getByRole("dialog", { name: "Yeni Gönderi Oluştur" });
  await dialog.getByLabel("Başlık").fill("Köy sütü");
  await dialog.getByLabel("Açıklama").fill("Sabah sağımı, soğuk zincirle teslim.");
  await dialog.getByLabel("Kategori").selectOption("sut_urunleri");
  await dialog.getByLabel("İl", { exact: true }).fill("İzmir");
  await dialog.locator('input[type="file"]').setInputFiles("client/public/assets/wallpaper.png");
  await dialog.getByRole("button", { name: "Paylaş" }).click();
  await expect(dialog).toBeHidden();
  await expect(sellerPage.getByRole("link", { name: "Köy sütü" })).toBeVisible();
  await screenshot(sellerPage, "profil");

  await registerAndLogin(buyerPage, buyer);
  await buyerPage.goto("/kesfet");
  const card = buyerPage.getByRole("article").filter({ hasText: "Köy sütü" });
  await expect(card).toBeVisible();

  await card.getByRole("button", { name: "Mehmet Demir takip et" }).click();
  await expect(card.getByRole("button", { name: "Mehmet Demir takipten çık" })).toBeVisible();

  await card.getByRole("button", { name: "Beğen" }).click();
  await expect(card.getByRole("button", { name: "Beğeniyi geri al" })).toContainText("1");

  await card.getByRole("button", { name: "Yorumlar" }).click();
  await card.getByRole("textbox", { name: "Yorum" }).fill("Harika görünüyor!");
  await card.getByRole("button", { name: "Yorumu gönder" }).click();
  await expect(card.getByText("Harika görünüyor!")).toBeVisible();
  await screenshot(buyerPage, "kesfet");

  const bell = sellerPage
    .getByRole("navigation", { name: "Ana gezinme" })
    .getByRole("button", { name: /okunmamış/ });
  await expect(bell).toHaveAccessibleName(/3 okunmamış/);
  await bell.click();
  await expect(sellerPage.getByText("Ayşe Kaya seni takip etmeye başladı")).toBeVisible();
  await expect(sellerPage.getByText("Ayşe Kaya gönderini beğendi")).toBeVisible();
  await expect(sellerPage.getByText("Ayşe Kaya gönderine yorum yaptı")).toBeVisible();
  await screenshot(sellerPage, "bildirimler");
  await sellerPage.keyboard.press("Escape");

  await buyerPage.goto("/kesfet");
  await buyerPage
    .getByRole("article")
    .filter({ hasText: "Köy sütü" })
    .getByRole("button", { name: "Mehmet Demir ile mesajlaş" })
    .click();
  await expect(buyerPage).toHaveURL(/\/mesajlar$/);
  const buyerChat = buyerPage.getByRole("region", { name: /ile sohbet$/ });
  await expect(buyerChat.getByText('"Köy sütü" hakkında bilgi alabilir miyim?')).toBeVisible();

  await sellerPage.goto("/mesajlar");
  await sellerPage
    .getByRole("navigation", { name: "Sohbetler" })
    .getByRole("button", { name: /Ayşe Kaya/ })
    .click();
  const sellerChat = sellerPage.getByRole("region", { name: /ile sohbet$/ });
  await expect(sellerChat.getByText('"Köy sütü" hakkında bilgi alabilir miyim?')).toBeVisible();
  await sellerPage.getByRole("textbox", { name: "Mesaj" }).fill("Evet, bu sabah sağıldı.");
  await sellerPage.getByRole("button", { name: "Gönder" }).click();

  await expect(buyerChat.getByText("Evet, bu sabah sağıldı.")).toBeVisible();
  await expect(sellerChat.getByText(/Okundu/).last()).toBeVisible();
  await screenshot(buyerPage, "mesajlar");

  await sellerContext.close();
  await buyerContext.close();
});

test("oturum yenilemesi sayfa yenilendiğinde kullanıcıyı içeride tutar", async ({ page }) => {
  const account = { ...buyer, email: `yenileme-${stamp}@ornek.com` };
  await registerAndLogin(page, account);

  await page.reload();
  await expect(page.getByRole("navigation", { name: "Ana gezinme" })).toBeVisible();
  expect(await page.evaluate(() => window.localStorage.getItem("auth-storage"))).toBeNull();

  await page.getByRole("button", { name: "Kullanıcı menüsü" }).click();
  await page.getByRole("menuitem", { name: "Çıkış yap" }).click();
  await expect(page).toHaveURL(/\/giris-yap$/);

  await page.goto("/profil");
  await expect(page).toHaveURL(/\/giris-yap$/);
});

test("satıcı organik sertifika başvurusu yapar, yönetici onaylar, satıcı rozet ve bildirim alır", async ({
  browser,
}) => {
  const sellerContext = await browser.newContext();
  const adminContext = await browser.newContext();
  const sellerPage = await sellerContext.newPage();
  const adminPage = await adminContext.newPage();
  const organicSeller = { ...seller, email: `organik-${stamp}@ornek.com` };

  await registerAndLogin(sellerPage, organicSeller);
  await sellerPage.goto("/profil");
  await sellerPage.getByRole("tab", { name: "Organik Sertifika" }).click();
  await sellerPage.locator('input[type="file"][accept="application/pdf"]').setInputFiles({
    name: "sertifika.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from(
      "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n"
    ),
  });
  await sellerPage.getByRole("button", { name: "Başvur" }).click();
  await expect(sellerPage.getByText("Başvurun inceleniyor")).toBeVisible();

  await adminPage.goto("/giris-yap");
  await adminPage.getByLabel("E-posta").fill("admin@milk.demo");
  await adminPage.getByLabel("Parola").fill("Demo12345!");
  await adminPage.getByRole("button", { name: "Giriş Yap" }).click();
  await adminPage
    .getByRole("navigation", { name: "Ana gezinme" })
    .getByRole("link", { name: "Yönetim" })
    .click();

  const application = adminPage.getByRole("article", { name: "Mehmet Demir" });
  await expect(application).toBeVisible();
  await screenshot(adminPage, "yonetim");
  await application.getByRole("button", { name: "Onayla" }).click();
  await expect(application).toBeHidden();

  const bell = sellerPage
    .getByRole("navigation", { name: "Ana gezinme" })
    .getByRole("button", { name: /okunmamış/ });
  await expect(bell).toHaveAccessibleName(/1 okunmamış/);

  await sellerPage.reload();
  await sellerPage.getByRole("tab", { name: "Organik Sertifika" }).click();
  await expect(sellerPage.getByText("Doğrulanmış satıcısın")).toBeVisible();
  await expect(
    sellerPage.getByRole("region", { name: "Profil" }).getByLabel("Doğrulanmış satıcı")
  ).toBeVisible();

  await sellerContext.close();
  await adminContext.close();
});
