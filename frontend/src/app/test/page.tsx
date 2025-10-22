'use client';

import { useEffect, useState } from 'react';
import { getArticles } from '@/lib/strapi';

export default function TestPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useDummyData, setUseDummyData] = useState(false);

  useEffect(() => {
    setUseDummyData(process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true');

    const fetchArticles = async () => {
      try {
        const result = await getArticles({ pageSize: 5 });
        setArticles(result.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">더미 데이터 테스트</h1>
      <div className="mb-4">
        <p>USE_DUMMY_DATA: {useDummyData ? 'true' : 'false'}</p>
        <p>환경 변수 값: {process.env.NEXT_PUBLIC_USE_DUMMY_DATA}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">아티클 목록 (최대 5개):</h2>
        {articles.length > 0 ? (
          <ul className="space-y-2">
            {articles.map((article: any) => (
              <li key={article.id} className="border p-2 rounded">
                <a href={`/articles/${article.slug}`} className="text-blue-600 hover:underline">
                  {article.title}
                </a>
                <p className="text-sm text-gray-600">Slug: {article.slug}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>아티클이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
