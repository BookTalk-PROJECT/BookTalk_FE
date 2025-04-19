import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
interface Book {
    id: number;
    title: string;
    author: string;
    status: string;
    date: string;
}
interface Post {
    id: number;
    title: string;
    date: string;
    author: string;
    views: number;
}
const App: React.FC = () => {
    const [selectedBook, setSelectedBook] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { id, postId } = useParams<{ id: string; postId: string }>();
    const navigate = useNavigate();
    const books = [
        { id: 1, title: '책이름1', author: '저자명', status: '완료', date: '2023-02-24' },
        { id: 2, title: '책이름2', author: '저자명', status: '읽는중', date: '2023-03-15' },
        { id: 3, title: '책이름3', author: '저자명', status: '예정', date: '2023-04-01' },
    ];
    const posts = [
        { id: 32, title: '독서모임 후기 1', date: '2023-02-24', author: '이름님', views: 33 },
        { id: 31, title: '독서모임 리뷰 1', date: '2023-03-04', author: '이름님', views: 1511 },
        { id: 30, title: '독서모임 후기 1', date: '2023-02-24', author: '박이름', views: 2 },
        { id: 29, title: '독서모임 후기 1', date: '2023-02-24', author: '김이름', views: 7 },
        { id: 28, title: '독서모임 후기 1', date: '2023-02-24', author: '박이름', views: 32 },
        { id: 27, title: '독서모임 후기 1', date: '2023-02-23', author: '박이름', views: 1 },
        { id: 26, title: '독서모임 후기 1', date: '2023-02-23', author: '황이름', views: 5 },
        { id: 25, title: '독서 1', date: '2023-02-23', author: '박이름', views: 134 },
    ];
    const getStatusColor = (status: string) => {
        switch (status) {
            case '진행중': return 'bg-yellow-500';
            case '모집중': return 'bg-green-500';
            case '완료': return 'bg-blue-500';
            case '예정': return 'bg-red-500';
            case '읽는중': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const handleGoList = (id: number | string) => {
        navigate(`/gatheringlist/${id}`);
    };

    const handleGoBoard = (id: number | string, postId: number | string) => {
        navigate(`/gatheringlist/${id}/gatheringboard/${postId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold">즐거운 독서</h1>
                            <div className="flex space-x-3">
                                <button className="px-4 py-2 text-sm bg-gray-100 rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-200">
                                    <i className="fas fa-share-alt mr-2"></i>공유하기
                                </button>
                                <button className="px-4 py-2 text-sm bg-gray-800 text-white rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-900">
                                    <i className="fas fa-user-plus mr-2"></i>가입하기
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span><i className="fas fa-users mr-2"></i>멤버 32명</span>
                            <span><i className="fas fa-book mr-2"></i>진행중인 책 2권</span>
                            <span><i className="fas fa-calendar mr-2"></i>매주 화요일</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold">독서 목록</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        const container = document.querySelector('.books-container') as HTMLElement;
                                        if (container) {
                                            container.scrollLeft -= container.offsetWidth;
                                        }
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button
                                    onClick={() => {
                                        const container = document.querySelector('.books-container') as HTMLElement;
                                        if (container) {
                                            container.scrollLeft += container.offsetWidth;
                                        }
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200"
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                        <div className="books-container overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }}>
                            <div className="inline-flex gap-6 min-w-max pb-4">
                                {[...books, ...books, ...books].map((book, index) => (
                                    <div key={`${book.id}-${index}`} className="w-[300px] relative group cursor-pointer">
                                        <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden mb-4">
                                                <img
                                                    src={`https://readdy.ai/api/search-image?query=modern%20minimalist%20book%20cover%20design%20with%20abstract%20geometric%20patterns%20and%20sophisticated%20typography%20on%20clean%20background%20professional%20publishing%20quality&width=400&height=400&seq=${book.id}&orientation=squarish`}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-white text-xs ${getStatusColor(book.status)}`}>
                                                        {book.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <p className="text-gray-600">{book.author}</p>
                                                    <div className="flex items-center text-gray-500">
                                                        <i className="fas fa-calendar mr-2"></i>
                                                        <span>{book.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold">독서모임 후기 1</h1>
                                <div className="flex items-center space-x-4">
                                    <button className="px-4 py-2 text-sm bg-gray-100 rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-200">
                                        <i className="fas fa-edit mr-2"></i>수정
                                    </button>
                                    <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-button whitespace-nowrap cursor-pointer hover:bg-red-600">
                                        <i className="fas fa-trash-alt mr-2"></i>삭제
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 space-x-4 pb-4 border-b">
                                <span><i className="fas fa-user mr-2"></i>이름님</span>
                                <span><i className="fas fa-calendar mr-2"></i>2023-02-24</span>
                                <span><i className="fas fa-eye mr-2"></i>조회 33</span>
                                <span><i className="fas fa-heart mr-2"></i>좋아요 15</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-6">
                                <img
                                    src="https://readdy.ai/api/search-image?query=modern%20book%20club%20meeting%20with%20people%20discussing%20literature%20in%20a%20contemporary%20minimalist%20setting%20with%20warm%20lighting%20and%20comfortable%20seating%20arrangement&width=1200&height=675&seq=1&orientation=landscape"
                                    alt="독서모임 사진"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="prose max-w-none">
                                <p className="text-gray-800 leading-relaxed">
                                    오늘 진행된 독서모임에서는 '책이름1'을 가지고 깊이 있는 토론을 진행했습니다.
                                    참여하신 모든 분들이 각자의 관점에서 책을 해석하고 의견을 나누는 시간을 가졌습니다.
                                    특히 작가가 전달하고자 했던 메시지에 대해 다양한 해석이 오갔으며,
                                    현대 사회에서 이 책이 가지는 의미에 대해서도 깊이 있게 이야기를 나눴습니다.
                                </p>
                                <p className="text-gray-800 leading-relaxed mt-4">
                                    다음 모임에서는 '책이름2'를 읽고 토론할 예정입니다.
                                    관심 있는 분들의 많은 참여 부탁드립니다.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-2 mb-8">
                            <button className="px-6 py-3 bg-gray-100 rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-200 flex items-center">
                                <i className="fas fa-heart mr-2 text-red-500"></i>
                                <span>좋아요</span>
                                <span className="ml-2 text-gray-600">15</span>
                            </button>
                        </div>

                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">댓글 <span className="text-gray-500">3</span></h3>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-grow">
                                        <textarea
                                            className="w-full h-[90px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            placeholder="댓글을 작성해주세요."
                                        ></textarea>
                                    </div>
                                    <button
                                        className="h-[90px] px-6 bg-gray-800 text-white rounded-lg whitespace-nowrap cursor-pointer hover:bg-gray-900 flex items-center justify-center"
                                    >
                                        등록
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { author: "김독서", content: "좋은 후기 감사합니다. 다음 모임이 기대되네요!", date: "2023-02-24", likes: 5 },
                                    { author: "박책읽기", content: "저도 참여했었는데, 정말 유익한 시간이었습니다.", date: "2023-02-24", likes: 3 },
                                    { author: "이독후감", content: "다음 모임에는 꼭 참여하고 싶네요!", date: "2023-02-23", likes: 2 }
                                ].map((comment, index) => (
                                    <div key={index} className="border-b pb-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold">{comment.author}</span>
                                                <span className="text-sm text-gray-500">{comment.date}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button className="text-sm text-gray-500 hover:text-gray-700">
                                                    <i className="fas fa-heart mr-1"></i>{comment.likes}
                                                </button>
                                                <button className="text-sm text-gray-500 hover:text-gray-700">
                                                    <i className="fas fa-reply mr-1"></i>답글
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-800">{comment.content}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <button className="px-4 py-2 text-sm bg-gray-100 rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-200">
                                    <i className="fas fa-arrow-left mr-2"></i>이전 글
                                </button>
                                <button className="px-4 py-2 text-sm bg-gray-800 text-white rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-900">
                                    <i className="fas fa-list mr-2"></i>목록
                                </button>
                                <button className="px-4 py-2 text-sm bg-gray-100 rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-200">
                                    다음 글<i className="fas fa-arrow-right ml-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br /><br />
        </div>
    );
};
export default App
