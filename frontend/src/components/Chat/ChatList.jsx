export default function ChatList({
  chatUsers = [],
  onSelect,
  selectedUser
}) {
  return (
    <div className="chat-list">
      <h3>Chats</h3>

      {chatUsers.length === 0 ? (
        <p>No chats yet</p>
      ) : (
        chatUsers.map((chat) => {
          const user = chat.otherUser || chat.users?.[0] || {};
          const unread = chat.unread || 0;

          return (
            <div
              key={chat._id}
              onClick={() => onSelect(chat._id)}
              className={`chat-user 
                ${selectedUser === chat._id ? "active" : ""} 
                ${unread > 0 ? "has-unread" : ""}
              `}
            >
              <div className="chat-user-left">
                <div className="chat-avatar">
                  {user?.name?.charAt(0) || "U"}
                </div>

                <span className="chat-username">
                  {user?.name || user?.username || "User"}
                </span>
              </div>

              {unread > 0 && (
                <span className="chat-unread-badge">
                  {unread}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
