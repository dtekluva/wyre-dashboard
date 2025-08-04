import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Spin } from "antd";

function ForceLogin() {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // Build user object from query params
    const user = {};
    for (const [key, value] of params.entries()) {
      user[key] = value;
    }
    if (user.access && user.refresh) {
      window.localStorage.setItem("loggedWyreUser", JSON.stringify(user));
    }
    setTimeout(() => {
      history.replace("/dashboard");
    }, 1000);
  }, [location, history]);

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
