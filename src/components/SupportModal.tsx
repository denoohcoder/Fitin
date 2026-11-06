import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, X, Send } from 'lucide-react';
import { FBCLogo } from './FBCLogo';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'contact' | 'chat'>('contact');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Welcome to FBC Bank Support. How can we help you today?',
      time: 'Just now',
    },
  ]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: now }]);
    setChatMessage('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Thank you for reaching out. For quick assistance with your loan or OTP, call toll-free 220 or WhatsApp +263 772 419 693.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0047BA] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FBCLogo size="sm" />
            <h3 className="font-semibold text-sm">FBC Support</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'border-[#0047BA] text-[#0047BA]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'border-[#0047BA] text-[#0047BA]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Chat
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'contact' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2 text-[#0047BA] font-semibold mb-1">
                  <Phone className="w-4 h-4" />
                  <span>Phone Support</span>
                </div>
                <p className="text-slate-600">Toll Free: <strong>220</strong></p>
                <p className="text-slate-600">Tel: +263 242 707057 / 704481</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </div>
                <p className="text-slate-600">+263 772 419 693</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-800 font-semibold mb-1">
                  <MapPin className="w-4 h-4 text-[#0047BA]" />
                  <span>Head Office</span>
                </div>
                <p className="text-slate-600">FBC Centre, 45 Nelson Mandela Ave, Harare</p>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-64">
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#0047BA] text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">{msg.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-3 flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0047BA]"
                />
                <button
                  type="submit"
                  className="bg-[#0047BA] text-white px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
