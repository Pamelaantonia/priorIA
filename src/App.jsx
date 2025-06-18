import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import CreatePlanPage from "./components/CreatePlanPage";
import PlanDetailPage from "./components/PlanDetailPage";
import PlansDashboardPage from "./components/PlansDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/crear-plan" element={<CreatePlanPage />} />
        <Route path="/plan/:id" element={<PlanDetailPage />} />
        <Route path="/planes" element={<PlansDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;