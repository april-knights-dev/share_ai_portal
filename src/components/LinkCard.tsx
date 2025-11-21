import React from 'react';
import { ExternalLink, Calendar, Tag } from 'lucide-react';
import type { LinkItem } from '../data/mockData';

interface LinkCardProps {
    item: LinkItem;
}

export const LinkCard: React.FC<LinkCardProps> = ({ item }) => {
    return (
        <div className="glass-panel flex flex-col h-full overflow-hidden hover:border-purple-500/50 transition-colors duration-300 group" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="relative h-48 overflow-hidden">
                <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            <div className="p-6 flex-1 flex flex-col" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="flex items-center justify-between mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30" style={{ padding: '0.125rem 0.625rem', borderRadius: '9999px', background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                        {item.category}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        <Calendar size={14} />
                        <span>{item.date}</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-2 font-heading leading-tight group-hover:text-purple-400 transition-colors" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                </h3>

                <p className="text-secondary text-sm mb-4 line-clamp-2 flex-1" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>
                    {item.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {item.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-white/5 text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                            <Tag size={10} />
                            {tag}
                        </span>
                    ))}
                </div>

                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost w-full justify-center group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    サイトを見る <ExternalLink size={16} />
                </a>
            </div>
        </div>
    );
};
