import { useState } from "react";
import { ArrowLeft, Search, Send, Plus, MoreVertical, User } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function WorkerChat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  
  // Dummy chat list - will come from backend
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Marko Marković",
      lastMessage: "Kada možete da dođete?",
      time: "10:30",
      unread: 2,
      avatar: null,
      online: true
    },
    {
      id: 2,
      name: "Ana Anić",
      lastMessage: "Hvala na odličnom poslu!",
      time: "09:15",
      unread: 0,
      avatar: null,
      online: false
    },
    {
      id: 3,
      name: "Jovan Jovanović",
      lastMessage: "Kolika je cena?",
      time: "Juče",
      unread: 1,
      avatar: null,
      online: true
    },
    {
      id: 4,
      name: "Milica Milić",
      lastMessage: "Vidimo se sutra!",
      time: "Juče",
      unread: 0,
      avatar: null,
      online: false
    }
  ]);

  const [activeChat, setActiveChat] = useState(conversations[0]);
  
  // Dummy messages for active chat - will come from backend
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Dobar dan, potrebna mi je popravka slavine u kupatilu", 
      sender: "client", 
      time: "10:25",
      date: "Danas"
    },
    { 
      id: 2, 
      text: "Dobar dan! Mogu sutra u 14h ako vam odgovara?", 
      sender: "worker", 
      time: "10:27",
      date: "Danas"
    },
    { 
      id: 3, 
      text: "Kada možete da dođete?", 
      sender: "client", 
      time: "10:30",
      date: "Danas"
    }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Send message to backend
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "worker",
        time: new Date().toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }),
        date: "Danas"
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121418] flex flex-col">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Conversations List */}
        <aside className="w-full md:w-96 bg-[#1a1d26] border-r border-gray-700 flex flex-col">
          {/* Sidebar Header */}
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
            
            {/* Search */}
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

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveChat(conv)}
                className={`p-4 border-b border-gray-700/50 cursor-pointer transition ${
                  activeChat.id === conv.id 
                    ? 'bg-[#2324fe]/20 border-l-4 border-l-[#2324fe]' 
                    : 'hover:bg-gray-700/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1d26]"></div>
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-white font-semibold truncate">{conv.name}</p>
                      <span className="text-gray-400 text-xs whitespace-nowrap ml-2">{conv.time}</span>
                    </div>
                    <p className={`text-sm truncate ${conv.unread > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {conv.unread > 0 && (
                    <div className="w-6 h-6 bg-[#2324fe] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{conv.unread}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* New Message Button */}
          <div className="p-4 border-t border-gray-700">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition">
              <Plus className="w-5 h-5" />
              Nova Poruka
            </button>
          </div>
        </aside>

        {/* Right Side - Active Chat */}
        <div className="flex-1 flex flex-col bg-[#0f1115]">
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

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-[#1e2028] px-4 py-1 rounded-full">
                <span className="text-gray-400 text-sm">Danas</span>
              </div>
            </div>

            {/* Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'worker' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === 'worker'
                      ? 'bg-[#2324fe] text-white'
                      : 'bg-[#262431] text-white'
                  }`}
                >
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
          </div>

          {/* Message Input */}
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
        </div>
      </main>
    </div>
  );
}