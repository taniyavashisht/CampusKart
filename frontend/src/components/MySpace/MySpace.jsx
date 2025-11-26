import "./MySpace.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../Products/ProductList";
import ChatPopup from "../Chat";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://campuskart-7lsu.onrender.com/api";

export default function MySpace() {
  const navigate = useNavigate();

  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("listings");

  // ✅ Messages & Chat
  const [activeChat, setActiveChat] = useState(null);
  const [myChats, setMyChats] = useState([]);
  const [unread, setUnread] = useState(0);

  // ✅ SETTINGS STATE
  const [newName, setNewName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadEverything = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user) {
          setLoading(false);
          return;
        }

        setUserInfo(user);
        setNewName(user.name || user.username);

        // ✅ LOAD MY PRODUCTS
        const res = await axios.get(`${API_BASE}/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          const filtered = res.data.products.filter((product) => {
  if (!product.seller) return false;

  const sellerId =
    typeof product.seller === "object"
      ? product.seller._id
      : product.seller;

  return sellerId === (user._id || user.id);
});


          setMyProducts(filtered);
        }

        // ✅ LOAD MY CHATS
        const chatsRes = await axios.get(`${API_BASE}/chat`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (Array.isArray(chatsRes.data)) {
          setMyChats(chatsRes.data);
          const totalUnread = chatsRes.data.reduce(
            (sum, chat) => sum + (chat.unread || 0),
            0
          );
          setUnread(totalUnread);
        }

      } catch (err) {
        console.error("MySpace error:", err);
      }

      setLoading(false);
    };

    loadEverything();
  }, []);

  // ✅ DELETE PRODUCT
  const handleDeleteProduct = async (productId) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_BASE}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMyProducts(prev => prev.filter(p => p._id !== productId));
      alert("✅ Product deleted");

    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  // ✅ EDIT PRODUCT
  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  // ✅ UPDATE SETTINGS FUNCTION
  const handleSaveSettings = async () => {
    if (!newName) return alert("Name cannot be empty");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API_BASE}/auth/update-profile`,
        { name: newName, currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("✅ Settings updated");

        const updatedUser = {
          ...userInfo,
          name: res.data.user.name
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserInfo(updatedUser);
        setCurrentPassword("");
        setNewPassword("");
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating settings");
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="myspace-loader">Loading...</div>;
  }

  return (
    <div className="myspace-container">

      {/* LEFT SIDEBAR */}
      <div className="myspace-sidebar">

        <div className="myspace-user">
          <div className="myspace-avatar">
            {userInfo?.name?.charAt(0) || userInfo?.username?.charAt(0)}
          </div>

          <p className="myspace-name">{userInfo?.name || userInfo?.username}</p>
          <p className="myspace-email">{userInfo?.email}</p>
        </div>

        <div className="myspace-nav">
          {["profile", "listings", "purchases", "wishlist", "messages", "settings"].map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`myspace-nav-item ${activeTab === tab ? "active" : ""}`}
            >
              {tab === "profile" && "👤 Profile"}
              {tab === "listings" && "📦 My Listings"}
              {tab === "purchases" && "🛒 Purchases"}
              {tab === "wishlist" && "🤍 Wishlist"}
              {tab === "messages" && <>💬 Messages {unread > 0 && <span className="badge">{unread}</span>}</>}
              {tab === "settings" && "⚙️ Settings"}
            </div>
          ))}
        </div>

        <button
          className="myspace-logout"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>

      </div>

      {/* MAIN */}
      <div className="myspace-main">

        {/* PROFILE */}
        {activeTab === "profile" && (
          <>
            <h2 className="myspace-title">My Profile</h2>
            <p><strong>Name:</strong> {userInfo?.name}</p>
            <p><strong>Username:</strong> {userInfo?.username}</p>
            <p><strong>Email:</strong> {userInfo?.email}</p>
          </>
        )}

        {/* ✅ LISTINGS + EDIT/DELETE */}
        {activeTab === "listings" && (
          <>
            <h2 className="myspace-title">My Listings</h2>

            {myProducts.length === 0 ? (
              <div className="myspace-empty">
                You haven’t listed anything yet.
              </div>
            ) : (
              <div className="products-grid">
                {myProducts.map((product) => (
                  <div key={product._id} className="product-card">

                    <div className="product-image">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.jpg"}
                        alt={product.title}
                      />
                    </div>

                    <div className="product-body">
                      <h3>{product.title}</h3>
                      <p className="price">₹{product.price}</p>

                      {/* ✅ EDIT + DELETE */}
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button
                          className="chat-btn"
                          onClick={() => handleEditProduct(product._id)}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="block-btn"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          🗑 Delete
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MESSAGES */}
        {activeTab === "messages" && (
          <>
            <h2 className="myspace-title">Messages</h2>

            {myChats.length === 0 ? (
              <div className="myspace-empty">
                You haven’t started any chats yet.
              </div>
            ) : (
              myChats.map((chat) => {
                const otherUser = chat.users.find(
                  (u) => u._id !== userInfo.id
                );

                return (
                  <div
                    key={chat._id}
                    className="chat-user-box"
                    onClick={() =>
                      setActiveChat({
                        productId: chat.product?._id || chat.product,
                        otherUserId: otherUser?._id
                      })
                    }
                  >
                    <div className="chat-avatar">
                      {otherUser?.name?.charAt(0) || "U"}
                    </div>

                    <div className="chat-info">
                      <b>{otherUser?.name || otherUser?.username}</b>
                      <p>{chat.latestMessage?.content || "Start chatting..."}</p>
                    </div>

                    {chat.unread > 0 && (
                      <span className="chat-badge">{chat.unread}</span>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <>
            <h2 className="myspace-title">Account Settings</h2>

            <div className="myspace-settings">
              <label>Update Name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} />

              <label>Current Password</label>
              <input type="password" value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)} />

              <label>New Password</label>
              <input type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} />

              <button onClick={handleSaveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}

      </div>

      {/* ✅ CHAT POPUP */}
      {activeChat && (
        <ChatPopup
          productId={activeChat.productId}
          otherUserId={activeChat.otherUserId}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}
