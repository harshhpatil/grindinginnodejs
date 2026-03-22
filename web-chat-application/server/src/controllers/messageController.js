import { Message } from '../models/message.model.js';

export const sendMessage = async (data) => {
  try {
    const message = new Message(data);
    await message.save();
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessages = async () => {
  try {
    const messages = await Message.find({}).sort({ createdAt: 1 });
    return messages;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

export const uploadImage = (file) => {
  if (!file) return null;
  return `/uploads/${file.filename}`;
};
