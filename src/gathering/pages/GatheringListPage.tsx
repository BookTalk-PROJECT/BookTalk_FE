import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';


const App: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('전체');
    const [isFooterHovered, setIsFooterHovered] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const lastPostElementRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const statuses = ["모집중", "진행중", "완료"];

    const POSTS_PER_PAGE = 9; //무한 스크롤 시 로딩될 모임게시물 수

    const generateMockPost = (index: number) => {
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        return {
            id: index,
            title: `독서모임 ${index}`,
            views: Math.floor(Math.random() * 1000),
            currentMembers: Math.floor(Math.random() * 8) + 2,
            maxMembers: 10,
            status, // 상태 필드 추가
            hashtags: ['#독서토론', '#자기계발', '#인문학', '#문학', '#심리학', '#철학'].sort(() => Math.random() - 0.5).slice(0, 3),
            imageUrl: `https://readdy.ai/api/search-image?query=Cozy%20book%20club%20meeting%20space%20with%20comfortable%20seating%2C%20warm%20lighting%2C%20bookshelves%2C%20and%20a%20welcoming%20atmosphere%2C%20modern%20minimalist%20interior%20design%20with%20natural%20elements&width=400&height=250&seq=${index}&orientation=landscape`
        };
    };

    const fetchFilteredPosts = (pageNum: number) => {
        const generatedPosts = Array.from({ length: 100 }, (_, i) =>
            generateMockPost(i + 1)
        );

        return generatedPosts.filter(post => {
            const matchStatus = statusFilter === '전체' || post.status === statusFilter;
            const matchSearch = post.title.includes(searchQuery);
            return matchStatus && matchSearch;
        }).slice((pageNum - 1) * POSTS_PER_PAGE, pageNum * POSTS_PER_PAGE);
    };

    const loadMorePosts = () => {
        if (loading || !hasMore) return;
        setLoading(true);

        setTimeout(() => {
            const newPosts = fetchFilteredPosts(page);
            setPosts(prev => [...prev, ...newPosts]);
            setHasMore(newPosts.length === POSTS_PER_PAGE);
            setLoading(false);
            setPage(prev => prev + 1);
        }, 500);
    };

    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
    }, [statusFilter]);

    useEffect(() => {
        if (page === 1) {
            loadMorePosts();
        }
    }, [page]);

    const handleSearch = () => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
    };

    useEffect(() => {
        if (!lastPostElementRef.current) return;

        const options = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };

        const currentObserver = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting) {
                loadMorePosts();
            }
        }, options);

        currentObserver.observe(lastPostElementRef.current);

        return () => currentObserver.disconnect();
    }, [posts, loading, hasMore]);


    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 py-8 mb-[280px]">
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-2">독서모임</h2>
                    <p className="text-center text-gray-600 mb-8">함께 읽고 나누는 독서의 즐거움</p>

                    <div className="flex items-center justify-between mb-8 border-b border-gray-300 pb-2">
                        {/* 왼쪽: 탭 필터 */}
                        <div className="flex items-center gap-6">
                            <div className="flex space-x-6">
                                {["전체", "모집중", "진행중", "완료"].map((label) => (
                                    <button
                                        key={label}
                                        onClick={() => setStatusFilter(label)}
                                        className={`pb-2 text-sm font-medium transition-all duration-200 ${statusFilter === label
                                            ? "text-black border-b-2 border-black"
                                            : "text-gray-500 hover:text-black"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 오른쪽: 모임 개설 버튼 + 검색창 */}
                        <div className="flex items-center gap-4">
                            <button className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition whitespace-nowrap">
                                모임 개설
                            </button>

                            <div className="flex items-center gap-0">
                                {/* 드롭다운 - 검색 기준 선택 */}
                                <select
                                    className="border border-gray-300 py-2 px-4 text-sm text-gray-700 rounded-l-full focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                                    defaultValue="전체"
                                >
                                    <option value="전체">모임이름 또는 닉네임</option>
                                    <option value="모임이름">모임이름</option>
                                    <option value="닉네임">닉네임(모임장)</option>
                                </select>

                                {/* 검색 입력창 */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch(); // ⌨️ 엔터 시 검색
                                            }
                                        }}
                                        className="border border-l-0 border-gray-300 py-2 px-4 pr-10 text-sm text-gray-700 rounded-r-full focus:outline-none focus:ring-2 focus:ring-red-300"
                                        placeholder="검색어를 입력해주세요..."
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs px-3 py-1 rounded-full hover:bg-gray-800 transition-all shadow-sm"
                                    >
                                        검색
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, index) => (
                            <div
                                key={post.id}
                                onClick={() => navigate(`/gathering/${post.id}`)}
                                ref={index === posts.length - 1 ? lastPostElementRef : null}
                                className="cursor-pointer bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-gray-100"
                            >
                                <div className="relative">
                                    <img
                                        src={post.imageUrl}
                                        alt="영상 썸네일"
                                        className="w-full h-48 object-cover object-top"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{post.title}</h3>
                                    <div className="flex flex-col space-y-3">
                                        {/* 인원 및 조회수 */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center">
                                                <i className="fas fa-users text-red-500 mr-2"></i>
                                                <span className="text-gray-700 font-medium">
                                                    {post.currentMembers}/{post.maxMembers}명
                                                </span>
                                            </div>
                                            <span className="text-gray-500">조회수 {post.views}</span>
                                        </div>
                                        {/* 해시태그 및 상태 뱃지 */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-wrap gap-2">
                                                {post.hashtags.map((tag: string, tagIndex: number) => (
                                                    <span
                                                        key={tagIndex}
                                                        className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs hover:bg-blue-200 transition"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap
                                                    ${post.status === "모집중"
                                                        ? "bg-green-100 text-green-600"
                                                        : post.status === "진행중"
                                                            ? "bg-yellow-100 text-yellow-600"
                                                            : "bg-gray-200 text-gray-600"
                                                    }`}
                                            >
                                                {post.status}
                                            </span>
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

            <Footer />
        </div>
    );
}

export default App;

