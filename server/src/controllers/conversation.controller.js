import * as messageService from "../services/message.service.js";

export const getMyConversations = async (req, res) => {
  res.json(await messageService.listConversations(req.userId));
};

export const getConversationWithUser = async (req, res) => {
  res.json(await messageService.getConversationWith(req.userId, req.params.userId));
};
