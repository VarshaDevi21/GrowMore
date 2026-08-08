import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landing/LandingPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import RoadmapPage from "./pages/Roadmap/RoadmapPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />
        <Route
          path="/roadmap"
          element={<RoadmapPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;