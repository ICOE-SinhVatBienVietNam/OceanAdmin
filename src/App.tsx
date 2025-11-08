import React from "react";

// Router dom
import { Route, Routes } from "react-router-dom";

// Page
import LoginPage from "./ui/page/Login";

// Layout
import MainLayout from "./ui/layout/mainLayout";
import { routeConfig } from "./config/routeConfig";

const App: React.FC = () => {
  return (
    <div className="h-full w-full">
      <Routes>
        <Route index Component={LoginPage} />
        <Route path={routeConfig.layout.main + "/*"} Component={MainLayout} />
      </Routes>
    </div>
  );
}

export default App;
