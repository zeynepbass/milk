import { idParams, paginationQuery } from "./common.js";

export const listNotificationsSchema = { query: paginationQuery };

export const notificationIdSchema = { params: idParams };
