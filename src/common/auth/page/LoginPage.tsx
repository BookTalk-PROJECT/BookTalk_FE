import React, { useState } from "react";
import { fetchLogin } from "../api/login.mock";
import { useAuthStore } from "../../../store";
import { useNavigate } from "react-router";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {login} = useAuthStore();
  const navigatge = useNavigate();
  const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
  const NAVER_STATE = import.meta.env.VITE_NAVER_STATE;
  const NAVER_CALLBACK_URL = import.meta.env.VITE_NAVER_CALLBACK_URL;
  const KAKAO_RESTAPI_KEY = import.meta.env.VITE_KAKAO_RESTAPI_KEY;
  const KAKAO_CALLBACK_URL = import.meta.env.VITE_KAKAO_CALLBACK_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 전송 기본 동작 막기

    const loginData = {
      username,
      password,
    }
    fetchLogin(loginData)
    .then((res) => {
      login();
      navigatge("/dashboard");
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      {/* 📌 본문 */}
      <main className="flex-grow flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md">
          {/* 로고 */}
          <div className="flex justify-center mb-6">
            <img
              src="https://w7.pngwing.com/pngs/856/4/png-transparent-computer-icons-book-discussion-club-author-book-angle-rectangle-logo-thumbnail.png"
              alt="로고"
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* 로그인 박스 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="text-center mb-6 text-gray-500">
              <p> </p>
              <p className="text-sm"> </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                  아이디
                </label>
                <input
                  type="text"
                  id="userId"
                  className="border border-gray-200 rounded-md p-2 w-full text-sm"
                  placeholder="아이디를 입력해주세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  className="border border-gray-200 rounded-md p-2 w-full text-sm"
                  placeholder="비밀번호를 입력해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">
                로그인
              </button>
            </form>

            <div className="mt-4 text-center">
              <div className="inline-block border border-red-500 rounded-full px-4 py-1">
                <span className="text-sm">아이디 찾기 | 비밀번호 찾기</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => (window.location.href = "http://localhost:8080/oauth2/authorization/kakao")}
                className="w-full flex items-center justify-center bg-[#FEE500] text-[#000000] py-3 text-sm font-medium rounded">
                <i className="fa-solid fa-comment text-[#000000] mr-2"></i>
                카카오로 로그인하기
              </button>
              <button
                onClick={() => (window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${NAVER_STATE}&redirect_uri=${NAVER_CALLBACK_URL}`)}
                className="w-full flex items-center justify-center bg-[#03C75A] text-white py-3 text-sm font-medium rounded">
                <i className="fa-solid fa-n text-white mr-2"></i>
                네이버로 로그인하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
