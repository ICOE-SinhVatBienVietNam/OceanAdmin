import React from "react";

// Router dom
import { Route, Routes } from "react-router-dom";

// Page
import LoginPage from "./ui/page/Login";

const App: React.FC = () => {
  return (
    <div className="h-full w-full">
      <Routes>
        <Route path="/" Component={LoginPage} />
      </Routes>
    </div>
  );
}

export default App;
