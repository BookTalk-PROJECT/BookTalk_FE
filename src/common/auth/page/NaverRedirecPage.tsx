import React, { useEffect, useState } from "react";
import { fetchLogin } from "../api/Auth";
import { useAuthStore } from "../../../store";
import { useNavigate } from "react-router";
import { Cookies } from "react-cookie";

const NaverRedirectPage: React.FC = () => {
  const cookies = new Cookies();

  const accessToken = cookies.get("access_token");

  const [message, setMessage] = useState<string>("네이버 로그인중.....");

  const navigate = useNavigate();

  const { login } = useAuthStore();

  useEffect(() => {
    localStorage.setItem("accessToken", accessToken);
    setMessage("네이버 로그인 성공");
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

export default NaverRedirectPage;
