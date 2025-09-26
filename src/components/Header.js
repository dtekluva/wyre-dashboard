// src/components/Header.jsx
import React from "react";

const Header = ({ title }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};

export default Header;