// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from "react";
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
    const { id } = useParams();
    // 책 데이터
    const books = [
        {
            id: 1,
            title: "책이름1",
            author: "저자명",
            status: "완료",
            date: "2023-02-24",
            views: 33,
        },
        {
            id: 2,
            title: "책이름2",
            author: "저자명",
            status: "진행중",
            date: "2023-03-15",
            views: 45,
        },
        {
            id: 3,
            title: "책이름3",
            author: "저자명",
            status: "예정",
            date: "2023-04-01",
            views: 27,
        },
    ];
    // 게시판 데이터
    const posts = [
        {
            id: 32,
            title: "독서모임 후기 1",
            date: "2023-02-24",
            author: "이름님",
            views: 33,
        },
        {
            id: 31,
            title: "독서모임 리뷰 1",
            date: "2023-03-04",
            author: "이름님",
            views: 1511,
        },
        {
            id: 30,
            title: "독서모임 후기 1",
            date: "2023-02-24",
            author: "박이름",
            views: 2,
        },
        {
            id: 29,
            title: "독서모임 후기 1",
            date: "2023-02-24",
            author: "김이름",
            views: 7,
        },
        {
            id: 28,
            title: "독서모임 후기 1",
            date: "2023-02-24",
            author: "박이름",
            views: 32,
        },
        {
            id: 27,
            title: "독서모임 후기 1",
            date: "2023-02-23",
            author: "박이름",
            views: 1,
        },
        {
            id: 26,
            title: "독서모임 후기 1",
            date: "2023-02-23",
            author: "황이름",
            views: 5,
        },
        {
            id: 25,
            title: "독서 1",
            date: "2023-02-23",
            author: "박이름",
            views: 134,
        },
    ];
    // 상태 태그 색상
    const getStatusColor = (status: string) => {
        switch (status) {
            case "진행중":
                return "bg-yellow-500";
            case "완료":
                return "bg-blue-500";
            case "예정":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-center mb-6">모임명 {id}</h2>
                        <p className="text-center text-gray-600 mb-2">즐거운 독서</p>
                    </div>
                    {/* 책 리스트 */}
                    <div className="relative mb-8">
                        {/* 책 리스트 내부 전체를 좌우 여백 포함한 wrapper로 한번 더 감쌈 */}
                        <div className="relative flex items-center justify-between mb-2 px-8">
                            {/* 왼쪽 화살표 */}
                            <button
                                className="absolute left-0 z-10 bg-white shadow-md hover:bg-gray-100 p-2 rounded-full transition"
                                style={{ transform: 'translate(-50%, 0)' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* 카드 리스트 */}
                            <div className="overflow-x-hidden w-full relative">
                                <div className="flex space-x-6 pr-6">
                                    {books.map((book) => (
                                        <div key={book.id} className="flex-shrink-0 w-[32%]"> {/* 기존 w-1/3 → w-[30%] */}
                                            <div className="relative bg-white rounded-lg shadow overflow-hidden">
                                                <img
                                                    src={`https://readdy.ai/api/search-image?query=book%20cover%20design%2C%20minimalist%20style%2C%20abstract%20art%2C%20professional%20layout%2C%20elegant%20typography%2C%20clean%20background%2C%20high%20quality%20book%20cover&width=150&height=200&seq=${book.id}&orientation=portrait`}
                                                    alt={book.title}
                                                    className="w-full h-40 object-cover object-top"
                                                />
                                                <div className="absolute bottom-0 right-0">
                                                    <span className={`px-2 py-0.5 text-white text-xs ${getStatusColor(book.status)}`}>
                                                        {book.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <h4 className="text-sm font-semibold">{book.title}</h4>
                                                <p className="text-xs text-gray-600">{book.author}</p>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>

                            {/* 오른쪽 화살표 */}
                            <button
                                className="absolute right-0 z-10 bg-white shadow-md hover:bg-gray-100 p-2 rounded-full transition"
                                style={{ transform: 'translate(50%, 0)' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>


                    {/* 게시판 */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-center">게시판</h3>
                            <button className="px-4 py-2 bg-gray-800 text-white rounded-button whitespace-nowrap cursor-pointer">
                                글쓰기
                            </button>
                        </div>
                        <div className="border rounded overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 text-sm">
                                        <th className="py-2 px-3 text-center">번호</th>
                                        <th className="py-2 px-3 text-center">제목</th>
                                        <th className="py-2 px-3 text-center">날짜</th>
                                        <th className="py-2 px-3 text-center">작성자</th>
                                        <th className="py-2 px-3 text-center">조회수</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-50 text-sm">
                                        <td className="py-2 px-3 text-center">공지</td>
                                        <td className="py-2 px-3">
                                            독서모임을 진행할 때 지켜야할 사항을 안내합니다.
                                        </td>
                                        <td className="py-2 px-3 text-center">2024-01-01</td>
                                        <td className="py-2 px-3 text-center">관리자</td>
                                        <td className="py-2 px-3 text-center">10023</td>
                                    </tr>
                                    {posts.map((post) => (
                                        <tr
                                            key={post.id}
                                            className={
                                                post.id === 32 ? "bg-red-100 text-sm" : "text-sm border-t"
                                            }
                                        >
                                            <td className="py-2 px-3 text-center">{post.id}</td>
                                            <td className="py-2 px-3">{post.title}</td>
                                            <td className="py-2 px-3 text-center">{post.date}</td>
                                            <td className="py-2 px-3 text-center">{post.author}</td>
                                            <td className="py-2 px-3 text-center">{post.views}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <br />
                        <div className="flex justify-center mt-4 space-x-1">
                            <button className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center cursor-pointer">
                                1
                            </button>
                            {[2, 3, 4, 5, 6].map((page) => (
                                <button
                                    key={page}
                                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <br />
                        <div className="flex justify-center mt-4">
                            <button className="px-6 py-2 bg-gray-800 text-white rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-900 transition-colors duration-200">
                                신청하기
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};
export default App;
