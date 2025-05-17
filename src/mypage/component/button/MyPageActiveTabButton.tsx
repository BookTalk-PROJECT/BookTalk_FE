import React from "react";
import ButtonWrapper from "../../../common/component/Button";

type ButtonProperties = {
  label: string;
  color: "green" | "red" | "blue" | "gray" | "yellow";
  onClick?: () => void;
};

interface MyPageActiveTabButtonProps {
  actions: ButtonProperties[];
  setActiveTab: (tab: string) => void;
}

const MyPageActiveTabButton = ({ actions, setActiveTab }: MyPageActiveTabButtonProps) => {
  const colorMap: Record<ButtonProperties["color"], string> = {
    green: "text-green-500",
    red: "text-red-500",
    blue: "text-blue-500",
    gray: "text-gray-500",
    yellow: "text-yellow-500",
  };

  return (
    <div className="flex space-x-2 mb-4 mt-5 ml-3">
      {actions.map((action, index) => (
        <span key={index} className="inline-flex items-center">
          <ButtonWrapper
            onClick={() => {
              setActiveTab(action.label);
            }}>
            <span className={`${colorMap[action.color]} font-medium`}>{action.label}</span>
          </ButtonWrapper>
        </span>
      ))}
    </div>
  );
};

export default MyPageActiveTabButton;
