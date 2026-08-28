import { postApi } from "../api/post.api";

export const postRepository = {
  getPosts: (params) => {
    return postApi.getPosts(params);
  },

  getFollowingPosts: (params) => {
    return postApi.getFollowingPosts(params);
  },

  createPost: (formData) => {
    return postApi.createPost(formData);
  },

  getPostDetails: (id) => {
    return postApi.getPostDetails(id);
  },

  savePost: (id) => {
    return postApi.savePost(id);
  },

  likePost: (id) => {
    return postApi.likePost(id);
  },

  getSavedPosts: () => {
    return postApi.getSavedPosts();
  },

  getMyPosts: () => {
    return postApi.getMyPosts();
  },

  deletePost: (id) => {
    return postApi.deletePost(id);
  },

  followUser: (id) => {
    return postApi.followUser(id);
  },

  updatePost: (id, formData) => {
    return postApi.updatePost(id, formData);
  },

  getConversation: (userId) => {
    return postApi.getConversation(userId);
  },

  getConversationMessages: (userId, selectedUserId) => {
    return postApi.getConversationMessages(
      userId,
      selectedUserId
    );
  },

  sendFeedback: (payload) => {
    return postApi.sendFeedback(payload);
  },

  sendMessage: (body) => {
    return postApi.sendMessage(body);
  },

  getNotifications: () => {
    return postApi.getNotifications();
  },

  markAsRead: (id) => {
    return postApi.markAsRead(id);
  },
};