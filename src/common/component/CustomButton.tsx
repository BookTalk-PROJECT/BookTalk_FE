import { JSX } from "react";

interface ButtonWrapperProps {
  onClick: () => void;
  children: JSX.Element | string;
  color?: "black" | "blue" | "red" | "white" | "none"; // 색상 기반으로 변경
}

const CustomButton: React.FC<ButtonWrapperProps> = ({ onClick, children, color = "white" }) => {
  const baseStyle =
    "px-4 py-2 rounded-lg text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-all";

  const colorVariants = {
    black: "bg-gray-800 text-white hover:bg-gray-700",
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    red: "bg-red-500 text-white hover:bg-red-600",
    white: "bg-gray-50 text-gray-700 hover:bg-gray-200 border border-gray-300",
    none: "bg-transparent text-black-400 hover:text-gray-600 p-0", //디자인이 아이콘만 존재할 경우
  };

  const finalClassName = `${baseStyle} ${colorVariants[color]}`;

  return (
    <button onClick={onClick} className={finalClassName}>
      {children}
    </button>
  );
};

export default CustomButton;
