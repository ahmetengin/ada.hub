import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, Minimize2, MapPin } from 'lucide-react';
import { ChatMessage, LoadingState } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface AdaAssistantProps {
  externalTrigger?: string | null;
  onTriggerHandled?: () => void;
}

const AdaAssistant: React.FC<AdaAssistantProps> = ({ externalTrigger, onTriggerHandled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Greetings. I am Ada. How can I assist you with the ecosystem today?', timestamp: new Date() }
  ]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Handle external triggers (e.g. from RepoModal)
  useEffect(() => {
    if (externalTrigger && externalTrigger !== null) {
      setIsOpen(true);
      setIsMinimized(false);
      
      const query = `Analyze the repository '${externalTrigger}' and explain its role in the Ada ecosystem.`;
      
      const userMsg: ChatMessage = { role: 'user', text: query, timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      setStatus(LoadingState.LOADING);
      
      sendMessageToGemini(query).then(response => {
        const modelMsg: ChatMessage = { 
          role: 'model', 
          text: response.text, 
          timestamp: new Date(),
          groundingMetadata: response.groundingMetadata
        };
        setMessages(prev => [...prev, modelMsg]);
        setStatus(LoadingState.IDLE);
      }).catch(e => {
        setMessages(prev => [...prev, { role: 'model', text: "Analysis failed. System disconnected.", timestamp: new Date() }]);
        setStatus(LoadingState.ERROR);
      });

      if (onTriggerHandled) onTriggerHandled();
    }
  }, [externalTrigger, onTriggerHandled]);

  const handleSend = async () => {
    if (!input.trim() || status === LoadingState.LOADING) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setStatus(LoadingState.LOADING);

    try {
      const response = await sendMessageToGemini(input);
      const modelMsg: ChatMessage = { 
        role: 'model', 
        text: response.text, 
        timestamp: new Date(),
        groundingMetadata: response.groundingMetadata
      };
      setMessages(prev => [...prev, modelMsg]);
      setStatus(LoadingState.IDLE);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Connection interrupted. Please verify your API credentials.", timestamp: new Date() }]);
      setStatus(LoadingState.ERROR);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Minimized bubble state
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-ada-600 hover:bg-ada-500 text-white rounded-full shadow-lg shadow-ada-500/30 transition-all hover:scale-105 z-50 group flex items-center gap-2"
      >
        <Sparkles size={24} className="animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-semibold">
          Ask Ada
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-slate-900 border border-ada-500/30 rounded-2xl shadow-2xl z-50 transition-all duration-300 overflow-hidden flex flex-col ${isMinimized ? 'w-72 h-16' : 'w-[90vw] sm:w-96 h-[600px] max-h-[80vh]'}`}>
      
      {/* Header */}
      <div className="bg-slate-950/50 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/5 cursor-pointer" onClick={() => !isMinimized && setIsMinimized(true)}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ada-900/50 rounded-lg text-ada-400">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 font-mono">ADA Interface</h3>
            <span className="text-xs text-ada-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <Minimize2 size={16} />
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Chat Body (Hidden if minimized) */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/90 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-ada-600 text-white rounded-br-none' 
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
                
                {/* Render Google Maps Sources */}
                {msg.groundingMetadata?.groundingChunks && (
                  <div className="mt-2 flex flex-col gap-1 max-w-[85%]">
                    {msg.groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                      if (chunk.web?.uri) {
                        return (
                          <a 
                            key={i} 
                            href={chunk.web.uri} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs flex items-center gap-1 text-ada-400 hover:text-ada-300 bg-slate-950/50 px-2 py-1 rounded border border-slate-800 hover:border-ada-500/50 transition-colors"
                          >
                            <MapPin size={10} />
                            {chunk.web.title || "Map Source"}
                          </a>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            ))}
            {status === LoadingState.LOADING && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-700 flex gap-1 items-center">
                  <div className="w-2 h-2 bg-ada-400 rounded-full animate-bounce delay-0"></div>
                  <div className="w-2 h-2 bg-ada-400 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-ada-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-950 border-t border-white/5">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Query the database..."
                className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-ada-500 focus:ring-1 focus:ring-ada-500 transition-all placeholder:text-slate-600 font-mono text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || status === LoadingState.LOADING}
                className="absolute right-2 top-2 p-1.5 bg-ada-600 text-white rounded-lg hover:bg-ada-500 disabled:opacity-50 disabled:hover:bg-ada-600 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-2 text-[10px] text-center text-slate-600 flex items-center justify-center gap-1">
              <span>Powered by Gemini 2.5 Flash</span>
              <span className="w-0.5 h-3 bg-slate-800"></span>
              <span>Maps Enabled</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdaAssistant;