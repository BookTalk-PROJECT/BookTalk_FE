import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      {/* 📌 전체 너비 헤더 */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800 mr-12">책톡</h1>
            <nav className="flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                커뮤니티
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                멤버십
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                장기 모임
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                고객센터
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded">로그인</button>
            <button className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded">회원가입</button>
          </div>
        </div>
      </header>

      {/* 📌 본문 */}
      <main className="flex-grow flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md">
          {/* 로고 */}
          <div className="flex justify-center mb-6">
            <img
              src="https://readdy.ai/api/search-image?query=A%20stylized%20red%20book%20with%20gold%20trim%20details&width=120&height=120"
              alt="로고"
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* 로그인 박스 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="text-center mb-6 text-gray-500">
              <p>아이디 또는 비밀번호가 틀렸습니다.</p>
              <p className="text-sm">(한글x 시 입을 막히면다 메세지)</p>
            </div>

            <form>
              <div className="mb-4">
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                  아이디
                </label>
                <input
                  type="text"
                  id="userId"
                  className="border border-gray-200 rounded-md p-2 w-full text-sm"
                  placeholder="아이디를 입력해주세요"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
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
                onClick={() => (window.location.href = "https://kauth.kakao.com/oauth/authorize")}
                className="w-full flex items-center justify-center bg-[#FEE500] text-[#000000] py-3 text-sm font-medium rounded">
                <i className="fa-solid fa-comment text-[#000000] mr-2"></i>
                카카오로 로그인하기
              </button>
              <button
                onClick={() => (window.location.href = "https://nid.naver.com/oauth2.0/authorize")}
                className="w-full flex items-center justify-center bg-[#03C75A] text-white py-3 text-sm font-medium rounded">
                <i className="fa-solid fa-n text-white mr-2"></i>
                네이버로 로그인하기
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 📌 푸터 */}
      <footer
        className="w-full py-4 text-center"
        style={{
          backgroundImage:
            'url("https://static.readdy.ai/image/7c947f0a614a0de80ab998c78f59b0ef/68987b76fdbe6bcc791c9ab28eb2d958.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "80px",
        }}>
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-4xl font-bold text-white">독서모임 커뮤니티</h2>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
