import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../../chat.css";
import { getChatMessages } from "../../services/chatServices";

const API_BASE = "https://campuskart-7lsu.onrender.com/api";

export default function ChatWindow({ chat, onClose, socket }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // ✅ Load messages
  useEffect(() => {
    const load = async () => {
      const data = await getChatMessages(chat._id);
      setMessages(data);
    };
    load();
  }, [chat]);

  // ✅ Listen for new messages
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, [socket]);

  // ✅ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const sendMessage = () => {
    if (!text.trim()) return;

    const payload = {
      chatId: chat._id,
      sender: currentUser.id,
      content: text
    };

    socket.emit("sendMessage", payload);
    setText("");
  };

  // ✅ Delete Chat
  const handleDeleteChat = async () => {
    if (!window.confirm("Delete this chat permanently?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_BASE}/chat/${chat._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("✅ Chat deleted successfully");

      onClose();
      window.location.reload();

    } catch (error) {
      console.error("Delete chat error:", error);
      alert("❌ Failed to delete chat");
    }
  };

  // ✅ Report Chat
  const handleReportChat = async () => {
    if (!window.confirm("Report this user for inappropriate behaviour?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE}/chat/report/${chat._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("✅ User reported successfully");

    } catch (error) {
      console.error("Report chat error:", error);
      alert(error.response?.data?.message || "❌ Failed to report user");
    }
  };

  const otherUser = chat?.users?.find(
    (u) => u._id !== currentUser.id
  );

  return (
    <div className="ck-chat-container">

      {/* ========== HEADER ========== */}
      <div className="ck-chat-header">

        <div className="ck-chat-header-left">
          <button className="ck-back-btn" onClick={onClose}>←</button>

          <span className="ck-chat-username">
            {otherUser?.name || otherUser?.username}
          </span>
        </div>

        <div className="ck-chat-header-right">

          <button
            className="ck-block-btn"
            onClick={handleDeleteChat}
          >
            Delete
          </button>

          <button
            className="ck-report-btn"
            onClick={handleReportChat}
          >
            Report
          </button>

        </div>
      </div>

      {/* ========== MESSAGES ========== */}
      <div className="ck-chat-body">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`ck-msg ${
              msg.sender?._id === currentUser.id
                ? "you"
                : "other"
            }`}
          >
            {msg.content}

            <div className="ck-msg-time">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* ========== INPUT ========== */}
      <div className="ck-chat-input">

        <input
          value={text}
          placeholder="Type your message..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
        />

        <button onClick={sendMessage}>➤</button>

      </div>

    </div>
  );
}
