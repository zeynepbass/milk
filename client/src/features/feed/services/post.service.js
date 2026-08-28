import { postRepository } from "../repositories/post.repository";

export const postService = {
  async getPosts({ search } = {}) {
    const params = search?.trim()
      ? { title: search.trim() }
      : undefined;

    const { data } =
      await postRepository.getPosts(params);

    return data;
  },

  async getFollowingPosts({ search } = {}) {
    const params = search?.trim()
      ? { title: search.trim() }
      : undefined;

    const { data } =
      await postRepository.getFollowingPosts(params);

    return data;
  },

  async createPost(formData) {
    const { data } =
      await postRepository.createPost(formData);

    return data;
  },

  async getPostDetails(id) {
    if (!id) {
      throw new Error("Post ID bulunamadı.");
    }

    const { data } =
      await postRepository.getPostDetails(id);

    return data;
  },

  async savePost(id) {
    const { data } =
      await postRepository.savePost(id);

    return data;
  },

  async likePost(id) {
    const { data } =
      await postRepository.likePost(id);

    return data;
  },

  async getSavedPosts() {
    const { data } =
      await postRepository.getSavedPosts();

    return data;
  },

  async getMyPosts() {
    const { data } =
      await postRepository.getMyPosts();

    return data;
  },

  async deletePost(id) {
    const { data } =
      await postRepository.deletePost(id);

    return data;
  },

  async followUser(id) {
    const { data } =
      await postRepository.followUser(id);

    return data;
  },

  async updatePost(id, formData) {
    const { data } =
      await postRepository.updatePost(id, formData);

    return data;
  },

  async getConversation(userId) {
    const { data } =
      await postRepository.getConversation(userId);

    return data;
  },

  async getConversationMessages(userId, selectedUserId) {
    const { data } =
      await postRepository.getConversationMessages(
        userId,
        selectedUserId
      );

    return data;
  },

  async sendFeedback(payload) {
    const { data } =
      await postRepository.sendFeedback(payload);

    return data;
  },

  async sendMessage(body) {
    const { data } =
      await postRepository.sendMessage(body);

    return data;
  },

  async getNotifications() {
    const { data } =
      await postRepository.getNotifications();

    return data;
  },

  async markAsRead(id) {
    const { data } =
      await postRepository.markAsRead(id);

    return data;
  },
};