import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center text-dark" to="/">
          <i className="bi bi-receipt me-2 text-primary fs-4"></i>
          <span className="fw-bold">ChallanManager</span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
                <li className="nav-item">
                  <Link
                    className={`nav-link px-3 fw-medium ${
                      isActive("/")
                        ? "active text-dark border-bottom border-2 border-dark"
                        : "text-muted"
                    }`}
                    to="/"
                  >
                    <i className="bi bi-grid me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link px-3 fw-medium ${
                      isActive("/challans")
                        ? "active text-dark border-bottom border-2 border-dark"
                        : "text-muted"
                    }`}
                    to="/challans"
                  >
                    <i className="bi bi-file-earmark-text me-1"></i> Challans
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link px-3 fw-medium ${
                      isActive("/parties")
                        ? "active text-dark border-bottom border-2 border-dark"
                        : "text-muted"
                    }`}
                    to="/parties"
                  >
                    <i className="bi bi-people me-1"></i> Parties
                  </Link>
                </li>
              </ul>

              <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
                <Link to="/add-challan" className="btn btn-primary btn-sm me-2">
                  <i className="bi bi-plus-lg me-1"></i> Add Challan
                </Link>

                <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border me-2">
                  <i className="bi bi-person-circle text-primary me-2"></i>
                  <span className="fw-semibold text-dark small">{user?.name || "User"}</span>
                </div>

                <button
                  onClick={logout}
                  className="btn btn-outline-danger btn-sm"
                  title="Logout"
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2 ms-auto">
              <Link to="/login" className="btn btn-outline-primary btn-sm me-1">
                <i className="bi bi-box-arrow-in-right me-1"></i> Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <i className="bi bi-person-plus me-1"></i> Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
