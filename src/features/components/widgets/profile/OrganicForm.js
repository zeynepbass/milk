import {ArrowRightIcon } from "@heroicons/react/24/outline";
export const OrganicForm = () => {
  const handleImages = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    // setProfileForm((prev) => ({
    //   ...prev,
    //   avatar: imageUrl,
    // }));
  };
  return (
    <div className="">
      <form
        // onSubmit={handleSubmit}
        className="w-full mx-auto bg-white shadow-lg rounded-2xl p-8  m-2"
      >
        <input
          type="file"
          multiple
          onChange={handleImages}
          className="w-full"
        />

        <div className="flex justify-end">
        <button
          type="submit"

          className="bg-[rgb(137,205,251)] text-white p-3 rounded-full"
        >
 <ArrowRightIcon className="w-4 h-4" />
        </button>
        </div>
      </form>
    </div>
  );
};
