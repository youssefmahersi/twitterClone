import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import { AuthProvider } from "./contextes/AuthContext";
ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
