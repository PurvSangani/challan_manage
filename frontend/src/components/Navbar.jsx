import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
      <div className="container">
        <div className="navbar-brand d-flex align-items-center text-dark" >
          <i className="bi bi-receipt me-2 text-dark fs-4"></i>
          <span>ChallanManager</span>
        </div>
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <Link
                className={`nav-link px-3 fw-medium ${isActive("/") ? "active text-dark border-bottom border-2 border-dark" : "text-muted"
                  }`}
                to="/"
              >
                <i className="bi bi-grid me-1"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link px-3 fw-medium ${isActive("/challans") ? "active text-dark border-bottom border-2 border-dark" : "text-muted"
                  }`}
                to="/challans"
              >
                <i className="bi bi-file-earmark-text me-1"></i> Challans
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link px-3 fw-medium ${isActive("/parties") ? "active text-dark border-bottom border-2 border-dark" : "text-muted"
                  }`}
                to="/parties"
              >
                <i className="bi bi-people me-1"></i> Parties
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            <Link to="/add-challan" className="btn btn-primary d-flex align-items-center">
              <i className="bi bi-plus-lg me-1"></i> Add Challan
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
