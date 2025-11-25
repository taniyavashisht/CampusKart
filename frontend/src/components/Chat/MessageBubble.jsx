export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`bubble ${isOwn ? "own" : ""}`}>
      <p>{message.content}</p>
      <span>
        {new Date(message.createdAt).toLocaleTimeString()}
      </span>
    </div>
  );
}
