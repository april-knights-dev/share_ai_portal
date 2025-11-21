import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
    return (
        <div className="relative py-20 text-center overflow-hidden" style={{ padding: '5rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -z-10" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'rgba(147, 51, 234, 0.2)', borderRadius: '50%', filter: 'blur(120px)', zIndex: -1 }}></div>

            <div className="container relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-6 animate-fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#d8b4fe', marginBottom: '1.5rem' }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#4ade80' }}></span>
                    #share_ai から毎日更新
                </div>

                <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight animate-fade-in delay-100" style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
                    <span className="text-gradient">人工知能</span>の未来を<br />
                    発見しよう
                </h1>

                <p className="text-lg text-secondary max-w-2xl mx-auto mb-10 animate-fade-in delay-200" style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '42rem', margin: '0 auto 2.5rem' }}>
                    コミュニティで共有された最新のAIツール、研究論文、ニュースの厳選コレクション。<br />
                    カテゴリ別に整理され、簡単に検索できます。
                </p>

                <div className="flex justify-center gap-4 animate-fade-in delay-300" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <a href="#resources" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        リソースを探す <ArrowRight size={18} />
                    </a>
                </div>
            </div>
        </div>
    );
};
