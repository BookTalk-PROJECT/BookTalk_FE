import React, { useEffect, useState } from "react";
import { fetchKakaoLogin, fetchLogin } from "../api/login.mock";
import { useAuthStore } from "../../../store";
import { useNavigate } from "react-router";

const KakaoRedirectPage: React.FC = () => {

  const [message,setMessage] = useState<string>("카카오 로그인중.....")

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const code = params.get("code");

    if(!code) return;

    fetchKakaoLogin(code).then((data) =>{
      console.log(data);
    });


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
