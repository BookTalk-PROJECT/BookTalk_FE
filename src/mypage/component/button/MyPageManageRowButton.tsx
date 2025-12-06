import React from "react";
import ButtonWrapper from "../../../common/component/Button";

type ButtonProperties = {
  label: string;
  color: "green" | "red" | "blue" | "gray" | "yellow";
  onClick?: () => void;
};

interface MyPageManageButtonProps {
  actions: ButtonProperties[];
}

const MyPageManageRowButton = ({ actions }: MyPageManageButtonProps) => {
  const colorMap: Record<ButtonProperties["color"], string> = {
    green: "text-green-500",
    red: "text-red-500",
    blue: "text-blue-500",
    gray: "text-gray-500",
    yellow: "text-yellow-500",
  };

  return (
    <>
      {actions.map((action, index) => (
        <span key={index} className="inline-flex items-center">
          <ButtonWrapper
            onClick={
              action.onClick ||
              (() => {
                console.log("온 클릭 이벤트 없음");
              })
            }>
            <span className={`${colorMap[action.color]} font-medium`}>{action.label}</span>
          </ButtonWrapper>
          {index < actions.length - 1 && <span className="text-gray-400 mx-2">┆</span>}
        </span>
      ))}
    </>
  );
};

export default MyPageManageRowButton;
