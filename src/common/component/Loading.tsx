import React from "react";

// React 컴포넌트로 정의
const LoadingBar: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="loader animate-spin ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 border-t-blue-500"></div>
      <p className="ml-4">로딩 중...</p>
    </div>
  );
};

export default LoadingBar;
