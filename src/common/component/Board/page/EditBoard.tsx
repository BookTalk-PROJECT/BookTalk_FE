import { useEffect, useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import CustomInput from "../../CustomInput";
import CustomButton from "../../CustomButton";
import { redirect, useNavigate } from "react-router";
import { getBoardDetail } from "../../../../community/board/api/boardApi";
import { CommuPostRequest } from "../type/BoardDetailTypes";
import BreadCrumb from "../../BreadCrumb";

interface BoardEditProps {
  categoryId?: string;
  redirectUri: string;
  postCode: string;
  editPost: (arg0:CommuPostRequest, postCode: string) => void;
  mainTopic: string;
  subTopic: string;
}

const EditBoard: React.FC<BoardEditProps> = ({ 
  categoryId,
  redirectUri,
  postCode, 
  editPost,
  mainTopic,
  subTopic
}) => {
  const navigate = useNavigate();
  const editorRef = useRef<Editor>(null);
  const [postData, setPostData] = useState<CommuPostRequest>({
    title: "",
    content: "",
    notification_yn: false,
  });

  const handleSubmit = () => { 
    editPost(postData, postCode);
    navigate(redirectUri);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const loadDetailData = async () => {
    const res = await getBoardDetail(postCode);
    setPostData({
        title: res.data.post.title,
        content: res.data.post.content,
        notification_yn: res.data.post.notification_yn
    });
  };

  useEffect(() => {
    loadDetailData();
  }, []);

  useEffect(() => {
    // postData.content 변경될 때마다 반영
    if (editorRef.current) {
        editorRef.current.getInstance().setMarkdown(postData.content || "");
    }
  }, [postData.content]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadCrumb major={mainTopic} sub={subTopic}/>
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
            <CustomButton onClick={handleSubmit} color="blue" customClassName="px-6 py-3">
              <>등록하기</>
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
