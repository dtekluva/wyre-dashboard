import React from "react";

function ErrorIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      fill="none"
      viewBox="0 0 15 15"
    >
      <path
        fill="#5C3592"
        d="M12.803 2.197A7.451 7.451 0 007.5 0C5.497 0 3.613.78 2.197 2.197A7.451 7.451 0 000 7.5c0 2.003.78 3.887 2.197 5.303A7.45 7.45 0 007.5 15a7.45 7.45 0 005.303-2.197A7.45 7.45 0 0015 7.5a7.45 7.45 0 00-2.197-5.303zM7.5 2.05c.888 0 1.611.723 1.611 1.611 0 .889-.723 1.611-1.611 1.611a1.613 1.613 0 01-1.611-1.61c0-.89.723-1.612 1.611-1.612zm2.05 10.254h-4.1v-.88h.878V7.032H5.45v-.879h3.223v5.274h.879v.879z"
      ></path>
    </svg>
  );
}

export default ErrorIcon;
