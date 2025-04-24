// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
const GatheringCreatePage: React.FC = () => {
    interface Book {
        id: number;
        name: string;
        startDate: string;
        status: 'planned' | 'in_progress' | 'completed';
    }

    const [books, setBooks] = useState<Book[]>([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Array<{ id: string, title: string }>>([]);
    const [groupName, setGroupName] = useState('');
    const [recruitmentPeriod, setRecruitmentPeriod] = useState('');
    const [activityPeriod, setActivityPeriod] = useState('');
    const [location, setLocation] = useState('');
    const [meetingFormat, setMeetingFormat] = useState('');
    const [meetingDetails, setMeetingDetails] = useState('');
    const [messageMethod, setMessageMethod] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState([
        { id: 1, text: '어떤 책을 좋아하세요?', expanded: false, answer: '' },
    ]);
    const handleAddQuestion = () => {
        if (newQuestion.trim() && questions.length < 5) {
            const newId = Math.max(...questions.map(q => q.id), 0) + 1;
            setQuestions([...questions, {
                id: newId,
                text: newQuestion,
                expanded: false,
                answer: ''
            }]);
            setNewQuestion('');
        }
    };
    const handleRemoveQuestion = (id: number) => {
        setQuestions(questions.filter(q => q.id !== id));
    };
    const toggleQuestion = (id: number) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, expanded: !q.expanded } : q
        ));
    };
    const handleAnswerChange = (id: number, value: string) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, answer: value } : q
        ));
    };
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <div className="w-full max-w-[1440px] min-h-[1024px] bg-white mx-auto">
                {/* 헤더 섹션 */}
                <div className="bg-gray-100 py-12 text-center">
                    <h1 className="text-4xl font-bold mb-2">책톡</h1>
                    <p className="text-gray-600">독서모임 커뮤니티</p>
                </div>
                {/* 메인 컨텐츠 */}
                <div className="p-8 max-w-7xl mx-auto">
                    <h2 className="text-xl font-bold mb-1">모임</h2>
                    <p className="text-gray-600 mb-6">모임개설 신청</p>
                    {/* 상단 섹션 */}
                    <div className="w-full">
                        {/* 책 카드 섹션 */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            {books.map((book) => (
                                <div key={book.id} className="w-[240px] h-[160px] bg-white rounded-lg shadow-md p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-medium text-lg">{book.name}</h3>
                                        <button className="text-gray-500">
                                            <i className="fas fa-ellipsis-v"></i>
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        시작일: {book.startDate}
                                    </div>
                                    <div className="flex justify-end">
                                        <span className={`text-xs px-2 py-1 rounded ${book.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            book.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {book.status === 'completed' ? '완료' :
                                                book.status === 'in_progress' ? '진행중' : '예정'}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {books.length === 0 && (
                                <button
                                    onClick={() => setIsSearchModalOpen(true)}
                                    className="w-[240px] h-[160px] bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                >
                                    <i className="fas fa-plus text-2xl text-gray-600"></i>
                                </button>
                            )}
                        </div>

                        {/* 검색 모달 */}
                        {isSearchModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-6 w-[480px]">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold">책 검색</h2>
                                        <button onClick={() => setIsSearchModalOpen(false)} className="text-gray-500">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>

                                    <div className="relative mb-4">
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2"
                                            placeholder="도서명을 입력하세요"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    </div>

                                    <div className="max-h-[320px] overflow-y-auto">
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.id}
                                                className="w-full text-left p-3 hover:bg-gray-100 rounded-lg mb-2"
                                                onClick={() => {
                                                    setBooks([{
                                                        id: Date.now(),
                                                        name: result.title,
                                                        startDate: new Date().toISOString().split('T')[0],
                                                        status: 'planned'
                                                    }]);
                                                    setIsSearchModalOpen(false);
                                                }}
                                            >
                                                {result.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* 기준 정보와 가입 질문 섹션 */}
                        <div className="flex gap-8">
                            {/* 기준 정보 섹션 */}
                            <div className="flex-1">
                                <h3 className="text-lg font-bold mb-4">기준 정보</h3>
                                <div className="mb-4">
                                    <label className="block text-sm text-purple-700 mb-1">모임명</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full border border-purple-300 rounded p-2 pr-10"
                                            placeholder="모임명을 입력해세요"
                                            value={groupName}
                                            onChange={(e) => setGroupName(e.target.value)}
                                        />
                                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded !rounded-button whitespace-nowrap cursor-pointer">
                                            중복 체크
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm text-purple-700 mb-1">모집기간</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full border border-purple-300 rounded p-2"
                                            placeholder="모집기간을 선택해주세요"
                                            value={recruitmentPeriod}
                                            onChange={(e) => setRecruitmentPeriod(e.target.value)}
                                        />
                                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            <i className="far fa-calendar"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm text-purple-700 mb-1">활동기간</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full border border-purple-300 rounded p-2"
                                            placeholder="활동기간을 선택해주세요"
                                            value={activityPeriod}
                                            onChange={(e) => setActivityPeriod(e.target.value)}
                                        />
                                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            <i className="far fa-calendar"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm text-purple-700 mb-1">지역</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full border border-purple-300 rounded p-2"
                                            placeholder="도시 지역을 입력하세요"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            <i className="fas fa-search"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm text-purple-700 mb-1">모임 방법</label>
                                    <input
                                        type="text"
                                        className="w-full border border-purple-300 rounded p-2"
                                        placeholder="모임 방법을 입력하세요"
                                        value={meetingFormat}
                                        onChange={(e) => setMeetingFormat(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm text-purple-700 mb-1">모임 소개</label>
                                    <textarea
                                        className="w-full border border-purple-300 rounded p-2"
                                        placeholder="모임 소개를 입력해주세요"
                                        rows={3}
                                        value={meetingDetails}
                                        onChange={(e) => setMeetingDetails(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm text-purple-700 mb-1">메시지 방법</label>
                                    <input
                                        type="text"
                                        className="w-full border border-purple-300 rounded p-2"
                                        placeholder="메시지 방법을 입력하세요"
                                        value={messageMethod}
                                        onChange={(e) => setMessageMethod(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* 가입 질문 섹션 */}
                            <div className="flex-1">
                                <div>
                                    <h3 className="text-lg font-bold mb-4">가입 질문</h3>
                                    <div className="mb-4">
                                        <label className="block text-sm text-purple-700 mb-1">질문</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full border border-purple-300 rounded p-2"
                                                placeholder="질문 사항을 입력하세요"
                                                value={newQuestion}
                                                onChange={(e) => setNewQuestion(e.target.value)}
                                            />
                                            <button
                                                onClick={handleAddQuestion}
                                                disabled={questions.length >= 5}
                                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${questions.length >= 5 ? 'bg-gray-400' : 'bg-gray-700'} text-white w-8 h-8 flex items-center justify-center rounded-full !rounded-button whitespace-nowrap cursor-pointer`}>
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    {/* 질문 목록 */}
                                    <div className="space-y-3">
                                        {questions.map((question) => (
                                            <div key={question.id} className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm">{question.text}</p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => toggleQuestion(question.id)}
                                                            className="bg-gray-300 text-gray-600 w-6 h-6 flex items-center justify-center rounded !rounded-button whitespace-nowrap cursor-pointer"
                                                        >
                                                            <i className={`fas fa-${question.expanded ? 'minus' : 'plus'}`}></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveQuestion(question.id)}
                                                            className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded !rounded-button whitespace-nowrap cursor-pointer"
                                                        >
                                                            <i className="fas fa-minus"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                {question.expanded && (
                                                    <div className="mt-2">
                                                        <textarea
                                                            className="w-full border border-gray-300 rounded p-2 text-sm"
                                                            placeholder="답변을 입력하세요"
                                                            rows={2}
                                                            value={question.answer}
                                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 버튼 그룹 */}
                    <div className="flex justify-end space-x-3 mt-8">
                        <button className="bg-gray-800 text-white px-6 py-2 rounded !rounded-button whitespace-nowrap cursor-pointer">
                            신청
                        </button>
                        <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded !rounded-button whitespace-nowrap cursor-pointer">
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default GatheringCreatePage
