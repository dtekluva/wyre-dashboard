import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";

function ForceLogin() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const user = {};
    for (const [key, value] of params.entries()) {
      user[key] = value;
    }
    if (user.access && user.refresh) {
      window.localStorage.setItem("loggedWyreUser", JSON.stringify(user));
    }
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1000);
  }, [location, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <Spin size="large" />
      <div style={{ marginTop: 20 }}>Logging you in...</div>
    </div>
  );
}

export default ForceLogin;
