import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export const configureChatSocket = (io) => {

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinRoom", (chatId) => {
      socket.join(chatId);
      console.log("✅ Joined room:", chatId);
    });

    socket.on("sendMessage", async ({ chatId, sender, content }) => {
      try {
        if (!chatId || !sender || !content) return;

        const message = await Message.create({
          chat: chatId,
          sender,
          content
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name email");

        await Chat.findByIdAndUpdate(chatId, {
          latestMessage: message._id
        });

        io.to(chatId).emit("receiveMessage", populatedMessage);

      } catch (error) {
        console.error("Send message error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });

};
