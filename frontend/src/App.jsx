import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddChallan from "./pages/AddChallan";
import PartyDetails from "./pages/PartyDetails";
import Challans from "./pages/Challans";
import Parties from "./pages/Parties";
import ChallanDetails from "./pages/ChallanDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/add-challan" element={<AddChallan />} />
        <Route path="/parties" element={<Parties />} />
        <Route path="/parties/:id" element={<PartyDetails />} />

        <Route path="/challans" element={<Challans />} />
        <Route path="/challans/:id" element={<ChallanDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
