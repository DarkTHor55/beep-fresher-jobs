import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JobList, JobDetail } from "./components/JobList";
import { Stats } from "./components/Stats";
import { RefreshButton } from "./components/RefreshButton";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/admin/refresh" element={<RefreshButton />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
