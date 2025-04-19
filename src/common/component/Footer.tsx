import { useState } from "react";

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">LOGO</h2>
            <p className="text-gray-300 mb-4">
              최고의 서비스와 콘텐츠를 제공하는 플랫폼입니다. 항상 사용자의 편의를 최우선으로 생각합니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">사이트맵</h3>
            <div className="grid grid-cols-2 gap-2">
              <a href="#" className="text-gray-300 hover:text-white py-1">
                홈
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                게시판
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                공지사항
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                마이페이지
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                고객센터
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                FAQ
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                이용약관
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                개인정보처리방침
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">고객센터</h3>
            <p className="flex items-center text-gray-300 mb-2">
              <i className="fas fa-phone-alt mr-2"></i> 1588-1234
            </p>
            <p className="flex items-center text-gray-300 mb-2">
              <i className="fas fa-envelope mr-2"></i> support@example.com
            </p>
            <p className="flex items-center text-gray-300 mb-4">
              <i className="fas fa-map-marker-alt mr-2"></i> 서울특별시 강남구 테헤란로 123
            </p>
            <p className="text-gray-400 text-sm">평일 09:00 - 18:00 (주말 및 공휴일 휴무)</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 COMPANY. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              이용약관
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm font-bold">
              개인정보처리방침
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              이메일무단수집거부
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
