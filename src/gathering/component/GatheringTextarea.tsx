import React from "react";

interface GatheringTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  minHeight?: string;
}

const GatheringTextarea: React.FC<GatheringTextareaProps> = ({
  label,
  minHeight = "200px",
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="block text-sm text-purple-700">{label}</label>}
      <textarea
        {...props}
        className={`w-full border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300
                    rounded-lg px-4 py-3 transition duration-200 outline-none
                    placeholder:text-sm placeholder:text-gray-400 bg-white min-h-[400px] resize-none
                    ${className}`}
        style={{ minHeight }}
      />
    </div>
  );
};

export default GatheringTextarea;
