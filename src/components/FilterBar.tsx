import React from 'react';
import type { Category } from '../data/mockData';

interface FilterBarProps {
    selectedCategory: Category | 'All';
    setSelectedCategory: (category: Category | 'All') => void;
}

const categories: (Category | 'All')[] = ['All', 'LLM', '画像/動画', '開発/コード', 'リサーチ', 'ツール', 'ニュース'];

export const FilterBar: React.FC<FilterBarProps> = ({ selectedCategory, setSelectedCategory }) => {
    return (
        <div className="flex justify-start md:justify-center mb-12 overflow-x-auto pb-4 px-4 no-scrollbar" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '3rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            <div className="glass-panel p-1.5 flex gap-1 rounded-full mx-auto md:mx-0" style={{ padding: '0.375rem', display: 'flex', gap: '0.25rem', borderRadius: '9999px', minWidth: 'max-content' }}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
              ${selectedCategory === cat
                                ? 'bg-white text-black shadow-lg shadow-white/10'
                                : 'text-secondary hover:text-white hover:bg-white/5'}
            `}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            border: 'none',
                            cursor: 'pointer',
                            background: selectedCategory === cat ? 'white' : 'transparent',
                            color: selectedCategory === cat ? 'black' : 'var(--text-secondary)',
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
};
