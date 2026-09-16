import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddChallan from "./pages/AddChallan";
import PartyDetails from "./pages/PartyDetails";
import Challans from "./pages/Challans";
import Parties from "./pages/Parties";
import ChallanDetails from "./pages/ChallanDetails";
import EditChallan from "./pages/EditChallan";
function App() {
  return (
    <BrowserRouter>
      <div className="min-vh-100 d-flex flex-column bg-light">
        <Navbar />
        <main className="flex-grow-1 py-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-challan" element={<AddChallan />} />
            <Route
              path="/challans/:id/edit"
              element={<EditChallan />}
            />
            <Route path="/parties" element={<Parties />} />
            <Route path="/parties/:id" element={<PartyDetails />} />
            <Route path="/challans" element={<Challans />} />
            <Route path="/challans/:id" element={<ChallanDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
