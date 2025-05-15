import { useRef, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import CustomInput from '../../CustomInput';
import CustomButton from '../../CustomButton';
import { CommuPostRequest, GatheringPostRequest } from '../../../../community/board/type/boardList';
import { YoutubeVideo } from '../type/BoardDetail.types';
import { searchYoutubeVideos } from '../api/CreateBoardRequest';

interface BoardProps {
  createPost: (arg0: CommuPostRequest | GatheringPostRequest) => void;
}

const CreateBoard: React.FC<BoardProps> = ({ createPost }) => {
  const editorRef = useRef<Editor>(null);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [youtubeQuery, setYoutubeQuery] = useState('');
  const [youtubeResults, setYoutubeResults] = useState<YoutubeVideo[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [nextPageToken, setNextPageToken] = useState('');
  const [prevPageToken, setPrevPageToken] = useState('');

  const [postData, setPostData] = useState<CommuPostRequest | GatheringPostRequest>({
    id: 0,
    title: "",
    author: "",
    date: "",
    views: 0,
    categoryId: 0,
  });

  const handleSubmit = async () => {
    const editorInstance = editorRef.current?.getInstance();
    const content = editorInstance?.getMarkdown() || '';

    const result = await createPost(postData);
  };

  const handleYoutubeButtonClick = () => {
    setShowYoutubeModal(true);
  };

  const handleYoutubeSearch = async (pageToken: string | number = '') => {
    const { items, nextPageToken, prevPageToken, totalResults } = await searchYoutubeVideos(youtubeQuery, pageToken);
    setYoutubeResults(items);
    setNextPageToken(nextPageToken);
    setPrevPageToken(prevPageToken);
    setTotalResults(totalResults);
  };

  const handleYoutubeInsert = (id: string) => {
    const editorInstance = editorRef.current?.getInstance();
    if (!editorInstance) return;

    editorInstance.changeMode('wysiwyg', true);
    const iframeHtml = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`;
    editorInstance.insertHTML(iframeHtml);

    setShowYoutubeModal(false);
  };


  //Editor 내부에 추가되어 있음
  const handleUndo = () => {
    editorRef.current?.getInstance().exec('undo');
  };
  //Editor 내부에 추가되어 있음
  const handleRedo = () => {
    editorRef.current?.getInstance().exec('redo');
  };

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  // 에디터 내용 변경 시 실행할 핸들러
  const handleEditorChange = () => {
    const editorInstance = editorRef.current?.getInstance();
    const content = editorInstance?.getMarkdown() || ""; // 마크다운 형식으로 내용 가져오기
    setPostData((prev) => ({ ...prev, content })); // 상태 업데이트
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-10">글쓰기</h1>

        <div className="bg-white shadow-md rounded-2xl p-10 space-y-10">
          {/* 제목 입력 */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">제목</label>

            <CustomInput
              type="text"
              name="title"
              placeholder="제목을 입력하세요"
              value={postData.title}
              onChange={onChangeHandler}
            />
          </div>

          {/* 카테고리 입력 */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">카테고리</label>
            <CustomInput
              type="text"
              name="category"
              placeholder="카테고리를 입력하세요"

              onChange={onChangeHandler}
            />
          </div>

          {/* 에디터 */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">본문</label>

            {/* 툴바 영역 */}
            <div className="flex items-center space-x-2 p-2 rounded-t-lg bg-gray-50 mb-0">
              <CustomButton onClick={handleYoutubeButtonClick} color="white">
                <>
                  <i className="fab fa-youtube"> &nbsp;유튜브</i>
                </>
              </CustomButton>

              {/* 나중에 추가할 버튼들도 여기에 추가 가능 */}
              {/* <CustomButton ...">이미지</button> */}
              {/* <CustomButton ...">동영상</button> */}
            </div>

            {/* 에디터 */}
            <Editor
              ref={editorRef}
              initialValue=""
              previewStyle="vertical"
              height="400px"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              onChange={handleEditorChange}
              toolbarItems={[
                ["heading", "bold", "italic", "strike"],
                ["hr", "quote"],
                ["ul", "ol", "task", "indent", "outdent"],
                ["table", "link", "image", "code", "codeblock"],
                [
                  {
                    name: "undo",
                    tooltip: "되돌리기",
                    el: (() => {
                      const button = document.createElement("button");
                      button.innerHTML = `<i class="fas fa-undo"></i>`;
                      button.addEventListener("click", () => {
                        editorRef.current?.getInstance().exec("undo");
                      });
                      return button;
                    })(),
                  },
                  {
                    name: "redo",
                    tooltip: "다시하기",
                    el: (() => {
                      const button = document.createElement("button");
                      button.innerHTML = `<i class="fas fa-redo"></i>`;
                      button.addEventListener("click", () => {
                        editorRef.current?.getInstance().exec("redo");
                      });
                      return button;
                    })(),
                  },
                ],
              ]}
            />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex justify-end space-x-4">
            <CustomButton
              onClick={handleSubmit}
              color="blue"
              customClassName='px-6 py-3'>
              <>
                등록하기
              </>
            </CustomButton>
            <CustomButton
              onClick={() => window.history.back()}
              color="white"
              customClassName='px-6 py-3'>
              <>
                취소
              </>
            </CustomButton>
          </div>
        </div>
      </div>

      {/* 유튜브 모달 */}
      {showYoutubeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-lg font-bold mb-4">유튜브 등록하기</h2>

            {/* 검색어 입력 */}
            <input
              type="text"
              className="w-full border px-4 py-2 mb-4"
              placeholder="유튜브 검색어 입력"
              name="youtubeQuery"
              value={youtubeQuery}
              onChange={onChangeHandler}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleYoutubeSearch();
                }
              }}
            />

            {/* 검색 버튼 */}
            <CustomButton onClick={() => handleYoutubeSearch(0)} color="blue" customClassName="w-full mb-4">
              검색
            </CustomButton>

            {/* 검색 결과 리스트 */}
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

                  {/* 삽입 버튼 */}
                  <CustomButton
                    onClick={() => handleYoutubeInsert(video.id)}
                    color="red"
                    customClassName="py-1 px-2 self-center text-xs"
                  >
                    삽입
                  </CustomButton>
                </li>
              ))}
            </ul>

            {/* 페이지네이션 버튼 */}
            <div className="flex justify-center space-x-2 mt-4">
              {prevPageToken && (
                <CustomButton
                  onClick={() => handleYoutubeSearch(prevPageToken)}
                  color="white"
                  customClassName="px-4 py-2 hover:bg-gray-400"
                >
                  이전
                </CustomButton>
              )}
              {nextPageToken && (
                <CustomButton
                  onClick={() => handleYoutubeSearch(nextPageToken)}
                  color="white"
                  customClassName="px-4 py-2 hover:bg-gray-400"
                >
                  다음
                </CustomButton>
              )}
            </div>

            {/* 닫기 버튼 */}
            <CustomButton
              onClick={() => setShowYoutubeModal(false)}
              color="white"
              customClassName="mt-6 w-full"
            >
              닫기
            </CustomButton>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateBoard;