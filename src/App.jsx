import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./router/router";
import { MenuProvider } from "./context/MenuContext";

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
      <Router>
        <AppRoutes />
      </Router>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
