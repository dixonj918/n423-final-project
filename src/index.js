import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import Menu from "./pages/menu";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Menu />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
