import * as messageService from "../services/message.service.js";

export const sendMessage = async (req, res) => {
  const message = await messageService.sendMessage({ senderId: req.userId, ...req.body });
  res.status(201).json(message);
};
