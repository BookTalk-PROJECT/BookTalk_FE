import { Children, JSX } from "react";

interface ButtonWrapperProps {
  onClick: () => void;
  children: JSX.Element;
  disabled?: boolean;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({ onClick, children, disabled }) => {
  return (
    <button
      onClick={() => onClick()}
      disabled={disabled}
      className={`bg-gray-50 hover:bg-gray-200 px-4 py-1.5 rounded-lg text-sm text-gray-700 shadow-sm transition-all ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      {children}
    </button>
  );
};

export default ButtonWrapper;
