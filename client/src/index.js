import React from "react";
import App from "./components/App";
import "./index.css";
import { createRoot, BrowserRouter } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<BrowserRouter><App /></BrowserRouter>);
