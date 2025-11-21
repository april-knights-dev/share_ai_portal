import posts from './posts.json';

export type Category = 'LLM' | '画像/動画' | '開発/コード' | 'リサーチ' | 'ツール' | 'ニュース';

export interface LinkItem {
    id: string;
    url: string;
    title: string;
    description: string;
    category: Category;
    tags: string[];
    date: string;
    imageUrl: string;
}

// JSONデータを型キャストしてエクスポート
export const mockData: LinkItem[] = posts as LinkItem[];
