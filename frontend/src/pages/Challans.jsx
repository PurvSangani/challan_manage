import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Challans = () => {
  const [challans, setChallans] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  // Get challans
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

  // Search + filter
  const filteredChallans = challans.filter((challan) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      challan.challanNo?.toLowerCase().includes(searchText) ||
      challan.party?.name?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || challan.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  // Check overdue
  const isOverdue = (challan) => {
    if (challan.status === "Paid") {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(challan.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  };

  const openWhatsApp = (challan) => {
    const phone = challan.party?.whatsapp;

    if (!phone) {
      alert("WhatsApp number not available");
      return;
    }

    let cleanPhone = phone.replace(/\D/g, "");

    // If database stores Indian numbers without +91
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }

    const remaining = Math.max(
      0,
      Number(challan.amount || 0) - Number(challan.paidAmount || 0),
    );

    const message = `Hello ${challan.party?.name || ""},

Your payment for Challan No. ${challan.challanNo} is pending.

Challan Amount: ₹${challan.amount}
Paid Amount: ₹${challan.paidAmount || 0}
Remaining Amount: ₹${remaining}
Due Date: ${formatDate(challan.dueDate)}

Please make the payment at your earliest convenience.

Thank you.`;

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleNilPayment = async (challan) => {
    const remaining =
      Math.max(
        0,
        Number(challan.amount || 0) -
        Number(challan.paidAmount || 0)
      );

    const confirmNil = window.confirm(
      `Are you sure you want to mark this challan as NIL?\n\n` +
      `Challan No: ${challan.challanNo}\n` +
      `Remaining Amount: ₹${remaining}\n\n` +
      `This will mark the full payment as received.`
    );

    if (!confirmNil) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/api/payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            challan: challan._id,
            amount: remaining,
            paymentDate: new Date().toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to mark payment");
        return;
      }

      alert("Full payment received. Challan marked as Paid.");

      fetchChallans();
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Paid") return <span className="badge badge-status-paid">Paid</span>;
    if (status === "Partial") return <span className="badge badge-status-partial">Partial</span>;
    return <span className="badge badge-status-pending">Pending</span>;
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">All Challans</h2>
          <p className="text-muted mb-0">View, search, and manage payment reminders</p>
        </div>
        <Link to="/add-challan" className="btn btn-primary mt-3 mt-md-0">
          <i className="bi bi-plus-lg me-1"></i> Add New Challan
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by challan number or party name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Challan No</th>
                  <th>Party</th>
                  <th>WhatsApp</th>
                  <th>Challan Date</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Remaining</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Overdue</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChallans.map((challan) => {
                  const remaining = Math.max(
                    0,
                    Number(challan.amount || 0) - Number(challan.paidAmount || 0),
                  );
                  const overdue = isOverdue(challan);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const dueDate = new Date(challan.dueDate);
                  dueDate.setHours(0, 0, 0, 0);

                  const canSendWhatsApp =
                    challan.status !== "Paid" && dueDate <= today;

                  return (
                    <tr key={challan._id}>
                      <td className="fw-semibold">
                        <button
                          className="btn btn-link p-0 text-dark fw-bold text-decoration-none"
                          onClick={() => navigate(`/challans/${challan._id}`)}
                        >
                          {challan.challanNo}
                        </button>
                      </td>
                      <td>{challan.party?.name || "—"}</td>
                      <td className="text-muted small">{challan.party?.whatsapp || "—"}</td>
                      <td>{formatDate(challan.challanDate)}</td>
                      <td>₹{challan.amount}</td>
                      <td className="text-success">₹{challan.paidAmount || 0}</td>
                      <td className="fw-bold text-dark">₹{remaining}</td>
                      <td>{formatDate(challan.dueDate)}</td>
                      <td>{getStatusBadge(challan.status)}</td>
                      <td>
                        {overdue ? (
                          <span className="badge badge-status-overdue">Yes</span>
                        ) : (
                          <span className="badge bg-light text-muted border">No</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => navigate(`/challans/${challan._id}`)}
                            title="View Challan Details"
                          >
                            Details
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              navigate(`/challans/${challan._id}/edit`)
                            }
                            title="Edit Challan"
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </button>
                          {canSendWhatsApp && (
                            <button
                              type="button"
                              className="btn btn-sm btn-whatsapp"
                              onClick={() => openWhatsApp(challan)}
                              title="Send WhatsApp Reminder"
                            >
                              <i className="bi bi-whatsapp me-1"></i> Remind
                            </button>
                          )}

                          {remaining > 0 && challan.status !== "Paid" && (
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleNilPayment(challan)}
                              title="Mark full payment received"
                            >
                              NIL
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredChallans.length === 0 && (
            <div className="p-4 text-center text-muted">
              <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
              No challans found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Challans;
