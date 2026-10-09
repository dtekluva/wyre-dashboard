import React from "react";

function ChevronDown({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fill="#5C3592"
        fillRule="evenodd"
        d="M7 10l5 5 5-5H7z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default ChevronDown;
