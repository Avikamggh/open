import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Features = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    const features = [
        {
            icon: '🎯',
            title: 'AI-Powered Matching',
            description: 'Our AI analyzes your profile and connects you with the perfect investors, VCs, and partners from our network.',
            gradient: 'from-violet-600 to-violet-400',
        },
        {
            icon: '🤝',
            title: 'Warm Introductions',
            description: 'No cold emails. We personally facilitate warm intros that actually get responses and lead to meetings.',
            gradient: 'from-fuchsia-600 to-fuchsia-400',
        },
        {
            icon: '💰',
            title: 'Success-Based Model',
            description: 'We only succeed when you do. Our commission-based model means our incentives are perfectly aligned.',
            gradient: 'from-cyan-600 to-cyan-400',
        },
        {
            icon: '⚡',
            title: 'Fast & Efficient',
            description: 'Get matched within 48 hours. We move fast because great opportunities don\'t wait.',
            gradient: 'from-amber-600 to-amber-400',
        },
    ];

    return (
        <section ref={containerRef} className="relative py-32 px-6" id="features">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-400 mb-6"
                    >
                        ✨ How It Works
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        From Intro to <span className="gradient-text">Investment</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        We take the manual work out of networking. Drop your info, and let Star handle the rest.
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            <div className="group relative glass rounded-3xl p-8 h-full border-gradient hover:bg-white/5 transition-all duration-500 overflow-hidden">
                                {/* Glow Effect */}
                                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                                    >
                                        <span className="text-3xl">{feature.icon}</span>
                                    </motion.div>

                                    {/* Text */}
                                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Arrow */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    whileHover={{ opacity: 1, x: 0 }}
                                    className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {[
                        { value: '500+', label: 'Intros Made' },
                        { value: '$50M+', label: 'Raised' },
                        { value: '100+', label: 'VCs Connected' },
                        { value: '48hrs', label: 'Avg Match Time' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
                            className="text-center p-6 rounded-2xl glass border-gradient"
                        >
                            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
