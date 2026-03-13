import React from "react";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./context/ToastContext";
import "./styles/globals.css";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <Home />
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;