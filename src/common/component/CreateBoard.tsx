import React, { useState } from "react";
import { PostCreate } from '../type/CreateBoard';

interface BoardProps {
  postBoard: (arg0: PostCreate) => void;
}

const CreateBoard: React.FC<BoardProps> = ({postBoard}) => {
  const [postData, setPostData] = useState<PostCreate>({
    title: "",
    content: "",
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {value, name} = e.target;
    setPostData({ ...postData, [name]: value});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">글쓰기</h1>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 text-sm bg-gray-100 rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-200">
                <i className="fas fa-times mr-2"></i>취소
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* 제목 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="제목을 입력하세요"
                name="title"
                onChange={onChangeHandler}
              />
            </div>

            {/* 이미지 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">이미지 첨부</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                <p className="text-sm text-gray-500">
                  이미지를 드래그하여 업로드하거나
                  <button className="text-blue-500 hover:text-blue-600 ml-1">파일 선택</button>
                </p>
              </div>
            </div>

            {/* 내용 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg h-64 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="내용을 입력하세요"
                name="content"
                onChange={onChangeHandler}></textarea>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 text-sm bg-gray-100 rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-200">
                취소
              </button>
              <button 
                onClick={() => postBoard(postData)}
                className="px-4 py-2 text-sm bg-gray-800 text-white rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-900">
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBoard;
