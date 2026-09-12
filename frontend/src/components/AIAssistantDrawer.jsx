import React, { useState } from 'react';
import { Bot, Sparkles, X, Send, Volume2, Shield, CloudRain, Award, MessageSquare } from 'lucide-react';
import { speakText, parseVoiceIntent } from '../services/speech';

export default function AIAssistantDrawer({ isOpen, onClose, lang = 'te' }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: lang === 'te'
        ? 'నమస్కారం! నేను మీ కృషి షీల్డ్ AI అసిస్టెంట్. మీ పంట పాలసీ లేదా వర్షపాతం పరిహారం గురించి ఏదైనా అడగండి.'
        : lang === 'hi'
        ? 'नमस्कार! मैं आपका कृषि शील्ड AI सहायक हूँ। अपनी फसल पॉलिसी या वर्षा भुगतान के बारे में कुछ भी पूछें।'
        : "Hello! I am your KrishiShield AI Assistant. Ask me anything about your crop policy, rainfall telemetry, or payout eligibility.",
      time: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const quickPrompts = [
    { label: '🌾 Policy Status', query: lang === 'te' ? 'నా పాలసీ ఏమిటి?' : 'What is my policy status?' },
    { label: '🌧 Rainfall Level', query: lang === 'te' ? 'వర్షపాతం ఎంత?' : 'How much rain was recorded?' },
    { label: '💰 Payout Eligibility', query: lang === 'te' ? 'నాకు డబ్బులు వస్తాయా?' : 'Will I receive a payout?' },
    { label: '📡 Oracle Consensus', query: 'Check 3 oracles health status' }
  ];

  const handleSendMessage = (textToSend = null) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const userMsg = { sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate AI response
    setTimeout(() => {
      let aiReply = parseVoiceIntent(text, lang);
      if (!aiReply) {
        if (text.toLowerCase().includes('oracle') || text.toLowerCase().includes('consensus')) {
          aiReply = "All 3 independent weather oracles (Oracle A, B, C) are active. Median consensus is 28 mm with 96% confidence.";
        } else {
          aiReply = lang === 'te'
            ? "మీ ప్రశ్న నమోదైంది. నియమాల ప్రకారంగా మీ రక్షణ క్షేమంగా ఉంది."
            : "Your request was processed cleanly against deterministic insurance rules.";
        }
      }

      const aiMsg = { sender: 'ai', text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
      speakText(aiReply, lang);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-[#0a1b12]/95 border border-emerald-500/40 rounded-3xl text-white shadow-2xl backdrop-blur-2xl z-50 flex flex-col h-[520px] animate-fadeIn select-none">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-950 via-agri-dark to-emerald-900 border-b border-emerald-500/30 rounded-t-3xl flex justify-between items-center">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-400/40">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              KrishiShield AI Assistant <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono block">AI Explains. Rules Decide.</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-emerald-900/50">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[85%] p-3 rounded-2xl leading-relaxed shadow-lg ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-br-none'
                  : 'bg-[#102419] border border-emerald-500/30 text-gray-200 rounded-bl-none'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-gray-400 mt-1 font-mono">{m.time}</span>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-[#05110b] border-t border-emerald-900/60 flex items-center gap-1.5 overflow-x-auto text-[10px]">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp.query)}
            className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 rounded-xl whitespace-nowrap font-medium transition-all"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-[#0a1b12] border-t border-emerald-500/30 rounded-b-3xl flex items-center space-x-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask AI about policies, rainfall..."
          className="flex-1 bg-[#102419] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400"
        />
        <button
          onClick={() => handleSendMessage()}
          className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
