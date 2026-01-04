import React from "react";

// Router dom
import { Route, Routes } from "react-router-dom";

// Page
import LoginPage from "./ui/page/Login";

// Layout
import MainLayout from "./ui/layout/mainLayout";
import { routeConfig } from "./config/routeConfig";
import { ToastContainer } from "react-toastify";
import { Auth } from "./ui/component/Auth";

const App: React.FC = () => {
  return (
    <div className="h-full w-full">
      <Auth />
      <Routes>
        <Route index Component={LoginPage} />
        <Route path={routeConfig.layout.main + "/*"} Component={MainLayout} />
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default App;
