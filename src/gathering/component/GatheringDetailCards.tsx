import React from "react";

interface Book {
    id: number;
    title: string;
    author: string;
    status: string;
    date: string;
}

interface BookCardListProps {
    books: Book[];
}

const BookCardList: React.FC<BookCardListProps> = ({ books }) => {
    return (
        <div
            className="books-container overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}
        >
            <div className="inline-flex gap-6 min-w-max pb-4">
                {[...books, ...books, ...books].map((book, index) => (
                    <div key={`${book.id}-${index}`} className="w-[300px] cursor-pointer group">
                        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                            {/* 이미지 영역 */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={`https://readdy.ai/api/search-image?query=modern%20minimalist%20book%20cover%20design%20with%20abstract%20geometric%20patterns%20and%20sophisticated%20typography%20on%20clean%20background%20professional%20publishing%20quality&width=400&height=400&seq=${book.id}&orientation=squarish`}
                                    alt={book.title}
                                    className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* 내용 영역 */}
                            <div className="p-4">
                                {/* 제목 + 상태 뱃지 */}
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium text-base text-gray-900">{book.title}</h3>
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${book.status === "예정"
                                            ? "bg-green-500 text-white"
                                            : book.status === "읽는중"
                                                ? "bg-yellow-500 text-white"
                                                : book.status === "완료"
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-400 text-white"
                                            }`}
                                    >
                                        {book.status}
                                    </span>
                                </div>

                                {/* 저자명 + 날짜 */}
                                <div className="flex items-center text-sm text-gray-500">
                                    <span>{book.author}</span>
                                    <span className="ml-auto flex items-center">
                                        <i className="far fa-calendar-alt mr-1"></i>
                                        {book.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookCardList;
