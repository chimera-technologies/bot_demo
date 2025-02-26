import React from "react";
import PropTypes from "prop-types";
const ButtonWithColor = ({ text }) => {
  const getColorClass = (text) => {
    switch (text) {
      case "Paint":
        return "bg-green-500";
      case "Comp":
        return "bg-orange-500";
      case "Roto":
        return "bg-blue-500";
      case "RM":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="flex items-center border rounded-lg overflow-hidden w-40 h-8 m-auto">
      {/* Left color block */}
      <div
        className={`${getColorClass(
          text
        )}`}
        style={{ width: "20%", height: "100%" }}
      ></div>
      {/* Right text section */}
      <div className="w-4/5 px-3 text-sm flex items-center justify-center">
        {text}
      </div>
    </div>
  );
};

export default ButtonWithColor;

ButtonWithColor.propTypes = { text: PropTypes.string.isRequired };