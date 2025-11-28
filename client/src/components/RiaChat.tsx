import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { getWellnessResponse } from '@/lib/gemini';

export default function RiaChat() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm Ria, your AI wellness assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const userInput = input;
        setInput('');
        setIsTyping(true);
        setError(null);

        try {
            // Prepare conversation history for Gemini
            const conversationHistory = messages
                .filter(msg => msg.sender !== 'bot' || msg.id !== 1) // Exclude initial greeting
                .map(msg => ({
                    text: msg.text,
                    role: msg.sender === 'user' ? 'user' : 'model' as const
                }));

            // Call Gemini API
            const response = await getWellnessResponse(userInput, conversationHistory);

            const botMessage = {
                id: Date.now() + 1,
                text: response,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error('Error getting AI response:', err);
            setError('Sorry, I encountered an error. Please try again.');
            const errorMessage = {
                id: Date.now() + 1,
                text: "I'm sorry, I'm having trouble connecting right now. Please make sure the Gemini API key is configured correctly.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="bg-zinc-800 p-4 border-b border-zinc-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">Ria</h3>
                        <p className="text-zinc-400 text-xs">AI Wellness Assistant</p>
                    </div>
                    <div className="ml-auto">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user'
                                    ? 'bg-zinc-700'
                                    : 'bg-gradient-to-br from-orange-500 to-orange-600'
                                }`}>
                                {message.sender === 'user' ? (
                                    <UserIcon className="w-4 h-4 text-white" />
                                ) : (
                                    <Bot className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div className={`rounded-2xl p-4 ${message.sender === 'user'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                                }`}>
                                <p className="text-sm">{message.text}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim()}
                        className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
