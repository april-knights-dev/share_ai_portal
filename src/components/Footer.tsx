import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-white/10 mt-20 py-12 bg-black/20" style={{ borderTop: '1px solid var(--border-color)', marginTop: '5rem', padding: '3rem 0', background: 'rgba(0,0,0,0.2)' }}>
            <div className="container text-center">
                <p className="text-secondary mb-4" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    #share_ai コミュニティのために作成されました。
                </p>
                <p className="mt-8 text-xs text-gray-600" style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#4b5563' }}>
                    © 2025 ShareAI Portal. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
