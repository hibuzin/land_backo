const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Chat = require('../models/chat');
const Message = require('../models/message');


// ✅ CREATE / GET CHAT WITH USER
router.post('/start', auth, async (req, res) => {
  const { userId } = req.body; // receiver id

  if (!userId) {
    return res.status(400).json({ message: 'User ID required' });
  }

  let chat = await Chat.findOne({
    participants: { $all: [req.userId, userId] },
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [req.userId, userId],
    });
  }

  res.json(chat);
});


// ✅ SEND MESSAGE
router.post('/message', auth, async (req, res) => {
  const { chatId, text } = req.body;

  if (!chatId || !text) {
    return res.status(400).json({ message: 'Chat ID and text required' });
  }

  const message = await Message.create({
    chat: chatId,
    sender: req.userId,
    text,
  });

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: text,
  });

  res.status(201).json(message);
});


// ✅ GET MESSAGES
router.get('/:chatId', auth, async (req, res) => {
  const messages = await Message.find({
    chat: req.params.chatId,
  }).populate('sender', 'name email');

  res.json(messages);
});

module.exports = router;
