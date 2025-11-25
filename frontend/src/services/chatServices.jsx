import API from "./Api";

// ✅ Create or get chat
export const getOrCreateChat = async (productId, otherUserId) => {
  const token = localStorage.getItem("token");

  const res = await API.post("/chat", 
    { productId, otherUserId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};

// ✅ Get messages
export const getChatMessages = async (chatId) => {
  const token = localStorage.getItem("token");

  const res = await API.get(`/chat/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};
