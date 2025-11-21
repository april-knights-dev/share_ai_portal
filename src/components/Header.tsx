import React from 'react';
import { Search, Sparkles, Github } from 'lucide-react';

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <header className="glass-panel sticky top-4 z-50 mx-4 mb-8" style={{ position: 'sticky', top: '1rem', zIndex: 50, margin: '0 1rem 2rem 1rem', borderRadius: '1rem' }}>
            <div className="container flex items-center justify-between py-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
                <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles className="text-white" size={20} />
                    </div>
                    <h1 className="text-2xl font-bold font-heading tracking-tight" style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                        Share<span className="text-gradient">AI</span>
                    </h1>
                </div>

                <div className="flex-1 max-w-md mx-8 hidden md:block" style={{ flex: 1, maxWidth: '28rem', margin: '0 2rem' }}>
                    <div className="relative group" style={{ position: 'relative' }}>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-purple-400 transition-colors" size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="AIツール、ニュース、論文などを検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all placeholder:text-gray-600"
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '9999px',
                                padding: '0.625rem 1rem 0.625rem 2.5rem',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/5 rounded-full transition-colors" style={{ padding: '0.5rem', borderRadius: '9999px', color: 'var(--text-secondary)' }}>
                    <Github size={24} />
                </a>
            </div>
        </header>
    );
};
