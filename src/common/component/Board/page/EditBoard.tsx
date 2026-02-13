import { useEffect, useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import CustomInput from "../../CustomInput";
import CustomButton from "../../CustomButton";
import { useNavigate } from "react-router";
import { getBoardDetail } from "../../../../community/board/api/boardApi";
import { CommuPostRequest } from "../type/BoardDetailTypes";
import BreadCrumb from "../../BreadCrumb";

interface BoardEditProps {
  categoryId?: string;
  redirectUri: string;
  postCode: string;
  editPost: (arg0: CommuPostRequest, postCode: string) => Promise<void>;
  mainTopic: string;
  subTopic: string;
}

const EditBoard: React.FC<BoardEditProps> = ({ categoryId, redirectUri, postCode, editPost, mainTopic, subTopic }) => {
  const navigate = useNavigate();
  const editorRef = useRef<Editor>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [postData, setPostData] = useState<CommuPostRequest>({
    title: "",
    content: "",
    notification_yn: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await editPost(postData, postCode);
      navigate(redirectUri);
    } catch (error) {
      alert('저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  // 에디터 내용 변경 시 디바운스 적용
  const handleEditorChange = () => {
    // 이전 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 300ms 후에 상태 업데이트
    debounceTimerRef.current = setTimeout(() => {
      const content = editorRef.current?.getInstance().getMarkdown() || "";
      setPostData((prev) => ({ ...prev, content }));
    }, 300);
  };

  // cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // 초기 데이터 로드 - 순환 의존성 제거
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getBoardDetail(postCode);
        const { title, content, notification_yn } = res.data.post;
        setPostData({ title, content, notification_yn });

        // 초기 로딩 시에만 에디터 설정
        if (editorRef.current && isInitialLoad) {
          editorRef.current.getInstance().setMarkdown(content || "");
          setIsInitialLoad(false);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, [postCode, isInitialLoad]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadCrumb major={mainTopic} sub={subTopic} />
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-10">글수정</h1>
        <div className="bg-white shadow-md rounded-2xl p-10 space-y-10">
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
          {/* 에디터 */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">본문</label>

            {/* 에디터 */}
            <Editor
              ref={editorRef}
              initialValue={postData.content}
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
                      button.innerHTML = '<i class="fas fa-undo"></i>';
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
                      button.innerHTML = '<i class="fas fa-redo"></i>';
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
            <CustomButton onClick={handleSubmit} color="blue" customClassName="px-6 py-3" disabled={isSubmitting}>
              <>{isSubmitting ? '저장 중...' : '등록하기'}</>
            </CustomButton>
            <CustomButton onClick={() => window.history.back()} color="white" customClassName="px-6 py-3">
              <>취소</>
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBoard;
