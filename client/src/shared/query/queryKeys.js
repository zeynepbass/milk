export const queryKeys = {
  me: ["me"],
  posts: {
    all: ["posts"],
    lists: () => ["posts", "list"],
    list: (scope, params = {}) => ["posts", "list", scope, params],
    detail: (postId) => ["posts", "detail", postId],
    comments: (postId) => ["posts", "comments", postId],
  },
  users: {
    profile: (userId) => ["users", "profile", userId],
    followers: (userId) => ["users", "followers", userId],
    following: (userId) => ["users", "following", userId],
  },
  notifications: {
    all: ["notifications"],
    list: () => ["notifications", "list"],
    unreadCount: () => ["notifications", "unread-count"],
  },
  conversations: {
    all: ["conversations"],
    list: () => ["conversations", "list"],
    withUser: (userId) => ["conversations", "with", userId],
    messages: (conversationId) => ["conversations", "messages", conversationId],
  },
  organic: {
    all: ["organic"],
    mine: () => ["organic", "mine"],
    list: (status) => ["organic", "list", status ?? "all"],
  },
  presence: ["presence"],
};
