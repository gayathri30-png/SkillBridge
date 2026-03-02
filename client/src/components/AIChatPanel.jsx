import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, StopCircle } from "lucide-react";
import { cn } from "../lib/utils";
import axios from "axios";

// Mock AI Response Generator (if backend isn't ready for streaming)
const generateMockStream = async (prompt, onChunk) => {
    const response = `Here is a **professional analysis** of your request regarding "${prompt}".\n\n1. **Data Trends**: The market shows a 25% increase in AI adoption.\n2. **Recommendation**: Implement a RAG pipeline.\n\n\`\`\`javascript\nconst ai = "super_powerful";\nconsole.log(ai);\n\`\`\`\n\nLet me know if you need more details!`;
    const chunks = response.split("");
    for (let i = 0; i < chunks.length; i++) {
        await new Promise(r => setTimeout(r, 15)); // Simulate network latency
        onChunk(chunks[i]);
    }
};

export default function AIChatPanel() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const aiMsgId = Date.now();
    setMessages(prev => [...prev, { role: "assistant", content: "", id: aiMsgId }]);

    try {
        // Try real backend if available, else mock
        // const res = await fetch('/api/ai/chat', ...);
        
        // Using Mock Stream for Demo
        let fullContent = "";
        await generateMockStream(userMsg.content, (chunk) => {
            fullContent += chunk;
            setMessages(prev => prev.map(msg => 
                msg.id === aiMsgId ? { ...msg, content: fullContent } : msg
            ));
        });
        
    } catch (err) {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200 w-[400px]">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Sparkles size={20} />
            </div>
            <div>
                <h3 className="font-semibold text-slate-800 m-0">AI Assistant</h3>
                <p className="text-xs text-slate-500 m-0">Powered by SkillBridge AI</p>
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === "assistant" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                )}>
                    {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={cn(
                    "p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed",
                    msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-white border shadow-sm text-slate-700 rounded-bl-none"
                )}>
                    {/* Simple Markdown rendering could go here */}
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
            </div>
        ))}
        {isLoading && (
            <div className="flex gap-2 items-center text-slate-400 text-xs ml-12">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="relative">
            <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about jobs, skills, or trends..."
                className="w-full pl-4 pr-12 py-3 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            />
            <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? <StopCircle size={16} /> : <Send size={16} />}
            </button>
        </form>
      </div>
    </div>
  );
}
