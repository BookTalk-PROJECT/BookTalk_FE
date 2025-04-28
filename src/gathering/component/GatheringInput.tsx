import React from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

interface GatheringInputPropsBase {
    label?: string;
    suffixButton?: {
        label: string;
        onClick: () => void;
    };
    suffixIconButton?: {
        icon: React.ReactNode;
        onClick: () => void;
        className?: string;
    };
    className?: string;
}

type GatheringInputProps =
    | (GatheringInputPropsBase & {
        type?: 'text';
        value?: string;
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    })
    | (GatheringInputPropsBase & {
        type: 'date';
        selected: Date | null;
        onChange: (date: Date | null) => void;
        placeholder?: string;
    });


const GatheringInput: React.FC<GatheringInputProps> = (props) => {
    const { label, suffixButton, suffixIconButton, className = "" } = props;

    return (
        <div className="flex flex-col gap-1">
            {label && <label className="block text-sm text-purple-700">{label}</label>}
            <div className="relative">
                {props.type === 'date' ? (
                    <DatePicker
                        locale={ko}
                        selected={props.selected}
                        onChange={props.onChange}
                        dateFormat="yyyy-MM-dd (eee)"
                        placeholderText={props.placeholder}
                        className={`w-full border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300
                        rounded-lg px-4 py-2 transition duration-200 outline-none
                        placeholder:text-sm placeholder:text-gray-400 bg-white ${className}`}
                    />
                ) : (
                    <input
                        {...props}
                        onChange={props.onChange}
                        className={`w-full border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300
                          rounded-lg px-4 py-2 transition duration-200 outline-none
                          placeholder:text-sm placeholder:text-gray-400 bg-white ${className}`}
                    />
                )}
                {suffixButton && (
                    <button
                        onClick={suffixButton.onClick}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2
                         bg-gray-800 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                        {suffixButton.label}
                    </button>
                )}
                {!suffixButton && suffixIconButton && (
                    <button
                        onClick={suffixIconButton.onClick}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 
                          text-gray-400 ${suffixIconButton.className || ""}`}
                    >
                        {suffixIconButton.icon}
                    </button>
                )}
            </div>
        </div>
    );
};


export default GatheringInput;
