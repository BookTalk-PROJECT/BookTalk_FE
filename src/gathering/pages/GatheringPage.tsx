// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect, useRef } from 'react';

const App: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFooterHovered, setIsFooterHovered] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostElementRef = useRef<HTMLDivElement | null>(null);

    const generateMockPost = (index: number) => ({
        id: index,
        title: `독서모임 ${index}`,
        views: Math.floor(Math.random() * 1000),
        currentMembers: Math.floor(Math.random() * 8) + 2,
        maxMembers: 10,
        hashtags: ['#독서토론', '#자기계발', '#인문학', '#문학', '#심리학', '#철학'].sort(() => Math.random() - 0.5).slice(0, 3),
        imageUrl: `https://readdy.ai/api/search-image?query=Cozy%20book%20club%20meeting%20space%20with%20comfortable%20seating%2C%20warm%20lighting%2C%20bookshelves%2C%20and%20a%20welcoming%20atmosphere%2C%20modern%20minimalist%20interior%20design%20with%20natural%20elements&width=400&height=250&seq=${index}&orientation=landscape`
    });

    const POSTS_PER_PAGE = 9; //무한 스크롤 시 로딩될 모임게시물 수

    const loadMorePosts = () => {
        if (loading || !hasMore) return;
        setLoading(true);
        setTimeout(() => {
            const newPosts = Array.from({ length: POSTS_PER_PAGE }, (_, i) =>
                generateMockPost((page - 1) * POSTS_PER_PAGE + i + 1)
            );
            setPosts(prev => [...prev, ...newPosts]);
            setHasMore(page < 5);
            setLoading(false);
            setPage(prev => prev + 1);
        }, 1000);
    };

    useEffect(() => {
        loadMorePosts();
    }, []);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };

        observer.current = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting) {
                loadMorePosts();
            }
        }, options);

        if (lastPostElementRef.current) {
            observer.current.observe(lastPostElementRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [loading, hasMore]);

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold mr-6">톡톡</h1>
                        <nav className="hidden md:flex space-x-4">
                            <a href="#" className="text-gray-700 hover:text-red-500">메인</a>
                            <a href="#" className="text-gray-700 hover:text-red-500">찾기</a>
                            <a href="#" className="text-gray-700 hover:text-red-500">채팅</a>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                className="border border-gray-300 rounded-full py-2 px-4 text-sm w-[200px] focus:outline-none focus:ring-2 focus:ring-red-300"
                                placeholder="검색..."
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors">
                                <i className="fas fa-search text-sm"></i>
                            </button>
                        </div>
                        <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm !rounded-button whitespace-nowrap cursor-pointer">로그인</button>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm !rounded-button whitespace-nowrap cursor-pointer">가입</button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 mb-[280px]">
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-2">독서모임</h2>
                    <p className="text-center text-gray-600 mb-8">함께 읽고 나누는 독서의 즐거움</p>

                    <div className="flex justify-center mb-8">
                        <div className="relative w-full max-w-xl">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-full py-3 px-6 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                placeholder="관심있는 독서모임을 검색해보세요"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors">
                                <i className="fas fa-search text-lg"></i>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-2">정렬:</span>
                            <button className="bg-white border border-gray-300 rounded-full px-4 py-1 text-sm hover:bg-gray-100 !rounded-button whitespace-nowrap cursor-pointer">인기순</button>
                        </div>
                        <div className="flex items-center">
                            <span className="text-red-500 font-medium mr-2">오늘의 리뷰</span>
                            <span className="bg-red-100 text-red-500 rounded-full px-2 py-0.5 text-xs">7개</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, index) => (
                            <div
                                key={post.id}
                                ref={index === posts.length - 1 ? lastPostElementRef : null}
                                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                            >
                                <div className="relative">
                                    <img
                                        src={post.imageUrl}
                                        alt="영상 썸네일"
                                        className="w-full h-48 object-cover object-top"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-lg mb-3">{post.title}</h3>
                                    <div className="flex flex-col space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center">
                                                <i className="fas fa-users text-red-500 mr-2"></i>
                                                <span className="text-gray-700">{post.currentMembers}/{post.maxMembers}명</span>
                                            </div>
                                            <span className="text-gray-600">조회 {post.views}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {post.hashtags.map((tag: string, tagIndex: number) => (
                                                <span
                                                    key={tagIndex}
                                                    className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs hover:bg-blue-100 transition-colors cursor-pointer"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center mt-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                        </div>
                    )}

                    {!hasMore && !loading && (
                        <div className="text-center text-gray-500 mt-8 text-sm">
                            더 이상 모임을 찾을 수 없습니다.
                        </div>
                    )}
                </section>
            </main>

            <footer
                className="bg-gray-100 border-t border-gray-200 fixed bottom-0 w-full transition-all duration-300"
                onMouseEnter={() => setIsFooterHovered(true)}
                onMouseLeave={() => setIsFooterHovered(false)}
            >
                <div className={`container mx-auto px-4 overflow-hidden transition-all duration-300 ${isFooterHovered ? 'py-6' : 'py-2'}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <h2 className="text-lg font-bold">톡톡</h2>
                            <p className="text-sm text-gray-600 ml-4">© 2025 톡톡 커뮤니티</p>
                        </div>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-600 hover:text-red-500">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="text-gray-600 hover:text-red-500">
                                <i className="fab fa-twitter"></i>
                            </a>
                        </div>
                    </div>
                    <div className={`transition-all duration-300 ${isFooterHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'}`}>
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div className="mb-4 md:mb-0">
                                    <p className="text-sm text-gray-600">모든 권리 보유.</p>
                                </div>
                                <div className="flex space-x-6">
                                    <a href="#" className="text-gray-600 hover:text-red-500">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="#" className="text-gray-600 hover:text-red-500">
                                        <i className="fab fa-youtube"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm text-gray-600">
                                <div className="flex justify-center space-x-4 mb-2">
                                    <a href="#" className="hover:text-red-500">서비스 약관</a>
                                    <a href="#" className="hover:text-red-500">개인정보 처리방침</a>
                                    <a href="#" className="hover:text-red-500">문의하기</a>
                                </div>
                                <p>서울특별시 강남구 테헤란로 123 톡톡빌딩 4층</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;

