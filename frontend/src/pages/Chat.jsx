import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Search, Send, Plus, MoreVertical, User } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const API_BASE = "http://localhost:5114";

export default function WorkerChat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Izvlačimo craftsmanId iz localStorage (sačuvan pri loginu)
  const craftsmanId = parseInt(localStorage.getItem('userId'));
  const token = localStorage.getItem('accessToken');

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Scroll na poslednju poruku
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Učitavamo sve poruke za ovog majstora
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE}/api/chat/craftsman/${craftsmanId}`,
          { headers: authHeaders }
        );
        const data = await response.json();
        const chats = data.data || data || [];

        // Grupišemo poruke po userId da dobijemo konverzacije
        const grouped = {};
        chats.forEach(chat => {
          const uid = chat.userId;
          if (!grouped[uid]) {
            grouped[uid] = {
              id: uid,
              name: `Korisnik #${uid}`,
              messages: [],
              lastMessage: '',
              time: '',
              unread: 0,
              online: false
            };
          }
          grouped[uid].messages.push(chat);
          grouped[uid].lastMessage = chat.message;
          grouped[uid].time = new Date(chat.sentAt).toLocaleTimeString('sr-RS', {
            hour: '2-digit', minute: '2-digit'
          });
        });

        const convList = Object.values(grouped);
        setConversations(convList);

        if (convList.length > 0) {
          setActiveChat(convList[0]);
          setMessages(formatMessages(convList[0].messages));
        }
      } catch (err) {
        console.error('Greška pri učitavanju poruka:', err);
      } finally {
        setLoading(false);
      }
    };

    if (craftsmanId) fetchMessages();
  }, [craftsmanId]);

  // Formatiramo poruke za prikaz
  const formatMessages = (chats) => {
    return chats.map(chat => ({
      id: chat.chatId,
      text: chat.message,
      sender: chat.craftsmanId === craftsmanId ? 'worker' : 'client',
      time: new Date(chat.sentAt).toLocaleTimeString('sr-RS', {
        hour: '2-digit', minute: '2-digit'
      }),
      date: 'Danas'
    }));
  };

  // Kada se promeni aktivna konverzacija
  const handleSelectConversation = (conv) => {
    setActiveChat(conv);
    setMessages(formatMessages(conv.messages));
  };

  // Slanje poruke
  const handleSend = async () => {
    if (!message.trim() || !activeChat) return;

    const newMessage = {
      message: message,
      userId: activeChat.id,
      craftsmanId: craftsmanId
    };

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(newMessage)
      });

      const json = await response.json();
      const saved = json.data || json;

      // Dodajemo poruku lokalno
      const formatted = {
        id: saved.chatId,
        text: saved.message,
        sender: 'worker',
        time: new Date(saved.sentAt).toLocaleTimeString('sr-RS', {
          hour: '2-digit', minute: '2-digit'
        }),
        date: 'Danas'
      };

      setMessages(prev => [...prev, formatted]);

      // Ažuriramo poslednju poruku u listi konverzacija
      setConversations(prev => prev.map(conv =>
        conv.id === activeChat.id
          ? { ...conv, lastMessage: message, time: formatted.time }
          : conv
      ));

      setMessage("");
    } catch (err) {
      console.error('Greška pri slanju poruke:', err);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121418] flex flex-col">
      <Header />

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-full md:w-96 bg-[#1a1d26] border-r border-gray-700 flex flex-col">
          <div className="p-4 bg-[#1e2028] border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Link to="/workers/dashboard">
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition">
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                </Link>
                <h2 className="text-xl font-bold text-white">Poruke</h2>
              </div>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pretraži konverzacije..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#262431] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2324fe]"
              />
            </div>
          </div>

          {/* Lista konverzacija */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-gray-400">
                Učitavanje...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
                Nema konverzacija
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 border-b border-gray-700/50 cursor-pointer transition ${
                    activeChat?.id === conv.id
                      ? 'bg-[#2324fe]/20 border-l-4 border-l-[#2324fe]'
                      : 'hover:bg-gray-700/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1d26]"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-white font-semibold truncate">{conv.name}</p>
                        <span className="text-gray-400 text-xs whitespace-nowrap ml-2">{conv.time}</span>
                      </div>
                      <p className={`text-sm truncate ${conv.unread > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unread > 0 && (
                      <div className="w-6 h-6 bg-[#2324fe] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{conv.unread}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition">
              <Plus className="w-5 h-5" />
              Nova Poruka
            </button>
          </div>
        </aside>

        {/* Desna strana - aktivni chat */}
        <div className="flex-1 flex flex-col bg-[#0f1115]">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-[#1e2028] border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    {activeChat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1e2028]"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{activeChat.name}</p>
                    <p className="text-gray-400 text-sm">{activeChat.online ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition">
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Poruke */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex items-center justify-center my-4">
                  <div className="bg-[#1e2028] px-4 py-1 rounded-full">
                    <span className="text-gray-400 text-sm">Danas</span>
                  </div>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'worker' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender === 'worker' ? 'bg-[#2324fe] text-white' : 'bg-[#262431] text-white'}`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs opacity-70">{msg.time}</span>
                        {msg.sender === 'worker' && (
                          <svg className="w-4 h-4 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-[#1e2028] border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Napišite poruku..."
                    className="flex-1 bg-[#262431] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2324fe]"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="p-3 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Izaberite konverzaciju
            </div>
          )}
        </div>
      </main>
    </div>
  );
}