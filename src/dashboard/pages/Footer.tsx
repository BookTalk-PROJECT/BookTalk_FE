import { useState } from 'react';

const Footer = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <footer className="fixed bottom-0 w-full bg-gray-100 border-t border-black z-50 transition-all duration-300">
            {/* 🟡 호버를 감지할 센터 영역 */}
            <div
                className="absolute left-1/2 transform -translate-x-1/2 w-[30%] h-full z-10"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            ></div>

            <div
                className={`relative max-w-5xl mx-auto px-4 transition-all duration-300 overflow-hidden ${isHovered ? 'py-6' : 'py-2'
                    }`}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <h2 className="text-lg font-bold">책톡</h2>
                        <p className="text-sm text-gray-600 ml-4">© 2025 책톡 커뮤니티</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-600 hover:text-red-500">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="text-gray-600 hover:text-red-500">
                            <i className="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>

                {/* 확장 영역 */}
                <div
                    className={`transition-all duration-300 ${isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
                        }`}
                >
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <p className="text-sm text-gray-600">모든 권리 보유.</p>
                            </div>
                            <div className="flex space-x-6">
                                <a href="#" className="text-gray-600 hover:text-red-500">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-red-500">
                                    <i className="fab fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm text-gray-600">
                            <div className="flex justify-center space-x-4 mb-2">
                                <a href="#" className="hover:text-red-500">서비스 약관</a>
                                <a href="#" className="hover:text-red-500">개인정보 처리방침</a>
                                <a href="#" className="hover:text-red-500">문의하기</a>
                            </div>
                            <p>창원시 의창구 반계로104-8</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
