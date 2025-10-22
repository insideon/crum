'use client';

interface SocialShareProps {
  title: string;
  url: string;
}

export function SocialShare({ title, url }: SocialShareProps) {
  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('링크가 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('링크 복사 실패:', err);
    }
  };

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="bg-card border rounded-lg p-2 shadow-lg">
        <div className="space-y-2">
          <button
            className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
            onClick={handleTwitterShare}
            title="트위터 공유"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </button>
          <button
            className="w-10 h-10 bg-blue-800 text-white rounded-lg flex items-center justify-center hover:bg-blue-900 transition-colors"
            onClick={handleFacebookShare}
            title="페이스북 공유"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button
            className="w-10 h-10 bg-gray-600 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            onClick={handleCopyLink}
            title="링크 복사"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
