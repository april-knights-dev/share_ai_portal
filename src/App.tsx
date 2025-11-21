import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { LinkCard } from './components/LinkCard';
import { Footer } from './components/Footer';
import { mockData as originalMockData } from './data/mockData';
import type { Category } from './data/mockData';

// URLベースで重複排除
const mockData = originalMockData.filter((item, index, self) =>
  index === self.findIndex((t) => (
    t.url === item.url
  ))
);

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const filteredData = useMemo(() => {
    return mockData.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-1" style={{ flex: 1 }}>
        <Hero />

        <div className="container" id="resources">
          <FilterBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {filteredData.map(item => (
                <LinkCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-panel rounded-2xl" style={{ textAlign: 'center', padding: '5rem 0', background: 'var(--bg-card)', borderRadius: '1rem' }}>
              <h3 className="text-2xl font-bold mb-2" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>結果が見つかりませんでした</h3>
              <p className="text-secondary" style={{ color: 'var(--text-secondary)' }}>検索ワードやカテゴリを変更してみてください。</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-6 text-purple-400 hover:text-purple-300 underline cursor-pointer"
                style={{ marginTop: '1.5rem', color: '#c084fc', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                フィルターをクリア
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
