import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

export const getUserChats = async (req, res) => {
    const chats = await Chat.find({ participants: req.user.id });
    res.json(chats);
};

export const getChatMessages = async (req, res) => {
    const messages = await Message.find({ chat: req.params.chatId });
    res.json(messages);
};

export const sendMessage = async (req, res) => {
    const { text } = req.body;
    const message = await Message.create({
        chat: req.params.chatId,
        sender: req.user.id,
        text,
    });
    res.status(201).json(message);
};