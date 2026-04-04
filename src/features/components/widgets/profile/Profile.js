import { useEffect, useState } from "react";
import { useSearchStore } from "@/store";
import useCommentAll from "@/features/hooks/feed/comments/useComments";
import useProfile from "@/features/hooks/user/useUser";
import usePostAll from "@/features/hooks/feed/posts/usePost";
import usePost from "@/features/hooks/feed/user/useUserPost";
import Card from "../section/card/index";
import { CreatePostForm } from "./Form";
import { SalesSupport } from "./SalesSupport";
import { OrganicForm } from "./OrganicForm";
import {
  PencilIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { CheckBadgeIcon } from "@heroicons/react/24/solid";
export function Profile() {
  const [selected, setSelected] = useState(null);
  const handleShowed = (id) => {
    setSelected((prev) => (prev === id ? null : id));
  };
  const setSearch = useSearchStore((state) => state.setSearch);
  const {
    getProfile,
    profileForm,
    profile,
    button,
    loading,
    handleUpdated,
    showFreezeModal,
    setShowFreezeModal,
    createOpen,
    setProfileForm,
    createSetOpen,
    setButton,
    freezeProfile,
    deleteProfile,
    userUpdated,
  } = useProfile();

  const { followId, openList, setOpenList, open, setOpen } = usePostAll();
  const {
    details,
    onSubmit,
    form,
    setForm,
    handlePostLike,
    editPostId,
    deleted,
    setEditPostId,
    handlePostSave,
    user,
  } = usePost();

  const { handleComment, handleDelete, handleC0mmentLike, comments } =
    useCommentAll(selected);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    getProfile();
  }, []);
  const handleImages = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };
  const handleChange = (e) => {
    setProfileForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const [input, setInput] = useState("");

  return (
    <div className="grid grid-cols-12 h-[100vh] overflow-scroll p-4 ">
      <div className="col-span-12 md:col-span-4">
        <div className="bg-white rounded-2xl shadow-md p-6 relative">
          <button
            onClick={() => setButton(!button)}
            className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
          >
            <PencilIcon className="w-4 h-4 text-gray-500" />
          </button>

          {button ? (
            <>
              <div className="flex justify-center">
                <div className="relative w-24 h-24">
                  <img
                    src={
                      profileForm?.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/9131/9131478.png"
                    }
                    className="w-24 h-24 rounded-full object-cover"
                  />

                  {profileForm?.dogrulanmisSatici && (
                    <CheckBadgeIcon className="absolute -top-1 -right-1 w-6 h-6 text-blue-500 bg-white rounded-full" />
                  )}
                </div>
              </div>
              <div className="text-center m-4">
                <h2 className="font-semibold text-lg">
                  {profileForm?.name} {profileForm?.surname}
                </h2>
                <p className="text-gray-400 text-sm capitalize">
                  {profileForm?.role}
                </p>
              </div>
              <hr />
              <div className="flex justify-center gap-8 mt-4 text-sm">
                <div
                  className="cursor-pointer"
                  onClick={() => setOpenList("following")}
                >
                  <p className="font-semibold text-center">
                    {profileForm?.following?.length || 0}
                  </p>
                  <p className="text-gray-400">Takip</p>
                </div>

                <div
                  className="cursor-pointer"
                  onClick={() => setOpenList("followers")}
                >
                  <p className="font-semibold text-center">
                    {profileForm?.followers?.length || 0}
                  </p>
                  <p className="text-gray-400">Takipçi</p>
                </div>
              </div>{" "}
            </>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <label className="relative cursor-pointer group">
                  <img
                    src={
                      profileForm?.avatar
                        ? profileForm.avatar
                        : "https://cdn-icons-png.flaticon.com/512/9131/9131478.png"
                    }
                    alt="profile"
                    className="w-28 h-28 rounded-full object-cover border shadow-sm"
                  />

                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    <span className="text-white text-xs">Değiştir</span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImages}
                    className="hidden"
                  />
                </label>

                <p className="text-sm text-gray-400 mt-2">
                  Profil fotoğrafını güncelle
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <input
                  type="text"
                  name="name"
                  value={profileForm?.name || ""}
                  onChange={handleChange}
                  placeholder="Ad"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[rgb(82,144,246)] outline-none"
                />

                <input
                  type="text"
                  name="surname"
                  value={profileForm?.surname || ""}
                  onChange={handleChange}
                  placeholder="Soyad"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[rgb(82,144,246)] outline-none"
                />

                <input
                  type="text"
                  name="province"
                  value={profileForm?.province || ""}
                  onChange={handleChange}
                  placeholder="İl"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[rgb(82,144,246)] outline-none"
                />

                <input
                  type="text"
                  name="district"
                  value={profileForm?.district || ""}
                  onChange={handleChange}
                  placeholder="İlçe"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[rgb(82,144,246)] outline-none"
                />

                <input
                  type="email"
                  name="email"
                  value={profileForm?.email || ""}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[rgb(82,144,246)] outline-none md:col-span-2"
                />

                <select
                  name="role"
                  value={profileForm?.role || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none md:col-span-2"
                >
                  <option value="">Seçiniz</option>
                  <option value="alici">Alıcı</option>
                  <option value="satici">Satıcı</option>
                </select>
              </div>

              <button
                onClick={handleUpdated}
                disabled={loading}
                className={`w-full mt-3 py-2.5 rounded-xl text-white font-medium transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[rgb(82,144,246)] hover:opacity-90"
                }`}
              >
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </>
          )}
          {openList && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              {" "}
              <div className="bg-white w-[400px] max-h-[500px] rounded-2xl shadow-2xl p-6 relative overflow-y-auto">
                {" "}
                <div className="flex justify-between items-center mb-4">
                  {" "}
                  <h2 className="text-lg font-semibold">
                    {" "}
                    {openList === "following"
                      ? "Takip Ettiklerin"
                      : "Takipçiler"}{" "}
                  </h2>{" "}
                  <button
                    onClick={() => setOpenList(null)}
                    className="text-gray-500 hover:text-red-500 text-xl"
                  >
                    {" "}
                    ×{" "}
                  </button>{" "}
                </div>{" "}
                {(openList === "followers"
                  ? profileForm?.followers
                  : profileForm?.following
                )?.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center py-3 border-b"
                  >
                    {" "}
                    <span className="font-medium">
                      {" "}
                      {user.name} {user.surname}{" "}
                    </span>{" "}
                    {(openList === "followers" || openList === "following") && (
                      <span
                        onClick={() => followId(user._id)}
                        className="text-sm cursor-pointer font-medium transition hover:underline text-blue-500"
                      >
                        {" "}
                        {openList === "followers"
                          ? "Takip Et"
                          : "Takipten Çık"}{" "}
                      </span>
                    )}{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>
          )}
        </div>
      </div>

      <div className="col-span-12 md:col-span-8 p-3 m-3 ">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "posts"
                ? "border-b-2 border-[rgb(82,144,246)] text-[rgb(82,144,246)]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Gönderiler
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "settings"
                ? "border-b-2 border-[rgb(82,144,246)] text-[rgb(82,144,246)] "
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("settings")}
            disabled={open}
          >
            Hesap Ayarları
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "organic"
                ? "border-b-2 border-[rgb(82,144,246)] text-[rgb(82,144,246)] "
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("organic")}
            disabled={open}
          >
            Organik Sertifika Yükle
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "backNotifications"
                ? "border-b-2 border-[rgb(82,144,246)] text-[rgb(82,144,246)] "
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("backNotifications")}
            disabled={open}
          >
            Geri Bildirim Gönder
          </button>
        </div>

        <div className="mt-4 ">
          {activeTab === "posts" && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 w-full lg:justify-end">
                <div className="relative w-full lg:w-1/3">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="text"
                    value={input}
                    placeholder="Ürün, kategori veya ilçe ara…"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setSearch(input);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 text-sm 
    rounded-xl border border-gray-100 
    bg-gray-50 
    focus:bg-white focus:ring-2 focus:ring-[rgb(82,144,246)] 
    transition-all"
                  />
                </div>
              </div>
              {createOpen && (
                <CreatePostForm
                  onSubmit={onSubmit}
                  profileForm={profileForm}
                  form={form}
                  setForm={setForm}
                  setOpen={createSetOpen}
                />
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                  Yükleniyor...
                </div>
              )}

              {!loading && details.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center mt-5 px-6">
                  <img
                    src="/images/gonderi-bulunamadi.png"
                    alt="Gönderi bulunamadı"
                    className="w-44 h-44 object-contain opacity-80 mb-4"
                  />

                  <h2 className="text-lg font-semibold text-gray-700">
                    Gönderi Bulunamadı
                  </h2>

                  <p className="text-gray-400 text-sm mt-1 mb-5 max-w-xs">
                    Henüz paylaşılmış bir gönderi bulunamadı. İlk gönderiyi sen
                    oluşturabilirsin.
                  </p>

                  <button
                    onClick={() => createSetOpen(true)}
                    className="
             px-5 py-2
             rounded-xl
             bg-[rgb(82,144,246)] text-white
             font-medium
             shadow-sm
             hover:shadow-md
             hover:scale-105
             active:scale-95
             transition-all
           "
                  >
                    Gönderi Paylaş
                  </button>
                </div>
              )}

              <Card
                data={details || []}
                loading={loading}
                editPostId={editPostId}
                selected={selected}
                handleShowed={handleShowed}
                profileForm={profile || ""}
                handlePostSave={handlePostSave}
                handlePostLike={handlePostLike}
                handleComment={handleComment}
                handleDelete={handleDelete}
                handleC0mmentLike={handleC0mmentLike}
                comments={comments}
                deleted={deleted}
                open={open}
                setOpen={setOpen}
                setEditPostId={setEditPostId}
              />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Hesabı Dondur
                </h3>

                <p className="text-gray-400 text-sm mb-4">
                  Hesabınızı geçici olarak dondurabilirsiniz. Bu işlem sonrası
                  giriş yapamazsınız.
                </p>

                <button
                  onClick={() => setShowFreezeModal(true)}
                  className="text-[rgb(82,144,246)] font-medium hover:underline"
                >
                  Hesabı Dondur
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 hover:shadow-md transition">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Hesabı Sil
                </h3>

                <p className="text-gray-400 text-sm mb-4">
                  Hesabınızı silerseniz tüm bilgileriniz kalıcı olarak silinir.
                </p>

                <button
                  onClick={() => deleteProfile(user?.id)}
                  className="text-red-500 font-medium hover:underline"
                >
                  Hesabı Sil
                </button>
              </div>
            </div>
          )}
          {activeTab === "organic" && <OrganicForm userUpdated={userUpdated} />}
          {activeTab === "backNotifications" && <SalesSupport />}
        </div>

        {showFreezeModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg space-y-4">
              <h2 className="text-xl font-bold text-gray-700">Hesabı Dondur</h2>
              <p className="text-gray-500">
                Hesabınızı gerçekten dondurmak istiyor musunuz? Bu işlem geçici
                olarak hesabınızı devre dışı bırakır.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowFreezeModal(false)}
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={freezeProfile}
                  className="px-4 py-2 rounded-full bg-[#B38471] text-white hover:bg-[#ce9b87] transition font-medium"
                >
                  Onayla
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
