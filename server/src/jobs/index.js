import { registerJobHandler } from "./queue.js";
import {
  dispatchActivityNotification,
  dispatchNewPostNotifications,
} from "../services/notification.service.js";

export const registerJobHandlers = () => {
  registerJobHandler("notify:new-post", ({ postId }) => dispatchNewPostNotifications(postId));
  registerJobHandler("notify:activity", (payload) => dispatchActivityNotification(payload));
};

export { drainJobs, enqueueJob, startJobWorker } from "./queue.js";
