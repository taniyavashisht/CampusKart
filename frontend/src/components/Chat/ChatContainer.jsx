import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import "../../chat.css";

const ChatContainer = () => {
  const [activeChat, setActiveChat] = useState(null);

  const chats = [
    { id: 1, name: "Aditi Sharma", lastMessage: "Got the books!", time: "2:30 PM" },
    { id: 2, name: "Rahul Mehta", lastMessage: "Can we meet tomorrow?", time: "1:15 PM" },
    { id: 3, name: "Neha Gupta", lastMessage: "Thanks for the pen!", time: "Yesterday" },
  ];

  const messages = {
    1: [
      { sender: "me", text: "Hey Aditi, did you receive the notes?" },
      { sender: "Aditi Sharma", text: "Yes! Thanks a lot 😊" },
      { sender: "me", text: "Glad it helped!" },
    ],
    2: [{ sender: "Rahul Mehta", text: "Can we meet tomorrow?" }],
    3: [{ sender: "Neha Gupta", text: "Thanks for the pen!" }],
  };

  return (
    <div className="chat-container">
      <ChatList chats={chats} onSelect={setActiveChat} activeChat={activeChat} />
      {activeChat ? (
        <ChatWindow
          chat={chats.find((c) => c.id === activeChat)}
          messages={messages[activeChat] || []}
          onBack={() => setActiveChat(null)}
        />
      ) : (
        <div className="chat-placeholder">
          <h2>Select a conversation</h2>
          <p>Your messages with other students will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
