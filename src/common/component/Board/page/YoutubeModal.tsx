import { useState } from "react";
import { YoutubeVideo } from "../type/BoardDetail.types";
import { searchYoutubeVideos } from "../api/CreateBoardRequest";
import CustomButton from "../../CustomButton";
import { Editor } from "@toast-ui/react-editor";

type YoutubeModalProps = {
    editorRef: React.RefObject<Editor | null>;
    setShowYoutubeModal: (flag: boolean) => void;
}

const YoutubeModal: React.FC<YoutubeModalProps> = ({editorRef, setShowYoutubeModal}: YoutubeModalProps) => {
  const [youtubeQuery, setYoutubeQuery] = useState("");
  const [youtubeResults, setYoutubeResults] = useState<YoutubeVideo[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [nextPageToken, setNextPageToken] = useState("");
  const [prevPageToken, setPrevPageToken] = useState("");
  
  const handleYoutubeSearch = async (pageToken: string | number = "") => {
    const { items, nextPageToken, prevPageToken, totalResults } = await searchYoutubeVideos(youtubeQuery, pageToken);
    setYoutubeResults(items);
    setNextPageToken(nextPageToken);
    setPrevPageToken(prevPageToken);
    setTotalResults(totalResults);
  };

  const handleYoutubeInsert = (id: string) => {
    const editorInstance = editorRef.current?.getInstance();
    if (!editorInstance) return;

    editorInstance.changeMode("wysiwyg", true);
    const iframeHtml = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`;
    editorInstance.insertHTML(iframeHtml);

    setShowYoutubeModal(false);
  };

    return (
        <>
        {/* 유튜브 모달 */}
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
              onChange={(e) => setYoutubeQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
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
                  <img src={video.thumbnail} alt="썸네일" className="w-32 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="text-md font-semibold">{video.title}</h3>
                    <p className="text-sm text-gray-500">{video.channelTitle}</p>
                    <p className="text-xs text-gray-400">{new Date(video.publishedAt).toLocaleString()}</p>
                  </div>

                  {/* 삽입 버튼 */}
                  <CustomButton
                    onClick={() => handleYoutubeInsert(video.id)}
                    color="red"
                    customClassName="py-1 px-2 self-center text-xs">
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
                  customClassName="px-4 py-2 hover:bg-gray-400">
                  이전
                </CustomButton>
              )}
              {nextPageToken && (
                <CustomButton
                  onClick={() => handleYoutubeSearch(nextPageToken)}
                  color="white"
                  customClassName="px-4 py-2 hover:bg-gray-400">
                  다음
                </CustomButton>
              )}
            </div>

            {/* 닫기 버튼 */}
            <CustomButton onClick={() => setShowYoutubeModal(false)} color="white" customClassName="mt-6 w-full">
              닫기
            </CustomButton>
          </div>
        </div>
        </>
    )
}

export default YoutubeModal;