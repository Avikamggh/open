import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { mockInvestors, type Investor } from '../data/mockInvestors';
import { mockTalents, type Talent } from '../data/mockTalent';
import { mockStartups, type Startup } from '../data/mockStartups';
import confetti from 'canvas-confetti';
import { loadStripe } from '@stripe/stripe-js';
import emailjs from '@emailjs/browser';

// --- CONFIGURATION ---
// 1. Get these from https://dashboard.emailjs.com/
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

const STRIPE_PUBLIC_KEY = 'pk_test_your_key_here';
const LLM_API_ENDPOINT = 'https://your-api-gateway.com/analyze';

interface PhoneChatProps {
    onComplete?: () => void;
    isOverlay?: boolean;
}

type Step = 'welcome' | 'user-type' | 'goal' | 'website' | 'analyzing' | 'talent-search' | 'investor-focus' | 'investor-stage' | 'traction' | 'results' | 'talent-results' | 'investor-results' | 'connect' | 'unlock-more' | 'payment-processing' | 'email-capture' | 'success';

interface Message {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    options?: Option[];
    investors?: Investor[];
    talents?: Talent[];
    startups?: Startup[];
    isTyping?: boolean;
}

interface Option {
    id: string;
    label: string;
    emoji: string;
}

const userTypeOptions: Option[] = [
    { id: 'founder', label: "I'm a Founder", emoji: '🚀' },
    { id: 'investor', label: "I'm an Investor", emoji: '💼' },
    { id: 'researcher', label: "Researcher / Engineer", emoji: '🔬' },
];

const founderGoals: Option[] = [
    { id: 'fundraise', label: "Raise Capital", emoji: '💰' },
    { id: 'hire', label: "Find Top Talent", emoji: '🧙‍♂️' },
    { id: 'advisors', label: "Seek Advisors", emoji: '🧠' },
];

const tractionOptions: Option[] = [
    { id: 'idea', label: "Idea / Pre-Product", emoji: '💡' },
    { id: 'mvp', label: "MVP / Beta", emoji: '🛠️' },
    { id: 'revenue', label: "Generating Revenue", emoji: '💵' },
    { id: 'scale', label: "Scaling (>1M ARR)", emoji: '📈' },
];

const engineeringFields: Option[] = [
    { id: 'ai', label: "AI / ML Core", emoji: '🧠' },
    { id: 'fullstack', label: "Full-Stack Web", emoji: '💻' },
    { id: 'security', label: "Security / Ops", emoji: '🛡️' },
    { id: 'mobile', label: "Mobile Dev", emoji: '📱' },
];

const investorFocusOptions: Option[] = [
    { id: 'ai', label: "Artificial Intelligence", emoji: '🤖' },
    { id: 'fintech', label: "Fintech / Payments", emoji: '💳' },
    { id: 'bio', label: "Biotech / Health", emoji: '🧬' },
    { id: 'web3', label: "Web3 / Crypto", emoji: '⛓️' },
];

const investorStageOptions: Option[] = [
    { id: 'seed', label: "Pre-Seed / Seed", emoji: '🐣' },
    { id: 'early', label: "Series A / B", emoji: '📈' },
    { id: 'late', label: "Late Stage / Growth", emoji: '🏢' },
];

const PhoneChat = ({ onComplete: _onComplete, isOverlay = false }: PhoneChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentStep, setCurrentStep] = useState<Step>('welcome');
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);

    // 3D Motion Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    const [sessionData, setSessionData] = useState({
        role: '',
        goal: '',
        website: '',
        industry: '',
        traction: '',
        focus: '',
        stage: '',
        email: ''
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const phoneRef = useRef<HTMLDivElement>(null);

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
            setTimeout(() => {
                chatContainerRef.current?.scrollTo({
                    top: chatContainerRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isOverlay && phoneRef.current) {
            const rect = phoneRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            x.set(e.clientX - centerX);
            y.set(e.clientY - centerY);
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initial greeting
    useEffect(() => {
        const timer = setTimeout(() => {
            addBotMessage(
                "Cut the noise. Chase the signal. 📡\n\nOpenStars - the fastest way to fundraise in 2026!\n\nHelping 10,000 founders raise from 15,000+ investors helping grow economy by 20 trillion USD.",
                undefined,
                () => {
                    setTimeout(() => {
                        setCurrentStep('user-type');
                        addBotMessage("To begin your journey with OpenStars, please identify yourself:", userTypeOptions);
                    }, 1200);
                }
            );
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    // LLM API Connection Simulation
    const callLLMAnalysis = async (url: string) => {
        try {
            console.log(`Connecting to LLM at: ${LLM_API_ENDPOINT}`);
            await new Promise(r => setTimeout(r, 2000));
            return url.toLowerCase().includes('ai') ? 'GenAI Infrastructure' : 'Enterprise SaaS';
        } catch (e) {
            return 'Technology & Infrastructure';
        }
    };

    // Stripe Payment Initiation
    const handleStripePayment = async () => {
        setCurrentStep('payment-processing');
        addBotMessage("Opening secure Stripe gateway... 💳");

        try {
            const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
            if (!stripe) throw new Error("Stripe load failed");

            setTimeout(() => {
                setIsPremiumUnlocked(true);
                addBotMessage("Payment Confirmed! ✅\n\nAccess granted to Premium Database Pool. Searching for your additional 3 matches...");

                setTimeout(() => {
                    if (sessionData.role === 'founder') {
                        const extraMatches = mockInvestors.sort(() => 0.5 - Math.random()).slice(0, 3);
                        addBotMessage("Encryption bypassed. Found 3 more high-conviction matches:", undefined, () => {
                            setTimeout(() => {
                                setCurrentStep('email-capture');
                                addBotMessage("Shall we bundle these matches into a single introduction package? Enter your email to proceed.");
                            }, 2000);
                        }, extraMatches);
                    } else {
                        const extraStartups = mockStartups.slice(3, 6);
                        addBotMessage("Premium Feed Unlocked. Found 3 more high-growth startups:", undefined, () => {
                            setTimeout(() => {
                                setCurrentStep('email-capture');
                                addBotMessage("Shall we prepare the due diligence bundle for these companies? Enter your email to proceed.");
                            }, 2000);
                        }, undefined, undefined, extraStartups);
                    }
                }, 1500);
            }, 3000);

        } catch (err) {
            addBotMessage("Secure Link Failed. Falling back to basic results.");
            setCurrentStep('connect');
        }
    };

    const addBotMessage = (text: string, options?: Option[], callback?: () => void, investors?: Investor[], talents?: Talent[], startups?: Startup[]) => {
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
                    investors,
                    talents,
                    startups
                },
            ]);
            if (callback) setTimeout(callback, 300);
        }, 800 + Math.random() * 600);
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
        if (messages.length > 0 && messages[messages.length - 1].options === undefined) return;

        setMessages(prev => prev.map(m => m.id === prev[prev.length - 1].id ? { ...m, options: undefined } : m));
        addUserMessage(`${option.emoji} ${option.label}`);

        if (currentStep === 'user-type') {
            setSessionData(prev => ({ ...prev, role: option.id }));
            if (option.id === 'founder') {
                setCurrentStep('goal');
                setTimeout(() => {
                    addBotMessage("Welcome, Founder. 🚀\n\nOur network is optimized for speed.\n\nWhat is your primary mission today?", founderGoals);
                }, 600);
            } else if (option.id === 'investor') {
                setCurrentStep('investor-focus');
                setTimeout(() => {
                    addBotMessage("Welcome to the Syndicate. 💼\n\nWe source high-alpha founders directly from top engineering hubs.\n\nWhat is your primary investment focus?", investorFocusOptions);
                }, 600);
            } else {
                setCurrentStep('success');
                setTimeout(() => {
                    addBotMessage("Our Network Portal is currently in private beta for your role.\n\nWe've added you to the priority access list. 🌟");
                }, 600);
            }
        } else if (currentStep === 'investor-focus') {
            setSessionData(prev => ({ ...prev, focus: option.label }));
            setCurrentStep('investor-stage');
            setTimeout(() => {
                addBotMessage(`Acknowledged. ${option.emoji}\n\nAt what stage do you typically deploy capital?`, investorStageOptions);
            }, 600);
        } else if (currentStep === 'investor-stage') {
            setSessionData(prev => ({ ...prev, stage: option.label }));
            setCurrentStep('investor-results');
            setTimeout(() => {
                addBotMessage(`Filtering the 10,000+ startup database for ${sessionData.focus} at ${option.label}... ⚡`);
                setTimeout(() => {
                    const matches = mockStartups.slice(0, 3);
                    addBotMessage(
                        `Search Complete. Found ${matches.length} high-signal startups currently fundraising:`,
                        undefined,
                        () => {
                            setTimeout(() => {
                                setCurrentStep('unlock-more');
                                addBotMessage("Want to unlock 3 more 'Stealth' startups in this category for just $3?", [
                                    { id: 'pay', label: "Unlock More ($3)", emoji: '💳' },
                                    { id: 'no', label: "Just these 3", emoji: '⚡' }
                                ]);
                            }, 2500);
                        },
                        undefined,
                        undefined,
                        matches
                    );
                }, 2000);
            }, 600);
        } else if (currentStep === 'goal') {
            setSessionData(prev => ({ ...prev, goal: option.id }));
            if (option.id === 'fundraise') {
                setCurrentStep('website');
                setTimeout(() => {
                    addBotMessage("Initiating Capital Deployment Protocols. 💎\n\nI'm syncing with 15,000+ active VC portfolios.\n\nPlease provide your Startup URL or LinkedIn for instant analysis.");
                    setTimeout(() => inputRef.current?.focus(), 800);
                }, 600);
            } else if (option.id === 'hire') {
                setCurrentStep('talent-search');
                setTimeout(() => {
                    addBotMessage("Connecting to the Engineering Corps. 🧙‍♂️\n\nOur talent pool consists of 'Founding Engineer' level experts.\n\nWhich department are you looking for?", engineeringFields);
                }, 600);
            }
        } else if (currentStep === 'talent-search') {
            setCurrentStep('talent-results');
            setTimeout(() => {
                addBotMessage(`Searching for top-tier ${option.label} talent... ⚡`);
                setTimeout(() => {
                    const matches = mockTalents.slice(0, 3);
                    addBotMessage(
                        `Found ${matches.length} curated matches.`,
                        undefined,
                        () => {
                            setTimeout(() => {
                                setCurrentStep('unlock-more');
                                addBotMessage("Want to unlock 3 more names from our elite talent pool for just $3?", [
                                    { id: 'pay', label: "Unlock 3 More", emoji: '💳' },
                                    { id: 'no', label: "Just these 3", emoji: '⚡' }
                                ]);
                            }, 1500);
                        },
                        undefined,
                        matches
                    );
                }, 2000);
            }, 600);
        } else if (currentStep === 'unlock-more') {
            if (option.id === 'pay') {
                handleStripePayment();
            } else {
                setCurrentStep('email-capture');
                addBotMessage("Understood. Enter your email to receive intro details for these matches.");
            }
        } else if (currentStep === 'traction') {
            setSessionData(prev => ({ ...prev, traction: option.label }));
            setCurrentStep('results');

            setTimeout(() => {
                addBotMessage(`Acknowledged. ${option.emoji}\n\nCalculating compatibility scores for ${sessionData.industry} investors...`);

                setTimeout(() => {
                    const matches = mockInvestors.sort(() => 0.5 - Math.random()).slice(0, 3);
                    addBotMessage(
                        `Analysis Complete. Found ${matches.length} matches with >95% confidence:`,
                        undefined,
                        () => {
                            setTimeout(() => {
                                setCurrentStep('unlock-more');
                                addBotMessage("Unlock 3 more high-conviction investors from our premium database for only $3?", [
                                    { id: 'pay', label: "Unlock More ($3)", emoji: '💰' },
                                    { id: 'no', label: "Just these 3", emoji: '⚡' }
                                ]);
                            }, 2500);
                        },
                        matches
                    );
                }, 2000);
            }, 600);
        } else if (currentStep === 'connect') {
            if (option.id === 'yes') {
                setCurrentStep('email-capture');
                setTimeout(() => {
                    addBotMessage("Affirmative. 📨\n\nPlease provide your secure email uplink to receive the connection details.");
                    setTimeout(() => inputRef.current?.focus(), 800);
                }, 600);
            }
        }
    };

    const handleInputSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const value = inputValue.trim();
        setInputValue('');
        addUserMessage(value);

        if (currentStep === 'website') {
            setCurrentStep('analyzing');
            setSessionData(prev => ({ ...prev, website: value }));

            addBotMessage("Parsing metadata via AI Link... 🛰️");
            const inferred = await callLLMAnalysis(value);

            setTimeout(() => {
                setSessionData(prev => ({ ...prev, industry: inferred }));
                setCurrentStep('traction');
                addBotMessage(
                    `Deep Scan Successful. \n\nIndustry: ${inferred} 🧬\n\nWhat is your current traction status?`,
                    tractionOptions
                );
            }, 1000);
        } else if (currentStep === 'email-capture') {
            setSessionData(prev => ({ ...prev, email: value }));
            setCurrentStep('success');
            addBotMessage("Encrypting and transmitting... 📡");

            // EMAILJS INTEGRATION
            if (EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
                const templateParams = {
                    user_email: value,
                    user_role: sessionData.role,
                    user_goal: sessionData.goal,
                    user_website: sessionData.website,
                    user_industry: sessionData.industry,
                    user_traction: sessionData.traction,
                    user_focus: sessionData.focus,
                    user_stage: sessionData.stage,
                    is_premium: isPremiumUnlocked ? 'Yes' : 'No'
                };

                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
                    .then(() => console.log('Email sent successfully!'))
                    .catch((err) => console.error('Email failed:', err));
            }

            setTimeout(() => {
                addBotMessage("Transmission Complete. ✅\n\nWe will contact you shortly and will surely help you! 🚀\n\nOpenStars - Powering the next generation of unicorns.");
                confetti({ particleCount: 200, spread: 70, origin: { y: 0.7 } });
                try {
                    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(() => { });
                } catch (e) { }
            }, 1500);
        }
    };

    const getInputPlaceholder = () => {
        if (currentStep === 'website') return 'https://your-startup.com';
        if (currentStep === 'email-capture') return 'founder@company.com';
        return 'Enter secure data...';
    };

    return (
        <motion.div
            ref={phoneRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d', touchAction: 'manipulation' }}
            initial={{ opacity: 0, y: 30, rotateX: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full flex justify-center perspective-1000 my-8 sm:my-0 cursor-default"
        >
            <div className={`relative ${isOverlay ? 'w-full max-w-[420px]' : 'w-[320px] sm:w-[380px] md:w-[400px]'} h-[750px] transition-all transform hover:scale-[1.01] duration-500`}>
                <div className="absolute inset-0 bg-blue-900/20 rounded-[3rem] blur-xl transform translate-z-[-20px]" />
                <div className="absolute inset-0 bg-black rounded-[3rem] shadow-2xl transform translate-z-[-10px]" />
                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600/60 via-cyan-500/60 to-indigo-600/60 rounded-[3.5rem] blur-2xl opacity-50 animate-pulse-slow" />

                <div className="relative h-full bg-[#020617] rounded-[3rem] p-3 shadow-2xl border border-white/10 ring-1 ring-white/5 overflow-hidden backdrop-blur-3xl">
                    <div className="relative h-full bg-[#0b1121] rounded-[2.5rem] overflow-hidden flex flex-col shadow-inner shadow-black/50">
                        {/* Dynamic Island */}
                        <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#020617] to-transparent z-20 pointer-events-none flex justify-center pt-2">
                            <div className="w-32 h-9 bg-black rounded-full flex items-center justify-center gap-3 px-3 border border-white/10 shadow-lg shadow-blue-500/20 backdrop-blur-md">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                <div className="flex-1 flex justify-center"><div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-1/2 bg-blue-500/50 animate-shimmer" /></div></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-75" />
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="flex justify-between items-center px-6 pt-3 pb-2 text-[10px] font-medium text-slate-400 z-10 w-full select-none">
                            <span>{currentTime}</span>
                            <div className="flex gap-1.5">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z" /></svg>
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" /></svg>
                            </div>
                        </div>

                        {/* Chat Header */}
                        <div className="px-5 py-4 border-b border-white/5 bg-[#0b1121]/80 backdrop-blur-xl flex items-center justify-between z-10 sticky top-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[1.5px]"><div className="w-full h-full rounded-full bg-[#0b1121] flex items-center justify-center font-bold text-cyan-400 text-lg">✦</div></div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm">OpenStars</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">System Online</span>
                                        {isPremiumUnlocked && <span className="text-[8px] bg-cyan-500/20 text-cyan-400 px-1 rounded-sm font-black border border-cyan-400/20 animate-pulse">PREMIUM</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div ref={chatContainerRef} data-lenis-prevent className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scroll-smooth relative">
                            <AnimatePresence mode="popLayout">
                                {messages.map((msg) => (
                                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
                                        <div className={`max-w-[85%] ${msg.sender === 'user' ? '' : 'flex flex-col gap-2'}`}>
                                            <div className={`px-4 py-3 rounded-2xl text-[13px] relative shadow-lg backdrop-blur-md ${msg.sender === 'user' ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-tr-sm' : 'bg-[#1e293b]/80 text-slate-200 rounded-tl-sm border border-white/5'}`}>{msg.text}</div>
                                            {msg.options && <div className="grid grid-cols-1 gap-2 mt-2">
                                                {msg.options.map((opt) => (
                                                    <button key={opt.id} onClick={() => handleOptionSelect(opt)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1e293b]/50 hover:bg-blue-600/20 border border-white/5 hover:border-cyan-500/40 text-left transition-all group">
                                                        <span className="text-lg group-hover:scale-125 transition-transform">{opt.emoji}</span><span className="text-[11px] font-bold text-slate-300 group-hover:text-white">{opt.label}</span>
                                                        <svg className="w-3 h-3 ml-auto text-slate-600 group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    </button>
                                                ))}
                                            </div>}
                                            {msg.investors && <div className="space-y-3 mt-3">
                                                {msg.investors.map((inv) => (
                                                    <div key={inv.id} className="bg-[#1e293b]/90 rounded-xl p-4 border border-white/10 hover:border-cyan-400/40 transition-all shadow-xl">
                                                        <div className="flex justify-between items-start mb-1 text-white font-bold text-sm">{inv.name} <span className="text-cyan-400 text-[9px] uppercase font-black">{inv.firm}</span></div>
                                                        <div className="text-[10px] text-slate-400 leading-tight">“{inv.reason}”</div>
                                                    </div>
                                                ))}
                                            </div>}
                                            {msg.talents && <div className="space-y-3 mt-3">
                                                {msg.talents.map((tal) => (
                                                    <div key={tal.id} className="bg-[#1e293b]/90 rounded-xl p-4 border border-blue-500/20 hover:border-cyan-400/40 transition-all shadow-xl">
                                                        <div className="flex justify-between items-start mb-1 text-white font-bold text-sm">{tal.name} <span className="text-blue-400 text-[9px] uppercase font-bold">Ex-{tal.company}</span></div>
                                                        <div className="text-[10px] text-slate-400 leading-tight mb-2">{tal.bio}</div>
                                                        <div className="flex gap-1 flex-wrap">{tal.skills.slice(0, 3).map(s => <span key={s} className="px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-[7px] text-cyan-300 border border-cyan-500/20">{s}</span>)}</div>
                                                    </div>
                                                ))}
                                            </div>}
                                            {msg.startups && <div className="space-y-3 mt-3">
                                                {msg.startups.map((start) => (
                                                    <div key={start.id} className="bg-[#1e293b]/90 rounded-xl p-4 border border-violet-500/20 hover:border-violet-400/40 transition-all shadow-xl">
                                                        <div className="flex justify-between items-start mb-1 text-white font-bold text-sm">{start.name} <span className="text-violet-400 text-[9px] uppercase font-bold">{start.industry}</span></div>
                                                        <div className="text-[10px] text-slate-400 leading-tight mb-2">{start.description}</div>
                                                        <div className="flex justify-between items-center text-[10px]">
                                                            <span className="text-slate-500">Founded by <span className="text-white">{start.founder}</span></span>
                                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">{start.traction}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isTyping && <div className="flex gap-2 p-2"><div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-cyan-400 border border-cyan-400/20">✦</div><div className="bg-[#1e293b]/70 px-4 py-2 rounded-2xl rounded-tl-none border border-white/5 flex gap-1 items-center h-8 shadow-lg"><span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></span><span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-75"></span><span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-150"></span></div></div>}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 pt-3 bg-gradient-to-t from-[#0b1121] via-[#0b1121] to-transparent z-20">
                            {(currentStep === 'website' || currentStep === 'email-capture') ? (
                                <form onSubmit={handleInputSubmit} className="relative flex gap-2 items-center bg-[#1e293b] border border-white/10 rounded-full px-1.5 py-1.5 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-2xl">
                                    <input ref={inputRef} type={currentStep === 'email-capture' ? "email" : "text"} value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={getInputPlaceholder()} className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none" />
                                    <button type="submit" className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white active:scale-90 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                                </form>
                            ) : (
                                <div className="h-14 flex items-center justify-center text-[10px] text-slate-500 font-bold tracking-widest uppercase">Secure Demo Interface</div>
                            )}
                        </div>
                        <div className="h-6 flex justify-center items-center bg-[#0b1121]/90"><div className="w-32 h-1 bg-slate-800 rounded-full" /></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PhoneChat;
