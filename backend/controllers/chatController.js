import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Report from "../models/Report.js";


// ✅ Create or return chat
export const accessChat = async (req, res) => {
  try {
    console.log("CHAT BODY:", req.body);

    const { productId, otherUserId } = req.body;

    if (!productId || !otherUserId) {
      return res.status(400).json({ message: "Missing data" });
    }

    let chat = await Chat.findOne({
      product: productId,
      users: { $all: [req.user.id, otherUserId] }
    })
      .populate("users", "-password")
      .populate("product");

    if (chat) {
      return res.json({ chat });
    }

    const newChat = await Chat.create({
      product: productId,
      users: [req.user.id, otherUserId]
    });

    const fullChat = await Chat.findById(newChat._id)
      .populate("users", "-password")
      .populate("product");

    res.status(201).json({ chat: fullChat });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating chat" });
  }
};


// ✅ Get messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    // ✅ MARK AS READ FOR THIS USER
    await Message.updateMany(
      {
        chat: req.params.chatId,
        sender: { $ne: req.user.id },
        isRead: false
      },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to load messages" });
  }
};


// ✅ Get all chats for logged in user (MySpace Messages)
export const fetchMyChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      users: { $in: [userId] }
    })
      .populate("users", "name username email")
      .populate("product", "title")
      .sort({ updatedAt: -1 });

    // ✅ Add correct unread count per chat
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await Message.countDocuments({
          chat: chat._id,
          sender: { $ne: userId },
          isRead: false
        });

        return {
          ...chat.toObject(),
          unread: unreadCount
        };
      })
    );

    res.json(chatsWithUnread);

  } catch (error) {
    console.error("Fetch chats error:", error);
    res.status(500).json({ message: "Failed to load chats" });
  }
};


// ✅ Delete Chat
export const deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID missing" });
    }

    // Delete messages first
    await Message.deleteMany({ chat: chatId });

    // Delete chat
    await Chat.findByIdAndDelete(chatId);

    res.json({ success: true, message: "Chat deleted successfully" });

  } catch (error) {
    console.error("Delete chat error:", error);
    res.status(500).json({ message: "Failed to delete chat" });
  }
};

export const reportChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId).populate("users");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const reportedUser = chat.users.find(
      (u) => u._id.toString() !== userId
    );

    if (!reportedUser) {
      return res.status(400).json({ message: "No user to report" });
    }

    const alreadyReported = await Report.findOne({
      chat: chatId,
      reportedBy: userId
    });

    if (alreadyReported) {
      return res.status(400).json({
        message: "You already reported this chat"
      });
    }

    await Report.create({
      chat: chatId,
      reportedBy: userId,
      reportedUser: reportedUser._id
    });

    res.json({ success: true, message: "Chat reported successfully" });

  } catch (err) {
    console.error("Report chat error:", err);
    res.status(500).json({ message: "Failed to report chat" });
  }
};
