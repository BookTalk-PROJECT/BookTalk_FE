// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface Book {
    id: number;
    title: string;
    author: string;
    status: string;
    date: string;
    views: number;
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
    const books = [
        { id: 1, title: '책이름1', author: '저자명', status: '완료', date: '2023-02-24', views: 33 },
        { id: 2, title: '책이름2', author: '저자명', status: '읽는중', date: '2023-03-15', views: 45 },
        { id: 3, title: '책이름3', author: '저자명', status: '예정', date: '2023-04-01', views: 27 },
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
    return (
        <div className="min-h-screen bg-white">
            <Header />
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
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200">
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200">
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-6">
                                {books.map((book) => (
                                    <div key={book.id} className="w-[calc(33.33%-1rem)] relative group cursor-pointer">
                                        <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden mb-4">
                                                <img
                                                    src={`https://readdy.ai/api/search-image?query=modern%20minimalist%20book%20cover%20design%20with%20abstract%20geometric%20patterns%20and%20sophisticated%20typography%20on%20clean%20background%20professional%20publishing%20quality&width=400&height=400&seq=${book.id}&orientation=squarish`}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-white text-xs ${getStatusColor(book.status)}`}>
                                                        {book.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600">{book.author}</p>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <i className="fas fa-calendar ml-4 mr-2"></i>
                                                    <span>{book.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 border-t">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold">게시판</h2>
                                <button className="px-4 py-2 bg-gray-800 text-white rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-900">
                                    <i className="fas fa-pen mr-2"></i>글쓰기
                                </button>
                            </div>
                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 text-sm">
                                            <th className="px-6 py-3 text-left">제목</th>
                                            <th className="px-6 py-3 text-center w-32">작성자</th>
                                            <th className="px-6 py-3 text-center w-32">작성일</th>
                                            <th className="px-6 py-3 text-center w-24">조회</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {posts.map((post) => (
                                            <tr key={post.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <a href={`/gatheringList/gatheringboard${post.id}`} className="text-gray-900 hover:text-blue-600">
                                                        {post.title}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm text-gray-500">{post.author}</td>
                                                <td className="px-6 py-4 text-center text-sm text-gray-500">{post.date}</td>
                                                <td className="px-6 py-4 text-center text-sm text-gray-500">{post.views}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-center mt-6 space-x-1">
                                {[1, 2, 3, 4, 5].map((page) => (
                                    <button
                                        key={page}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full ${page === currentPage ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            } cursor-pointer transition-colors duration-200`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br /><br />
            <Footer />
        </div>
    );
};
export default App
