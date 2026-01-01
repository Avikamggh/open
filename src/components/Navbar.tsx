import { motion, useScroll, useTransform } from 'framer-motion';

interface NavbarProps {
    onStartChat: () => void;
}

const Navbar = ({ onStartChat }: NavbarProps) => {
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.9]);
    const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

    return (
        <motion.nav
            style={{
                backgroundColor: `rgba(3, 0, 20, ${bgOpacity.get()})`,
                borderBottomColor: `rgba(255, 255, 255, ${borderOpacity.get()})`,
            }}
            className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 py-4 backdrop-blur-xl border-b transition-colors"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <motion.a
                    href="/"
                    className="flex items-center gap-2 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center glow-sm overflow-hidden"
                    >
                        <span className="text-lg">✦</span>
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-lg sm:text-xl font-bold tracking-tight">
                            Open<span className="gradient-text">Stars</span>
                        </span>
                        <span className="text-[8px] font-mono text-gray-500 tracking-[0.2em] hidden sm:block">SUPERCONNECTOR</span>
                    </div>
                </motion.a>

                {/* CTA Buttons */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Discord - Hidden on very small screens */}
                    <motion.a
                        href="https://discord.gg/agihouse"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/50 text-xs sm:text-sm font-medium text-[#5865F2] hover:bg-[#5865F2]/30 transition-all"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                        <span className="hidden md:inline">AGI House</span>
                    </motion.a>

                    {/* WhatsApp */}
                    <motion.a
                        href="https://chat.whatsapp.com/your-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 text-xs sm:text-sm font-medium text-[#25D366] hover:bg-[#25D366]/30 transition-all"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span className="hidden md:inline">Join</span>
                    </motion.a>

                    {/* Main CTA */}
                    <motion.button
                        onClick={onStartChat}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative px-4 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 font-semibold text-xs sm:text-sm overflow-hidden group glow-sm"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="hidden sm:inline">Connect</span>
                            <span className="sm:hidden">Start</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
