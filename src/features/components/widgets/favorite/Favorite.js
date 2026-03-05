import Card from "../section/card";
import usePost from "../../../hooks/feed/posts/usePost";
import { useEffect } from "react";
export function Favorite() {
  const { favourite, fetchSavedPosts } = usePost();
  useEffect(() => {
    fetchSavedPosts();
  }, []);
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card data={favourite} />
    </div>
  );
}
