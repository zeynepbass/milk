import { PencilIcon, UserIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../section/card/index";
import usePost from "features/hooks/feed/user/useUserPost";
import useUserLogin from "features/hooks/user/useUser";
import { CreatePostForm } from ".";
import useCommentAll from "../../../hooks/feed/comments/useComments";
import usePostAll from "../../../hooks/feed/posts/usePost";
export function Profile() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const handleShowed = (id) => {
    setSelected((prev) => (prev === id ? null : id));

  };

  const {
    getProfile,
    profile,
    showFreezeModal,
    setShowFreezeModal,
    open,
    setOpen,
  } = useUserLogin();
  const { followId, refresh, openList, setOpenList } = usePostAll();
  const {
    details,
    loading,
    onSubmit,
    form,
    setForm,
    deleted,
    handlePostLike,
    handlePostSave,
    handleUpdated,
    button,
    user,
  } = usePost();
  const {
    handleComment,
    handleDelete,
    handleC0mmentLike,
    comments
  } = useCommentAll(selected);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    getProfile();
  }, [refresh]);
  return (
    <div className="grid grid-cols-12 h-[100vh]">
      <div className="col-span-4 overflow-hidden relative p-6 border-r border-gray-100">
        <button className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
          <button onClick={() => handleUpdated()}>
            <PencilIcon className="w-5 h-5 text-gray-500" />
          </button>
        </button>

        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-4xl font-bold shadow">
            <UserIcon className="w-12 h-12" />
          </div>
        </div>

        <div className="flex justify-center space-x-2 mt-3">
          <h2 className="text-xl font-bold text-gray-700">{profile?.name}</h2>
          <h2 className="text-xl font-bold text-gray-700">
            {profile?.surname}
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          <input
            type="email"
            value={profile?.email}
            placeholder="Email"
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)]"
          />
          <input
            type="text"
            value={profile?.role}
            placeholder="Role"
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[rgb(82,144,246)]"
          />
        </div>

        <div className="flex justify-center mt-4 space-x-6 text-gray-700 font-medium">
          <div
            onClick={() => setOpenList("following")}
            className="flex items-center space-x-1 cursor-pointer hover:text-blue-500"
          >
            <span>{profile?.following?.length}</span>
            <span>Takip</span>
          </div>

          <div
            onClick={() => setOpenList("followers")}
            className="flex items-center space-x-1 cursor-pointer hover:text-blue-500"
          >
            <span>{profile?.followers?.length}</span>
            <span>Takipçi</span>
          </div>
        </div>
        {openList && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-[400px] max-h-[500px] rounded-2xl shadow-2xl p-6 relative overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {openList === "following" ? "Takip Ettiklerin" : "Takipçiler"}
                </h2>

                <button
                  onClick={() => setOpenList(null)}
                  className="text-gray-500 hover:text-red-500 text-xl"
                >
                  ×
                </button>
              </div>

              {(openList === "followers"
                ? profile?.followers
                : profile?.following
              )?.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center py-3 border-b"
                >
                  <span className="font-medium">
                    {user.name} {user.surname}
                  </span>

                  {(openList === "followers" || openList === "following") && (
                    <span
                      onClick={() => followId(user._id)}
                      className="text-sm cursor-pointer font-medium transition hover:underline text-blue-500"
                    >
                      {openList === "followers" ? "Takip Et" : "Takipten Çık"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          {button && (
            <button
              type="submit"
              className="mt-1 w-full rounded-md bg-[rgb(137,205,251)]
hover:bg-gray-200
            py-2.5 text-sm font-semibold text-white  transition"
            >
              Kaydet
            </button>
          )}
        </div>
      </div>

      <div className="col-span-8 p-6">
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
                ? "border-b-2 border-[rgb(82,144,246)] text-[rgb(82,144,246)]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            Hesap Ayarları
          </button>

          <button
            type="submit"
            onClick={() => setOpen(true)}
            className="mb-2 w-1/4 ml-auto rounded-md py-2.5 text-sm font-semibold text-white transition bg-[rgb(137,205,251)] hover:bg-gray-200"
          >
            Gönderi Paylaş
          </button>
        </div>

        <div className="mt-4">
          {open && (
            <CreatePostForm
              onSubmit={onSubmit}
              form={form}
              setForm={setForm}
              setOpen={setOpen}
            />
          )}

          {activeTab === "posts" && (
            <div className="space-y-3">
              <Card
                data={details}
                loading={loading}
                selected={selected}
                handleShowed={handleShowed}
                user={user}
                handlePostSave={handlePostSave}
                handlePostLike={handlePostLike}
                handleComment={handleComment}
                handleDelete={handleDelete}
                handleC0mmentLike={handleC0mmentLike}
                comments={comments}
                deleted={deleted}
              />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-[rgb(246,246,246)]">
                <h3 className="font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-2">
                  Hesabı Dondur
                </h3>
                <p className="text-gray-700 mb-2">
                  Hesabınızı geçici olarak dondurabilirsiniz. Bu işlem sonrası
                  hesabınıza giriş yapılamaz.
                </p>
                <button
                  onClick={() => setShowFreezeModal(true)}
                  className=" text-yellow-400 underline transition font-medium"
                >
                  Hesabı Dondur
                </button>
              </div>

              <div className="p-4 border rounded-lg bg-[rgb(246,246,246)]">
                <h3 className="font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-2">
                  Hesabı Sil
                </h3>
                <p className="text-gray-700 mb-2">
                  Hesabınızı silerseniz tüm bilgileriniz kalıcı olarak
                  silinecektir. Bu işlemi geri alamazsınız.
                </p>
                <button
                  onClick={() => navigate("/uye-ol")}
                  className=" text-red-500 underline transition font-medium"
                >
                  Hesabı Sil
                </button>
              </div>
            </div>
          )}
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
                  onClick={() => {
                    setShowFreezeModal(false);
                    alert("Hesap donduruldu!");
                  }}
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
