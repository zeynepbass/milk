import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Input } from "@/shared/components/atoms";
import { LoadMore, QueryState } from "@/shared/components/molecules";
import { flattenPages } from "@/shared/query/infinite";
import { commentSchema } from "@/shared/validation/schemas";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useAddComment, useCommentLike, useComments, useDeleteComment } from "../../hooks/useComments";
import { CommentItem } from "../CommentItem";

export function CommentsPanel({ postId }) {
  const { data: me } = useCurrentUser();
  const query = useComments(postId);
  const addComment = useAddComment(postId);
  const likeComment = useCommentLike(postId);
  const deleteComment = useDeleteComment(postId);
  const comments = flattenPages(query.data);

  const { register, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: "" },
  });

  const onSubmit = ({ text }) => {
    addComment.mutate(text);
    reset();
  };

  return (
    <section aria-label="Yorumlar" className="bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
      <QueryState
        query={query}
        isEmpty={comments.length === 0}
        empty={<p className="text-gray-500 text-sm italic text-center py-4">Henüz yorum yok</p>}
      >
        <ul className="space-y-4 max-h-60 overflow-y-auto mb-4 pr-1">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              isOwner={comment.user?._id === me?._id}
              onLike={() => likeComment.mutate({ commentId: comment._id, liked: !comment.likedByMe })}
              onDelete={() => deleteComment.mutate(comment._id)}
            />
          ))}
        </ul>
        <LoadMore query={query} label="Önceki yorumlar" />
      </QueryState>

      <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2 border-t dark:border-gray-700 pt-3">
        <Input
          {...register("text")}
          label="Yorum"
          placeholder="Yorum yap..."
          autoComplete="off"
          error={formState.errors.text?.message}
          wrapperClassName="flex-1 min-w-0 [&_label]:sr-only"
          className="rounded-full"
        />
        <button
          type="submit"
          aria-label="Yorumu gönder"
          className="rounded-full p-3 bg-[rgb(82,144,246)] dark:bg-gray-900 text-white"
        >
          <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
