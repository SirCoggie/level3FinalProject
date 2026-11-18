import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { router } from "./assets/router/router";
import { AuthProvider } from "./assets/authentification/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer theme="dark" position="top-right" autoClose={2500} />
    </AuthProvider>
  </StrictMode>,
);
