import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddChallan from "./pages/AddChallan";
import PartyDetails from "./pages/PartyDetails";
import Challans from "./pages/Challans";
import Parties from "./pages/Parties";
import ChallanDetails from "./pages/ChallanDetails";
import EditChallan from "./pages/EditChallan";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-vh-100 d-flex flex-column bg-light">
          <Navbar />
          <main className="flex-grow-1 py-4">
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-challan"
                element={
                  <ProtectedRoute>
                    <AddChallan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challans/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditChallan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parties"
                element={
                  <ProtectedRoute>
                    <Parties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parties/:id"
                element={
                  <ProtectedRoute>
                    <PartyDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challans"
                element={
                  <ProtectedRoute>
                    <Challans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challans/:id"
                element={
                  <ProtectedRoute>
                    <ChallanDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
