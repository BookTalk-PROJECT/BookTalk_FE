import { Children, JSX } from "react";

interface ButtonWrapperProps {
    onClick: () => void;
    children: JSX.Element;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({onClick, children}) => {

    return (
        <button onClick={() => onClick()} className="bg-gray-50 hover:bg-gray-200 px-4 py-1.5 rounded-full text-sm text-gray-700 shadow-sm transition-all">
            {children}
        </button>
    )

}



export default ButtonWrapper;