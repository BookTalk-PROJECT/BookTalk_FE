import { useRef, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import axios from 'axios';
import Pagenation from '../../common/component/Pagination';

const GatheringCreateBoardPage: React.FC = () => {
  const editorRef = useRef<Editor>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [youtubeQuery, setYoutubeQuery] = useState('');
  const [youtubeResults, setYoutubeResults] = useState<
    {
      id: string;
      title: string;
      thumbnail: string;
      channelTitle: string;
      publishedAt: string;
    }[]
  >([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [nextPageToken, setNextPageToken] = useState('');
  const [prevPageToken, setPrevPageToken] = useState('');


  const RESULTS_PER_PAGE = 5;

  // 글 등록
  const handleSubmit = () => {
    const editorInstance = editorRef.current?.getInstance();
    const content = editorInstance?.getMarkdown() || '';

    const postData = {
      title,
      category,
      content,
      tags: tags.split(',').map((tag) => tag.trim()),
    };

    console.log('작성된 데이터:', postData);
    // TODO: 여기에 서버 전송 코드 작성
  };

  // 유튜브 버튼 클릭 → 모달 열기
  const handleYoutubeButtonClick = () => {
    setShowYoutubeModal(true);
  };

  // 유튜브 검색
  const handleYoutubeSearch = async (pageToken: string | number = '') => {
    if (!youtubeQuery) return;

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: youtubeQuery,
          type: 'video',
          key: import.meta.env.VITE_YOUTUBE_API_KEY,
          maxResults: RESULTS_PER_PAGE,
          pageToken: pageToken ? String(pageToken) : undefined, // <= 여기
        },
      });

      const items = response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      }));

      setYoutubeResults(items);
      setTotalResults(response.data.pageInfo.totalResults || 0);
      setNextPageToken(response.data.nextPageToken || '');
      setPrevPageToken(response.data.prevPageToken || '');
    } catch (error) {
      console.error('유튜브 검색 실패:', error);
      alert('유튜브 검색 중 문제가 발생했습니다.');
    }
  };


  // 유튜브 삽입
  const handleYoutubeInsert = (id: string) => {
    const editorInstance = editorRef.current?.getInstance();

    if (!editorInstance) return;

    editorInstance.changeMode('wysiwyg', true); // 추가
    const iframeHtml = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`;
    editorInstance.insertHTML(iframeHtml);

    setShowYoutubeModal(false);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-10">글쓰기</h1>

        <div className="bg-white shadow-md rounded-2xl p-10 space-y-10">
          {/* 제목 입력 */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">제목</label>
            <input
              type="text"
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 카테고리 입력 */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">카테고리</label>
            <input
              type="text"
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500"
              placeholder="카테고리를 입력하세요"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* 에디터 */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">본문</label>

            {/* 툴바 영역 */}
            <div className="flex items-center space-x-2 p-2 border rounded-t-lg bg-gray-50 mb-0">
              <button
                onClick={handleYoutubeButtonClick}
                className="bg-white text-gray-700 border px-3 py-1 rounded hover:bg-gray-100 text-sm"
              >
                유튜브
              </button>
              {/* 나중에 추가할 버튼들도 여기에 추가 가능 */}
              {/* <button className="...">이미지</button> */}
              {/* <button className="...">동영상</button> */}
            </div>

            {/* 에디터 */}
            <Editor
              ref={editorRef}
              initialValue=""
              previewStyle="vertical"
              height="400px"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
            />
          </div>


          {/* 태그 입력 */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">태그</label>
            <input
              type="text"
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500"
              placeholder="태그를 입력하세요 (쉼표로 구분)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg text-base hover:bg-gray-400"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-base hover:bg-blue-700"
            >
              등록하기
            </button>
          </div>
        </div>
      </div>

      {/* 유튜브 모달 */}
      {showYoutubeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-lg font-bold mb-4">유튜브 등록하기</h2>
            <input
              type="text"
              className="w-full border px-4 py-2 mb-4"
              placeholder="유튜브 검색어 입력"
              value={youtubeQuery}
              onChange={(e) => setYoutubeQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleYoutubeSearch();
                }
              }}
            />
            <button
              onClick={() => handleYoutubeSearch(0)}
              className="w-full bg-blue-500 text-white py-2 rounded mb-4"
            >
              검색
            </button>

            {/* 검색 결과 */}
            <ul className="max-h-96 overflow-y-auto">
              {youtubeResults.map((video) => (
                <li key={video.id} className="flex items-start space-x-4 p-2 border-b">
                  <img
                    src={video.thumbnail}
                    alt="썸네일"
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-md font-semibold">{video.title}</h3>
                    <p className="text-sm text-gray-500">{video.channelTitle}</p>
                    <p className="text-xs text-gray-400">{new Date(video.publishedAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleYoutubeInsert(video.id)}
                    className="bg-green-500 text-white py-1 px-2 rounded self-center"
                  >
                    삽입
                  </button>
                </li>
              ))}
            </ul>

            {/* 페이징 */}
            <div className="flex justify-center space-x-2 mt-4">
              {prevPageToken && (
                <button
                  onClick={() => handleYoutubeSearch(prevPageToken)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  이전
                </button>
              )}
              {nextPageToken && (
                <button
                  onClick={() => handleYoutubeSearch(nextPageToken)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  다음
                </button>
              )}
            </div>


            <button
              onClick={() => setShowYoutubeModal(false)}
              className="mt-6 w-full bg-gray-300 py-2 rounded"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GatheringCreateBoardPage;
