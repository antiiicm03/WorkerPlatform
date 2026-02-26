import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Search, Send, User, Loader2, X, MapPin, Briefcase, Star } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5114";

// MODAL ZA NOVU PORUKU
const NewMessageModal = ({ onClose, onSelect, headers }) => {
  const [craftsmen, setCraftsmen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/craftsmen`, { headers });
        const json = await res.json();
        setCraftsmen(json.data || json || []);
      } catch (err) {
        console.error("Greška pri učitavanju majstora:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = craftsmen.filter(c =>
    `${c.firstName} ${c.lastName} ${c.profession} ${c.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const initials = (c) =>
    `${c.firstName?.[0] ?? ""}${c.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1d26] border border-gray-700 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-white font-bold text-lg">Nova poruka</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-700 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pretraži majstore..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              className="w-full bg-[#262431] text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Lista majstora */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-sm">
              <User className="w-10 h-10 mb-2 opacity-30" />
              Nema rezultata
            </div>
          ) : (
            filtered.map(c => (
              <div
                key={c.craftsmanId}
                onClick={() => onSelect(c)}
                className="flex items-center gap-3 p-4 border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer transition"
              >
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {initials(c)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">
                    {c.firstName} {c.lastName}
                  </p>
                  <p className="text-blue-400 text-xs capitalize">{c.profession}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {c.location && (
                      <span className="flex items-center gap-1 text-gray-500 text-xs">
                        <MapPin className="w-3 h-3" />
                        {c.location}
                      </span>
                    )}
                    {c.experience != null && (
                      <span className="flex items-center gap-1 text-gray-500 text-xs">
                        <Briefcase className="w-3 h-3" />
                        {c.experience} god.
                      </span>
                    )}
                    {c.averageRating != null && (
                      <span className="flex items-center gap-1 text-yellow-400 text-xs">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        {c.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Cena */}
                <div className="text-right flex-shrink-0">
                  <p className="text-white text-sm font-bold">{c.hourlyRate}</p>
                  <p className="text-gray-500 text-xs">RSD/h</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// MAIN CHAT KOMPONENTA
export default function Chat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCraftsmanId = parseInt(searchParams.get("craftsmanId")) || null;
  const initialCraftsmanName = searchParams.get("craftsmanName") || null;

  const getFromJWT = (claim) => {
    try {
      const t = localStorage.getItem("accessToken");
      if (!t) return null;
      const decoded = JSON.parse(atob(t.split('.')[1]));
      return decoded[claim] || null;
    } catch { return null; }
  };
  const myId = user?.id || parseInt(getFromJWT('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier') || '0') || null;
  const myRole = user?.role || getFromJWT('http://schemas.microsoft.com/ws/2008/06/identity/claims/role');
  const isCraftsman = myRole === "Craftsman";
  const token = user?.accessToken || localStorage.getItem("accessToken");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewMessage, setShowNewMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  useEffect(() => {
    if (!myId) return;
    fetchConversations();
    const sidebarPoll = setInterval(() => fetchConversations(), 5000);
    return () => clearInterval(sidebarPoll);
  }, [myId]);

  useEffect(() => {
    if (!initialCraftsmanId || loading) return;
    const existing = conversations.find(c => c.craftsmanId === initialCraftsmanId);
    if (existing) {
      handleSelectConv(existing);
    } else {
      openNewConversation(initialCraftsmanId, initialCraftsmanName);
    }
  }, [loading, initialCraftsmanId]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const endpoint = isCraftsman
        ? `${API_BASE}/api/chat/craftsman/${myId}`
        : `${API_BASE}/api/chat/user/${myId}`;

      const res = await fetch(endpoint, { headers });
      const json = await res.json();
      const chats = json.data || [];

      const grouped = {};
      chats.forEach(chat => {
        const otherId = isCraftsman ? chat.userId : chat.craftsmanId;
        const key = isCraftsman ? `u${otherId}` : `c${otherId}`;
        if (!grouped[key]) {
          grouped[key] = {
            key,
            userId: chat.userId,
            craftsmanId: chat.craftsmanId,
            name: isCraftsman ? `Korisnik #${otherId}` : `Majstor #${otherId}`,
            messages: [],
            lastMessage: "",
            lastTime: null,
            unreadCount: 0,
          };
        }
        grouped[key].messages.push(chat);
        grouped[key].lastMessage = chat.message;
        grouped[key].lastTime = new Date(chat.sentAt);

        if (!chat.isRead && chat.senderType !== (isCraftsman ? "craftsman" : "user")) {
          grouped[key].unreadCount++;
        }
      });

      const convList = Object.values(grouped).sort(
        (a, b) => (b.lastTime || 0) - (a.lastTime || 0)
      );

      const convWithNames = await Promise.all(
        convList.map(async (conv) => {
          try {
            if (isCraftsman) {
              const r = await fetch(`${API_BASE}/api/users/${conv.userId}`, { headers });
              const j = await r.json();
              if (j.success) conv.name = `${j.data.firstName} ${j.data.lastName}`;
            } else {
              const r = await fetch(`${API_BASE}/api/craftsmen/${conv.craftsmanId}`, { headers });
              const j = await r.json();
              if (j.success) conv.name = `${j.data.firstName} ${j.data.lastName}`;
            }
          } catch {}
          return conv;
        })
      );

      setConversations(convWithNames);
      setActiveConv(prev => {
        if (!prev) return prev;
        const updated = convWithNames.find(c => c.key === prev.key);
        return updated || prev;
      });
    } catch (err) {
      console.error("Greška pri učitavanju:", err);
    } finally {
      setLoading(false);
    }
  };

  const openNewConversation = async (craftsmanId, craftsmanName) => {
    let name = craftsmanName || `Majstor #${craftsmanId}`;
    try {
      const r = await fetch(`${API_BASE}/api/craftsmen/${craftsmanId}`, { headers });
      const j = await r.json();
      if (j.success) name = `${j.data.firstName} ${j.data.lastName}`;
    } catch {}

    const newConv = {
      key: `c${craftsmanId}`,
      userId: myId,
      craftsmanId,
      name,
      messages: [],
      lastMessage: "",
      lastTime: null,
      unreadCount: 0,
    };
    setConversations(prev => {
      const exists = prev.find(c => c.key === newConv.key);
      return exists ? prev : [newConv, ...prev];
    });
    setActiveConv(newConv);
  };

  // Kada user izabere majstora iz modala
  const handleSelectNewCraftsman = (craftsman) => {
    setShowNewMessage(false);
    const key = `c${craftsman.craftsmanId}`;
    const existing = conversations.find(c => c.key === key);
    if (existing) {
      handleSelectConv(existing);
    } else {
      const newConv = {
        key,
        userId: myId,
        craftsmanId: craftsman.craftsmanId,
        name: `${craftsman.firstName} ${craftsman.lastName}`,
        messages: [],
        lastMessage: "",
        lastTime: null,
        unreadCount: 0,
      };
      setConversations(prev => [newConv, ...prev.filter(c => c.key !== key)]);
      setActiveConv(newConv);
    }
  };

  useEffect(() => {
    if (!activeConv) return;
    pollRef.current = setInterval(() => {
      refreshActiveChat(activeConv.userId, activeConv.craftsmanId, activeConv.key);
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [activeConv?.key]);

  const refreshActiveChat = async (userId, craftsmanId, key) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/conversation/${userId}/${craftsmanId}`,
        { headers }
      );
      const json = await res.json();
      const msgs = json.data || [];
      setActiveConv(prev => {
        if (!prev || prev.key !== key) return prev;
        return { ...prev, messages: msgs };
      });
      setConversations(prev =>
        prev.map(c => c.key === key
          ? { ...c, messages: msgs, lastMessage: msgs[msgs.length - 1]?.message || c.lastMessage }
          : c
        )
      );
    } catch {}
  };

  const markAsRead = async (userId, craftsmanId, convKey) => {
    try {
      const readerRole = isCraftsman ? "craftsman" : "user";
      await fetch(
        `${API_BASE}/api/chat/read/${userId}/${craftsmanId}?readerRole=${readerRole}`,
        { method: "PUT", headers }
      );
      setConversations(prev =>
        prev.map(c => c.key === convKey ? { ...c, unreadCount: 0 } : c)
      );
    } catch {}
  };

  const handleSelectConv = async (conv) => {
    clearInterval(pollRef.current);
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/conversation/${conv.userId}/${conv.craftsmanId}`,
        { headers }
      );
      const json = await res.json();
      const msgs = json.data || [];
      await markAsRead(conv.userId, conv.craftsmanId, conv.key);
      setActiveConv({ ...conv, messages: msgs });
    } catch {
      setActiveConv(conv);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !activeConv || sending) return;
    setSending(true);
    const senderType = isCraftsman ? "craftsman" : "user";
    const optimistic = {
      chatId: Date.now(),
      message: message.trim(),
      userId: isCraftsman ? activeConv.userId : myId,
      craftsmanId: isCraftsman ? myId : activeConv.craftsmanId,
      senderType,
      sentAt: new Date().toISOString(),
      isRead: false,
      optimistic: true,
    };
    setActiveConv(prev => ({ ...prev, messages: [...prev.messages, optimistic] }));
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: optimistic.message,
          userId: optimistic.userId,
          craftsmanId: optimistic.craftsmanId,
          senderType: optimistic.senderType,
        }),
      });
      const json = await res.json();
      const saved = json.data;
      setActiveConv(prev => ({
        ...prev,
        messages: prev.messages.map(m => m.optimistic && m.chatId === optimistic.chatId ? saved : m),
        lastMessage: saved.message,
        lastTime: new Date(saved.sentAt),
      }));
      setConversations(prev =>
        prev.map(c =>
          c.key === activeConv.key
            ? { ...c, lastMessage: saved.message, lastTime: new Date(saved.sentAt) }
            : c
        )
      );
    } catch (err) {
      console.error("Greška pri slanju:", err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Danas";
    if (d.toDateString() === yesterday.toDateString()) return "Juče";
    return d.toLocaleDateString("sr-RS");
  };

  const groupedMessages = () => {
    if (!activeConv?.messages) return [];
    const groups = [];
    let currentDate = null;
    activeConv.messages.forEach(msg => {
      const date = formatDate(msg.sentAt);
      if (date !== currentDate) {
        groups.push({ type: "date", label: date });
        currentDate = date;
      }
      const isMe = msg.senderType
        ? msg.senderType === (isCraftsman ? "craftsman" : "user")
        : isCraftsman
          ? parseInt(msg.craftsmanId) === parseInt(myId)
          : parseInt(msg.userId) === parseInt(myId);
      groups.push({ type: "message", msg, isMe });
    });
    return groups;
  };

  const filteredConvs = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initials = (name) =>
    name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div className="h-screen bg-[#121418] flex flex-col overflow-hidden">
      <Header />

      {/* Modal za novu poruku */}
      {showNewMessage && (
        <NewMessageModal
          headers={headers}
          onClose={() => setShowNewMessage(false)}
          onSelect={handleSelectNewCraftsman}
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-80 bg-[#1a1d26] border-r border-gray-700 flex flex-col flex-shrink-0">
          <div className="p-4 bg-[#1e2028] border-b border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-700 rounded-lg transition">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-xl font-bold text-white">Poruke</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pretraži..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#262431] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-sm px-4 text-center">
                <User className="w-12 h-12 mb-3 opacity-30" />
                Nema konverzacija
              </div>
            ) : (
              filteredConvs.map(conv => (
                <div
                  key={conv.key}
                  onClick={() => handleSelectConv(conv)}
                  className={`p-4 border-b border-gray-700/50 cursor-pointer transition ${
                    activeConv?.key === conv.key
                      ? "bg-blue-600/20 border-l-4 border-l-blue-500"
                      : "hover:bg-gray-700/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 flex-shrink-0">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                        {initials(conv.name)}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#1a1d26]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? "text-white font-bold" : "text-white font-semibold"}`}>
                          {conv.name}
                        </p>
                        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                          {conv.lastTime && (
                            <span className={`text-xs ${conv.unreadCount > 0 ? "text-blue-400 font-medium" : "text-gray-500"}`}>
                              {formatTime(conv.lastTime)}
                            </span>
                          )}
                          {conv.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                              {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`text-xs truncate ${conv.unreadCount > 0 ? "text-gray-200 font-medium" : "text-gray-400"}`}>
                        {conv.lastMessage || "Započnite razgovor"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Nova poruka dugme - samo za usere */}
          {!isCraftsman && (
            <div className="p-4 border-t border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowNewMessage(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition text-sm font-medium"
              >
                + Nova poruka
              </button>
            </div>
          )}
        </aside>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col bg-[#0f1115] min-w-0">
          {activeConv ? (
            <>
              <div className="p-4 bg-[#1e2028] border-b border-gray-700 flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {initials(activeConv.name)}
                </div>
                <div>
                  <p className="text-white font-semibold">{activeConv.name}</p>
                  <p className="text-gray-400 text-xs">
                    {isCraftsman ? "Korisnik" : "Majstor"}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {groupedMessages().map((item, idx) =>
                  item.type === "date" ? (
                    <div key={idx} className="flex items-center justify-center my-4">
                      <div className="bg-[#1e2028] px-4 py-1 rounded-full">
                        <span className="text-gray-400 text-xs">{item.label}</span>
                      </div>
                    </div>
                  ) : (
                    <div key={item.msg.chatId} className={`flex ${item.isMe ? "justify-end" : "justify-start"} items-end gap-2 mb-1`}>
                      {!item.isMe && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1">
                          {initials(activeConv?.name)}
                        </div>
                      )}
                      <div className={`max-w-[65%] rounded-2xl px-4 py-2.5 ${
                        item.isMe
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-[#2a2d3a] text-white rounded-bl-none"
                      } ${item.msg.optimistic ? "opacity-70" : ""}`}>
                        <p className="text-sm leading-relaxed">{item.msg.message}</p>
                        <p className={`text-xs mt-1 ${item.isMe ? "text-blue-200" : "text-gray-500"} text-right`}>
                          {formatTime(item.msg.sentAt)}
                        </p>
                      </div>
                      {item.isMe && <div className="w-7 flex-shrink-0" />}
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-[#1e2028] border-t border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder="Napišite poruku..."
                    className="flex-1 bg-[#262431] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || sending}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <Send className="w-8 h-8 opacity-30" />
              </div>
              <p className="text-sm">Izaberite konverzaciju ili pošaljite novu poruku</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}