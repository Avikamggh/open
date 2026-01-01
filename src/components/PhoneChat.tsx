import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import confetti from 'canvas-confetti';

interface PhoneChatProps {
    onComplete?: () => void;
    isOverlay?: boolean;
}

type Step = 'welcome' | 'user-type' | 'need' | 'name' | 'email' | 'phone' | 'linkedin' | 'pitch' | 'sending' | 'success';

interface Message {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    options?: Option[];
}

interface Option {
    id: string;
    label: string;
    emoji: string;
}

const userTypeOptions: Option[] = [
    { id: 'founder', label: "I'm a Founder", emoji: '🚀' },
    { id: 'investor', label: "I'm an Investor", emoji: '💼' },
    { id: 'researcher', label: "AI Researcher/Engineer", emoji: '🔬' },
    { id: 'talent', label: "Looking for opportunities", emoji: '⭐' },
    { id: 'other', label: "Other", emoji: '✨' },
];

const founderNeeds: Option[] = [
    { id: 'funding', label: 'Investors/VCs', emoji: '💰' },
    { id: 'cofounder', label: 'Co-founder', emoji: '🤝' },
    { id: 'team', label: 'Build team', emoji: '👥' },
    { id: 'advisors', label: 'Advisors', emoji: '🎯' },
];

const investorNeeds: Option[] = [
    { id: 'deal-flow', label: 'Deal flow', emoji: '📊' },
    { id: 'ai-startups', label: 'AI startups', emoji: '🤖' },
    { id: 'coinvest', label: 'Co-invest', emoji: '💎' },
];

const otherNeeds: Option[] = [
    { id: 'connect', label: 'Network', emoji: '🌐' },
    { id: 'explore', label: 'Explore', emoji: '🔍' },
];

// EmailJS Configuration - Replace with your actual values
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

const PhoneChat = ({ onComplete: _onComplete, isOverlay = false }: PhoneChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentStep, setCurrentStep] = useState<Step>('welcome');
    const [isTyping, setIsTyping] = useState(false);
    const [formData, setFormData] = useState({
        userType: '',
        need: '',
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        pitch: '',
    });
    const [inputValue, setInputValue] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Update time
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        // Initial greeting after mount
        const timer = setTimeout(() => {
            addBotMessage(
                "Hey! ✨ I'm Star, your AI superconnector.\n\nI help founders connect with investors, VCs, and the right people to scale.",
                undefined,
                () => {
                    setTimeout(() => {
                        setCurrentStep('user-type');
                        addBotMessage("How would you describe yourself?", userTypeOptions);
                    }, 500);
                }
            );
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const addBotMessage = (text: string, options?: Option[], callback?: () => void) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    sender: 'bot',
                    text,
                    options,
                },
            ]);
            if (callback) setTimeout(callback, 300);
        }, 600 + Math.random() * 400);
    };

    const addUserMessage = (text: string) => {
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                sender: 'user',
                text,
            },
        ]);
    };

    const handleOptionSelect = (option: Option) => {
        addUserMessage(`${option.emoji} ${option.label}`);

        if (currentStep === 'user-type') {
            setFormData((prev) => ({ ...prev, userType: option.id }));
            setCurrentStep('need');

            setTimeout(() => {
                let needs: Option[];
                let message: string;

                if (option.id === 'founder') {
                    needs = founderNeeds;
                    message = "Love it! 🔥 What are you looking for?";
                } else if (option.id === 'investor') {
                    needs = investorNeeds;
                    message = "Great! What's most valuable for you?";
                } else {
                    needs = otherNeeds;
                    message = "Awesome! What brings you here?";
                }

                addBotMessage(message, needs);
            }, 300);
        } else if (currentStep === 'need') {
            setFormData((prev) => ({ ...prev, need: option.id }));
            setCurrentStep('name');

            setTimeout(() => {
                addBotMessage("Perfect! Let's get you connected.\n\nWhat's your full name?");
                setTimeout(() => inputRef.current?.focus(), 800);
            }, 300);
        }
    };

    const sendEmail = async (data: typeof formData) => {
        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    user_type: data.userType,
                    need: data.need,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    linkedin: data.linkedin,
                    pitch: data.pitch,
                    submitted_at: new Date().toISOString(),
                },
                EMAILJS_PUBLIC_KEY
            );
            return true;
        } catch (error) {
            console.error('EmailJS Error:', error);
            // For demo, we'll still show success
            return true;
        }
    };

    const handleInputSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const value = inputValue.trim();
        setInputValue('');

        if (currentStep === 'name') {
            addUserMessage(value);
            setFormData((prev) => ({ ...prev, name: value }));
            setCurrentStep('email');
            setTimeout(() => {
                addBotMessage(`Nice, ${value.split(' ')[0]}! 👋\n\nYour email?`);
                setTimeout(() => inputRef.current?.focus(), 800);
            }, 300);
        } else if (currentStep === 'email') {
            addUserMessage(value);
            setFormData((prev) => ({ ...prev, email: value }));
            setCurrentStep('phone');
            setTimeout(() => {
                addBotMessage("Got it! 📧\n\nPhone? (for warm intros)");
                setTimeout(() => inputRef.current?.focus(), 800);
            }, 300);
        } else if (currentStep === 'phone') {
            addUserMessage(value);
            setFormData((prev) => ({ ...prev, phone: value }));
            setCurrentStep('linkedin');
            setTimeout(() => {
                addBotMessage("Perfect! 📱\n\nLinkedIn URL?");
                setTimeout(() => inputRef.current?.focus(), 800);
            }, 300);
        } else if (currentStep === 'linkedin') {
            addUserMessage(value);
            setFormData((prev) => ({ ...prev, linkedin: value }));
            setCurrentStep('pitch');
            setTimeout(() => {
                addBotMessage("Almost there! 🎯\n\nOne-liner about what you're building?");
                setTimeout(() => inputRef.current?.focus(), 800);
            }, 300);
        } else if (currentStep === 'pitch') {
            addUserMessage(value);
            const finalData = { ...formData, pitch: value };
            setFormData(finalData);
            setCurrentStep('sending');

            setTimeout(() => {
                addBotMessage("Submitting your info... ⏳");
            }, 300);

            // Send email
            const success = await sendEmail(finalData);

            setTimeout(() => {
                if (success) {
                    setCurrentStep('success');
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 },
                        colors: ['#8b5cf6', '#ec4899', '#06b6d4'],
                    });
                    addBotMessage(
                        "You're in! 🚀✨\n\nWe'll reach out within 24-48hrs with your first introductions.\n\nWelcome to OpenStars! 🌟"
                    );
                }
            }, 1500);
        }
    };

    const getInputPlaceholder = () => {
        switch (currentStep) {
            case 'name': return 'Your name...';
            case 'email': return 'email@example.com';
            case 'phone': return '+1 (555) 000-0000';
            case 'linkedin': return 'linkedin.com/in/...';
            case 'pitch': return 'Building AI for...';
            default: return 'Type here...';
        }
    };

    const getInputType = () => {
        if (currentStep === 'email') return 'email';
        if (currentStep === 'phone') return 'tel';
        return 'text';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.5, type: 'spring' }}
            className="relative"
            style={{ perspective: '1000px' }}
        >
            {/* Phone Frame */}
            <div className={`relative ${isOverlay ? 'w-full max-w-[380px]' : 'w-[320px] sm:w-[360px] md:w-[380px]'} mx-auto`}>
                {/* Phone Outer Frame with Glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 rounded-[56px] blur-xl opacity-40 animate-pulse-slow" />

                {/* Phone Body */}
                <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[48px] p-2 shadow-2xl border border-gray-700/50">
                    {/* Phone Inner Bezel */}
                    <div className="relative bg-black rounded-[40px] overflow-hidden">
                        {/* Dynamic Island */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black px-4 py-1.5 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-gray-800" />
                            <div className="w-12 h-4 rounded-full bg-gray-900" />
                        </div>

                        {/* Status Bar */}
                        <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 pt-3 pb-1 text-white text-xs font-medium">
                            <span>{currentTime}</span>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                                </svg>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
                                </svg>
                            </div>
                        </div>

                        {/* Screen Content */}
                        <div className="h-[580px] sm:h-[620px] bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a] pt-12">
                            {/* App Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/30 backdrop-blur-xl">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                                            <span className="text-lg">✦</span>
                                        </div>
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a1a]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-sm">Star</h3>
                                        <p className="text-[10px] text-green-400 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                                            Online
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div
                                ref={chatContainerRef}
                                className="h-[calc(100%-140px)] overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                            >
                                <AnimatePresence mode="popLayout">
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ type: 'spring', damping: 25 }}
                                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] ${msg.sender === 'user' ? '' : 'flex gap-2'}`}>
                                                {msg.sender === 'bot' && (
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0 text-[10px]">
                                                        ✦
                                                    </div>
                                                )}
                                                <div>
                                                    <div
                                                        className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${msg.sender === 'user'
                                                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-tr-sm'
                                                            : 'bg-white/10 backdrop-blur-sm text-gray-100 rounded-tl-sm border border-white/5'
                                                            }`}
                                                    >
                                                        {msg.text}
                                                    </div>

                                                    {/* Options */}
                                                    {msg.options && (
                                                        <div className="mt-2 space-y-1.5">
                                                            {msg.options.map((option, index) => (
                                                                <motion.button
                                                                    key={option.id}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: index * 0.1 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    onClick={() => handleOptionSelect(option)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 text-left transition-all group"
                                                                >
                                                                    <span className="text-base group-hover:scale-110 transition-transform">{option.emoji}</span>
                                                                    <span className="text-xs font-medium text-gray-200 group-hover:text-white flex-1">
                                                                        {option.label}
                                                                    </span>
                                                                    <svg
                                                                        className="w-3 h-3 text-gray-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </motion.button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-2"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-[10px]">
                                            ✦
                                        </div>
                                        <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white/10 border border-white/5">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Success Actions */}
                                {currentStep === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="space-y-2 mt-4"
                                    >
                                        <a
                                            href="https://discord.gg/agihouse"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/50 text-[#5865F2] hover:bg-[#5865F2]/30 transition-colors text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                            </svg>
                                            Join AGI House Discord
                                        </a>
                                        <a
                                            href="https://chat.whatsapp.com/your-link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/30 transition-colors text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            Join WhatsApp Community
                                        </a>
                                    </motion.div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/50 backdrop-blur-xl border-t border-white/5">
                                {currentStep !== 'welcome' && currentStep !== 'user-type' && currentStep !== 'need' && currentStep !== 'sending' && currentStep !== 'success' && (
                                    <form onSubmit={handleInputSubmit} className="flex gap-2">
                                        <input
                                            ref={inputRef}
                                            type={getInputType()}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder={getInputPlaceholder()}
                                            className="flex-1 bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/10 focus:border-violet-500 rounded-full px-4 py-3 outline-none transition-all text-sm text-white placeholder-gray-500"
                                        />
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-11 h-11 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/30"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </motion.button>
                                    </form>
                                )}

                                {(currentStep === 'welcome' || currentStep === 'user-type' || currentStep === 'need') && (
                                    <div className="h-11 flex items-center justify-center text-xs text-gray-500">
                                        Select an option above ☝️
                                    </div>
                                )}

                                {currentStep === 'sending' && (
                                    <div className="h-11 flex items-center justify-center gap-2 text-xs text-gray-400">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </div>
                                )}

                                {currentStep === 'success' && (
                                    <div className="h-11 flex items-center justify-center text-xs text-green-400">
                                        ✓ Submitted successfully!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
                    </div>
                </div>

                {/* Floating Elements Around Phone */}
                <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-8 -right-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/30 to-transparent backdrop-blur-sm border border-violet-500/20 flex items-center justify-center"
                >
                    <span className="text-2xl">🚀</span>
                </motion.div>
                <motion.div
                    animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute -bottom-4 -left-8 w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-600/30 to-transparent backdrop-blur-sm border border-fuchsia-500/20 flex items-center justify-center"
                >
                    <span className="text-xl">💼</span>
                </motion.div>
                <motion.div
                    animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute top-1/2 -right-12 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600/30 to-transparent backdrop-blur-sm border border-cyan-500/20 flex items-center justify-center"
                >
                    <span className="text-lg">💰</span>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PhoneChat;
