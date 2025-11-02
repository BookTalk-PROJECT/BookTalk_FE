import React, { useState } from "react";
import { fetchLogin } from "../api/login.mock";
import { useAuthStore } from "../../../store";
import { useNavigate } from "react-router";

const KakaoRedirectPage: React.FC = () => {

  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      {/*  본문 */}
      <main className="flex-grow flex items-center justify-center py-10 px-4">
        <h1>카카오 로그인중....</h1>
      </main>
    </div>
  );
};

export default KakaoRedirectPage;
