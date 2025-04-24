// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

const GatheringCreatePage: React.FC = () => {
    // 책 정보 타입 정의
    interface Book {
        id: number;
        name: string;
        startDate: string;
        status: 'planned' | 'in_progress' | 'completed'; // 상태: 예정, 진행중, 완료
    }

    const navigate = useNavigate();

    // 책 관련 상태
    const [books, setBooks] = useState<Book[]>([]); // 선택된 책 목록
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // 책 검색 모달 열림 여부
    const [searchQuery, setSearchQuery] = useState(''); // 책 검색어
    const [searchResults, setSearchResults] = useState<Array<{ id: string; title: string }>>([]); // 검색 결과

    // 모임 기본 정보
    const [groupName, setGroupName] = useState(''); // 모임명
    const [location, setLocation] = useState(''); // 지역
    const [meetingFormat, setMeetingFormat] = useState(''); // 모임 방법 (오프라인, 온라인 등)
    const [meetingDetails, setMeetingDetails] = useState(''); // 모임 소개

    // 모집/활동 기간
    const [recruitmentPeriod, setRecruitmentPeriod] = useState(''); // 모집 시작 날짜 (문자열로 저장)
    const [activityPeriod, setActivityPeriod] = useState(''); // 활동 시작 날짜 (문자열로 저장)
    const [recruitmentDate, setRecruitmentDate] = useState<Date | null>(null); // DatePicker용 날짜 상태
    const [activityDate, setActivityDate] = useState<Date | null>(null); // DatePicker용 날짜 상태
    const [calendarModalTarget, setCalendarModalTarget] = useState<'recruitment' | 'activity' | null>(null); // 현재 열린 달력 종류

    // 가입 질문 관련
    const [questions, setQuestions] = useState([
        { id: 1, text: '어떤 책을 좋아하세요?' }, // 기본 질문 1개
    ]);
    const [newQuestion, setNewQuestion] = useState(''); // 새 질문 입력 값

    // 질문 추가 함수 (최대 5개)
    const handleAddQuestion = () => {
        if (newQuestion.trim() && questions.length < 5) {
            const newId = Math.max(...questions.map(q => q.id), 0) + 1;
            setQuestions([...questions, { id: newId, text: newQuestion }]);
            setNewQuestion('');
        }
    };

    // 질문 삭제 함수
    const handleRemoveQuestion = (id: number) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    // 해시태그 관련
    const [hashtagInput, setHashtagInput] = useState(''); // 입력 중인 해시태그
    const [hashtags, setHashtags] = useState<string[]>([]); // 최종 추가된 해시태그 목록

    // 해시태그 추가 함수 (Enter 입력 시)
    const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && hashtagInput.trim()) {
            e.preventDefault(); // 폼 제출 방지
            const newTag = hashtagInput.trim();

            if (!hashtags.includes(newTag)) {
                setHashtags([...hashtags, newTag]);
            }

            setHashtagInput('');
        }
    };

    // 해시태그 제거 함수
    const removeHashtag = (tag: string) => {
        setHashtags(hashtags.filter(t => t !== tag));
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <div className="w-full max-w-[1440px] min-h-[1024px] bg-white mx-auto">
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
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
                                            className="w-full border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 rounded-lg px-4 py-2 pr-10 transition duration-200 outline-none placeholder:text-sm placeholder:text-gray-400 bg-white"
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
                                    <label className="block text-sm text-purple-700 mb-1">지역</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 rounded-lg px-4 py-2 transition duration-200 outline-none placeholder:text-sm placeholder:text-gray-400 bg-white"
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
                                        className="w-full border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 rounded-lg px-4 py-2 transition duration-200 outline-none placeholder:text-sm placeholder:text-gray-400 bg-white"
                                        placeholder="모임 방법을 입력하세요"
                                        value={meetingFormat}
                                        onChange={(e) => setMeetingFormat(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm text-purple-700 mb-1">모임 소개</label>
                                    <textarea
                                        className="w-full border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 rounded-lg px-4 py-3 transition duration-200 outline-none placeholder:text-sm placeholder:text-gray-400 bg-white min-h-[400px]"
                                        placeholder="모임 소개를 입력해주세요"
                                        value={meetingDetails}
                                        onChange={(e) => setMeetingDetails(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="flex gap-4 mb-4">

                                    {/* 모집 기간 */}
                                    <div className="flex-1">
                                        <label className="block text-sm text-purple-700 mb-1">모집 인원</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 rounded-lg px-4 py-2 transition duration-200 outline-none placeholder:text-sm placeholder:text-gray-400 bg-white"
                                                placeholder="인원수를 입력하세요"
                                            />
                                        </div>
                                    </div>

                                    {/* 활동 기간 */}
                                    <div className="flex-1">
                                        <label className="block text-sm text-purple-700 mb-1">활동 기간</label>
                                        <div className="relative">
                                            <DatePicker
                                                locale={ko}
                                                selected={activityDate}
                                                onChange={(date) => {
                                                    setActivityDate(date);
                                                    if (date) {
                                                        setActivityPeriod(date.toISOString().split('T')[0]);
                                                    }
                                                }}
                                                dateFormat="yyyy-MM-dd (eee)"
                                                placeholderText="활동기간을 선택하세요"
                                                className="w-full border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 rounded-lg px-4 py-2 transition duration-200 outline-none placeholder:text-sm placeholder:text-gray-400 bg-white"
                                            />
                                        </div>
                                    </div>

                                    {/* 모집 기간 */}
                                    <div className="flex-1">
                                        <label className="block text-sm text-purple-700 mb-1">모집 기간</label>
                                        <div className="relative">
                                            <DatePicker
                                                locale={ko}
                                                selected={recruitmentDate}
                                                onChange={(date) => {
                                                    setRecruitmentDate(date);
                                                    if (date) {
                                                        setRecruitmentPeriod(date.toISOString().split('T')[0]);
                                                    }
                                                }}
                                                dateFormat="yyyy-MM-dd (eee)"
                                                placeholderText="모집기간을 선택하세요"
                                                className="w-full border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 rounded-lg px-4 py-2 transition duration-200 outline-none placeholder:text-sm placeholder:text-gray-400 bg-white"
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm text-purple-700 mb-1">해시 태그</label>
                                    <div className="w-full border border-purple-300 rounded p-2">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {hashtags.map((tag, index) => (
                                                <span key={index} className="flex items-center bg-purple-100 text-purple-700 text-sm px-2 py-1 rounded-full">
                                                    #{tag}
                                                    <button onClick={() => removeHashtag(tag)} className="ml-1 text-purple-500 hover:text-purple-800">
                                                        <i className="fas fa-times text-xs"></i>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={hashtagInput}
                                            onChange={(e) => setHashtagInput(e.target.value)}
                                            onKeyDown={handleHashtagKeyDown}
                                            className="w-full border-0 focus:outline-none placeholder:text-sm placeholder:text-gray-400 px-2 py-1"
                                            placeholder="해시태그 입력 후 엔터를 눌러주세요"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 세로 구분선 */}
                            <div className="w-px bg-gray-300" />

                            {/* 가입 질문 섹션 */}
                            <div className="flex-1">
                                <div>
                                    <h3 className="text-lg font-bold mb-4">가입 질문</h3>
                                    <div className="mb-4">
                                        <label className="block text-sm text-purple-700 mb-1">질문</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 rounded-lg px-4 py-2 transition duration-200 outline-none placeholder:text-sm placeholder:text-gray-400"
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
                                    <div className="space-y-7">
                                        {questions.map((question) => (
                                            <div key={question.id} className="bg-white border border-purple-200 shadow-sm rounded-lg p-4">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm">{question.text}</p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleRemoveQuestion(question.id)}
                                                            className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded !rounded-button whitespace-nowrap cursor-pointer"
                                                        >
                                                            <i className="fas fa-minus"></i>
                                                        </button>
                                                    </div>
                                                </div>
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
                        <button
                            onClick={handleCancel}
                            className="bg-gray-200 text-gray-800 px-6 py-2 rounded !rounded-button whitespace-nowrap cursor-pointer"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default GatheringCreatePage
