import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_URL, getAuthHeaders } from "../api";

const PartyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [party, setParty] = useState(null);
  const [challans, setChallans] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    whatsapp: "",
    paymentDays: 30,
  });

  const fetchPartyDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/parties/${id}`, {
        headers: getAuthHeaders(),
      });
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setParty(data.party);
        setChallans(data.challans || []);
        if (data.party) {
          setEditFormData({
            name: data.party.name,
            whatsapp: data.party.whatsapp,
            paymentDays: data.party.paymentDays,
          });
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchPartyDetails();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/parties/${id}`, {
        method: "PUT",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          ...editFormData,
          paymentDays: Number(editFormData.paymentDays),
        }),
      });

      const contentType = response.headers.get("content-type");
      const data = contentType && contentType.includes("application/json") ? await response.json() : {};

      if (response.ok) {
        alert("Party updated successfully!");
        setIsEditing(false);
        fetchPartyDetails();
      } else {
        alert(data.message || "Failed to update party");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong");
    }
  };

  const handleDeleteParty = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete party "${party.name}"?\n\nWARNING: All associated challans and payment records for this party will also be permanently deleted!`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/parties/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const contentType = response.headers.get("content-type");
      const data = contentType && contentType.includes("application/json") ? await response.json() : {};

      if (response.ok) {
        alert("Party deleted successfully!");
        navigate("/parties");
      } else {
        alert(data.message || "Failed to delete party");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong");
    }
  };

  if (!party) {
    return (
      <div className="container py-5 text-center text-muted">
        <div className="spinner-border text-dark mb-2" role="status"></div>
        <p>Loading party details...</p>
      </div>
    );
  }

  // Total amount
  const totalAmount = challans.reduce(
    (total, challan) => total + Number(challan.amount || 0),
    0,
  );

  // Total paid
  const totalPaid = challans.reduce(
    (total, challan) => total + Number(challan.paidAmount || 0),
    0,
  );

  // Total remaining
  const totalRemaining = totalAmount - totalPaid;

  // Overdue check
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

  const getStatusBadge = (status) => {
    if (status === "Paid") return <span className="badge badge-status-paid">Paid</span>;
    if (status === "Partial") return <span className="badge badge-status-partial">Partial</span>;
    return <span className="badge badge-status-pending">Pending</span>;
  };

  return (
    <div className="container">
      {/* Back Button & Header */}
      <div className="mb-4">
        <Link to="/parties" className="btn btn-outline-secondary btn-sm mb-3">
          <i className="bi bi-arrow-left me-1"></i> Back to Parties
        </Link>
        <div className="card shadow-sm border-0 p-4 bg-white mb-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
              <h2 className="fw-bold mb-1 text-dark">{party.name}</h2>
              <div className="d-flex flex-wrap gap-3 text-muted small mt-2">
                <span>
                  <i className="bi bi-whatsapp text-success me-1"></i>
                  {party.whatsapp}
                </span>
                <span>
                  <i className="bi bi-calendar-check me-1"></i>
                  {party.paymentDays} Days Credit Term
                </span>
              </div>
            </div>
            <div className="mt-3 mt-md-0 d-flex gap-2 flex-wrap">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <i className={`bi ${isEditing ? "bi-x-lg" : "bi-pencil"} me-1`}></i>
                {isEditing ? "Close Edit" : "Edit Party"}
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleDeleteParty}
              >
                <i className="bi bi-trash me-1"></i> Delete Party
              </button>
              <Link to="/add-challan" className="btn btn-primary btn-sm">
                <i className="bi bi-plus-lg me-1"></i> Create Challan for Party
              </Link>
            </div>
          </div>
        </div>

        {/* Edit Party Form */}
        {isEditing && (
          <div className="card shadow-sm border-0 mb-4 border-start border-4 border-warning">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 className="card-title fw-semibold mb-0 text-dark">
                <i className="bi bi-pencil-square me-2 text-warning"></i>Edit Party: {party.name}
              </h5>
              <button className="btn-close" onClick={() => setIsEditing(false)}></button>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleUpdateSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-5">
                    <label className="form-label fw-semibold text-dark">Party Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-dark">WhatsApp Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="whatsapp"
                      value={editFormData.whatsapp}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold text-dark">Credit Payment Days</label>
                    <input
                      type="number"
                      className="form-control"
                      name="paymentDays"
                      value={editFormData.paymentDays}
                      onChange={handleEditChange}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning px-4 text-white">
                    <i className="bi bi-check-circle me-1"></i> Update Party
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 p-3 h-100">
            <span className="text-muted small text-uppercase fw-semibold">Total Challans</span>
            <h3 className="fw-bold mb-0 mt-1">{challans.length}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 p-3 h-100">
            <span className="text-muted small text-uppercase fw-semibold">Total Amount</span>
            <h3 className="fw-bold mb-0 mt-1">₹{totalAmount.toLocaleString("en-IN")}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 p-3 h-100">
            <span className="text-muted small text-uppercase fw-semibold">Total Paid</span>
            <h3 className="fw-bold mb-0 mt-1 text-success">₹{totalPaid.toLocaleString("en-IN")}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 p-3 h-100">
            <span className="text-muted small text-uppercase fw-semibold">Total Remaining</span>
            <h3 className="fw-bold mb-0 mt-1 text-dark">₹{totalRemaining.toLocaleString("en-IN")}</h3>
          </div>
        </div>
      </div>

      {/* Challans Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom py-3">
          <h5 className="card-title fw-semibold mb-0 text-dark">
            <i className="bi bi-file-earmark-text me-2"></i>Party Challans ({challans.length})
          </h5>
        </div>
        <div className="card-body p-0">
          {challans.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
              No challans found for this party.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Challan No</th>
                    <th>Challan Date</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th>Remaining</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Overdue</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {challans.map((challan) => {
                    const remaining = Math.max(
                      0,
                      Number(challan.amount || 0) - Number(challan.paidAmount || 0),
                    );

                    const overdue = isOverdue(challan);

                    return (
                      <tr key={challan._id}>
                        <td className="fw-semibold">{challan.challanNo}</td>
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
                          <Link
                            to={`/challans/${challan._id}`}
                            className="btn btn-sm btn-outline-dark"
                          >
                            View
                          </Link>
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
  );
};

export default PartyDetails;
