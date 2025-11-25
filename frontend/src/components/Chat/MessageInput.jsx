import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const send = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <form onSubmit={send} className="message-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />

      <button type="submit">➤</button>
    </form>
  );
}
