import React, { useEffect, useState } from "react";
import { Cookies, useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../store";

const KakaoRedirectPage: React.FC = () => {
  
  const cookies = new Cookies();

  const accessToken = cookies.get("access_token")

  const [message,setMessage] = useState<string>("카카오 로그인중.....")

  const navigate = useNavigate();

  const {login} = useAuthStore();

  useEffect(() => {
    localStorage.setItem("accessToken", accessToken);
    setMessage("카카오 로그인 성공");
    navigate("/dashboard");
    login();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      {/*  본문 */}
      <main className="flex-grow flex items-center justify-center py-10 px-4">
        <h1>{message}</h1>
      </main>
    </div>
  );
};

export default KakaoRedirectPage;
