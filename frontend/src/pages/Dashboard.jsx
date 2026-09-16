import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [challans, setChallans] = useState([]);

  const fetchChallans = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/challans");
      const data = await response.json();
      setChallans(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, []);

  // -------------------------
  // Amount calculations
  // -------------------------
  const totalChallans = challans.length;

  const totalAmount = challans.reduce(
    (total, challan) => total + Number(challan.amount || 0),
    0,
  );

  const paidAmount = challans.reduce(
    (total, challan) => total + Number(challan.paidAmount || 0),
    0,
  );

  const remainingAmount = totalAmount - paidAmount;

  // -------------------------
  // Status calculations
  // -------------------------
  const pendingChallans = challans.filter(
    (challan) => challan.status === "Pending",
  ).length;

  const partialChallans = challans.filter(
    (challan) => challan.status === "Partial",
  ).length;

  const paidChallans = challans.filter(
    (challan) => challan.status === "Paid",
  ).length;

  // -------------------------
  // Date helper
  // -------------------------
  const getDateOnly = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const today = getDateOnly(new Date());

  // Due Today
  const dueTodayChallans = challans.filter((challan) => {
    if (challan.status === "Paid") return false;
    const dueDate = getDateOnly(challan.dueDate);
    return dueDate.getTime() === today.getTime();
  });

  // Overdue
  const overdueChallans = challans.filter((challan) => {
    if (challan.status === "Paid") return false;
    const dueDate = getDateOnly(challan.dueDate);
    return dueDate < today;
  });

  // Upcoming
  const upcomingChallans = challans.filter((challan) => {
    if (challan.status === "Paid") return false;
    const dueDate = getDateOnly(challan.dueDate);
    return dueDate > today;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="container">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Dashboard Overview</h2>
          <p className="text-muted mb-0">Challan & Payment Reminder System</p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link to="/add-challan" className="btn btn-primary">
            <i className="bi bi-plus-lg me-1"></i> Add Challan
          </Link>
          <Link to="/challans" className="btn btn-outline-dark">
            <i className="bi bi-list-ul me-1"></i> View All Challans
          </Link>
          <Link to="/parties" className="btn btn-outline-dark">
            <i className="bi bi-people me-1"></i> View Parties
          </Link>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Total Challans</span>
                <h3 className="fw-bold mb-0 mt-1">{totalChallans}</h3>
              </div>
              <div className="stat-icon bg-light text-dark border">
                <i className="bi bi-file-earmark-text fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Total Amount</span>
                <h3 className="fw-bold mb-0 mt-1">₹{totalAmount.toLocaleString("en-IN")}</h3>
              </div>
              <div className="stat-icon bg-light text-dark border">
                <i className="bi bi-currency-rupee fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Paid Amount</span>
                <h3 className="fw-bold mb-0 mt-1 text-success">₹{paidAmount.toLocaleString("en-IN")}</h3>
              </div>
              <div className="stat-icon bg-light text-success border">
                <i className="bi bi-check-circle fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Remaining Amount</span>
                <h3 className="fw-bold mb-0 mt-1 text-dark">₹{remainingAmount.toLocaleString("en-IN")}</h3>
              </div>
              <div className="stat-icon bg-light text-dark border">
                <i className="bi bi-clock-history fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status & Reminders Breakdown */}
      <div className="row g-3 mb-4">
        {/* Payment Status Card */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="card-title fw-semibold mb-0 text-dark">
                <i className="bi bi-pie-chart me-2"></i>Payment Status
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center g-2">
                <div className="col-4">
                  <div className="p-3 rounded bg-light border">
                    <span className="badge badge-status-pending mb-2">Pending</span>
                    <h4 className="fw-bold mb-0 text-dark">{pendingChallans}</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 rounded bg-light border">
                    <span className="badge badge-status-partial mb-2">Partial</span>
                    <h4 className="fw-bold mb-0 text-dark">{partialChallans}</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 rounded bg-light border">
                    <span className="badge badge-status-paid mb-2">Paid</span>
                    <h4 className="fw-bold mb-0 text-dark">{paidChallans}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reminders Breakdown Card */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="card-title fw-semibold mb-0 text-dark">
                <i className="bi bi-bell me-2"></i>Payment Reminders Breakdown
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center g-2">
                <div className="col-4">
                  <div className="p-3 rounded bg-light border">
                    <span className="badge bg-dark-subtle text-dark border mb-2">Due Today</span>
                    <h4 className="fw-bold mb-0 text-dark">{dueTodayChallans.length}</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 rounded bg-light border">
                    <span className="badge badge-status-overdue mb-2">Overdue</span>
                    <h4 className="fw-bold mb-0 text-danger">{overdueChallans.length}</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 rounded bg-light border">
                    <span className="badge bg-secondary-subtle text-secondary border mb-2">Upcoming</span>
                    <h4 className="fw-bold mb-0 text-dark">{upcomingChallans.length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="row g-4">
        {/* Due Today Table */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 className="card-title fw-semibold mb-0 text-dark">
                <i className="bi bi-calendar-event me-2"></i>Due Today ({dueTodayChallans.length})
              </h5>
            </div>
            <div className="card-body p-0">
              {dueTodayChallans.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <i className="bi bi-check2-circle fs-2 d-block mb-2 text-secondary"></i>
                  No payments due today.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Challan No</th>
                        <th>Party</th>
                        <th>Amount</th>
                        <th>Remaining</th>
                        <th>Due Date</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dueTodayChallans.map((challan) => {
                        const remaining =
                          Number(challan.amount || 0) - Number(challan.paidAmount || 0);
                        return (
                          <tr key={challan._id}>
                            <td className="fw-semibold">{challan.challanNo}</td>
                            <td>{challan.party?.name || "—"}</td>
                            <td>₹{challan.amount}</td>
                            <td className="fw-bold text-dark">₹{remaining}</td>
                            <td>{formatDate(challan.dueDate)}</td>
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-dark"
                                onClick={() => navigate(`/challans/${challan._id}`)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overdue Payments Table */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 className="card-title fw-semibold mb-0 text-dark">
                <i className="bi bi-exclamation-triangle me-2 text-danger"></i>Overdue Payments ({overdueChallans.length})
              </h5>
            </div>
            <div className="card-body p-0">
              {overdueChallans.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <i className="bi bi-emoji-smile fs-2 d-block mb-2 text-secondary"></i>
                  No overdue payments. All clear!
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Challan No</th>
                        <th>Party</th>
                        <th>Remaining</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueChallans.map((challan) => {
                        const remaining =
                          Number(challan.amount || 0) - Number(challan.paidAmount || 0);
                        return (
                          <tr key={challan._id}>
                            <td className="fw-semibold">{challan.challanNo}</td>
                            <td>{challan.party?.name || "—"}</td>
                            <td className="fw-bold text-danger">₹{remaining}</td>
                            <td className="text-danger fw-medium">{formatDate(challan.dueDate)}</td>
                            <td>
                              <span className="badge badge-status-overdue">Overdue</span>
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-dark"
                                onClick={() => navigate(`/challans/${challan._id}`)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
