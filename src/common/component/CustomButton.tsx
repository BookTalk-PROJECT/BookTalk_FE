import { JSX } from "react";

interface CustomButtonProps {
  onClick: () => void;
  children: React.ReactNode
  color?: "black" | "blue" | "red" | "white" | "none";
  customClassName?: string; // className 추가
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  children,
  color = "white",
  customClassName = "", // 기본값 설정
}) => {
  const baseStyle =
    "px-4 py-2 rounded-lg text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-all";

  const colorVariants = {
    black: "bg-gray-800 text-white hover:bg-gray-700",
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    red: "bg-red-500 text-white hover:bg-red-600",
    white: "bg-gray-50 text-gray-700 hover:bg-gray-200 border border-gray-300",
    none: "bg-transparent text-black-400 hover:text-gray-600 p-0",
  };

  const finalClassName = `${baseStyle} ${colorVariants[color]} ${customClassName}`; // 클래스 스타일 종합

  return (
    <button onClick={onClick} className={finalClassName}>
      {children}
    </button>
  );
};

export default CustomButton;
