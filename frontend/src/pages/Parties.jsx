import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, getAuthHeaders } from "../api";
import ContactPickerButton from "../components/ContactPickerButton";

const Parties = () => {
  const [parties, setParties] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    paymentDays: 30,
  });

  const [editingParty, setEditingParty] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    whatsapp: "",
    paymentDays: 30,
  });

  const navigate = useNavigate();

  // Get all parties
  const fetchParties = async () => {
    try {
      const response = await fetch(`${API_URL}/api/parties`, {
        headers: getAuthHeaders(),
      });
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setParties(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  // Handle form input for creating party
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add party
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/parties`, {
        method: "POST",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          ...formData,
          paymentDays: Number(formData.paymentDays),
        }),
      });

      const contentType = response.headers.get("content-type");
      const data = contentType && contentType.includes("application/json") ? await response.json() : {};

      if (response.ok) {
        alert("Party added successfully!");
        setFormData({
          name: "",
          whatsapp: "",
          paymentDays: 30,
        });
        setShowForm(false);
        fetchParties();
      } else {
        alert(data.message || "Failed to add party");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong");
    }
  };

  // Start editing a party
  const handleStartEdit = (party) => {
    setEditingParty(party);
    setEditFormData({
      name: party.name,
      whatsapp: party.whatsapp,
      paymentDays: party.paymentDays,
    });
    setShowForm(false);
  };

  // Handle edit form input
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Update party submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/parties/${editingParty._id}`, {
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
        setEditingParty(null);
        fetchParties();
      } else {
        alert(data.message || "Failed to update party");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong");
    }
  };

  // Delete party
  const handleDeleteParty = async (party) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete party "${party.name}"?\n\nWARNING: All associated challans and payment records for this party will also be permanently deleted!`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/parties/${party._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const contentType = response.headers.get("content-type");
      const data = contentType && contentType.includes("application/json") ? await response.json() : {};

      if (response.ok) {
        alert("Party deleted successfully!");
        if (editingParty && editingParty._id === party._id) {
          setEditingParty(null);
        }
        fetchParties();
      } else {
        alert(data.message || "Failed to delete party");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong");
    }
  };

  // Search parties
  const filteredParties = parties.filter((party) => {
    const searchText = search.toLowerCase();
    return (
      party.name.toLowerCase().includes(searchText) ||
      party.whatsapp.includes(searchText)
    );
  });

  return (
    <div className="container">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Parties Directory</h2>
          <p className="text-muted mb-0">Manage party profiles and payment credit terms</p>
        </div>
        <button
          className="btn btn-primary mt-3 mt-md-0"
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setEditingParty(null);
          }}
        >
          <i className={`bi ${showForm ? "bi-dash-lg" : "bi-plus-lg"} me-1`}></i>
          {showForm ? "Close Form" : "Add Party"}
        </button>
      </div>

      {/* Add Party Form Card */}
      {showForm && (
        <div className="card shadow-sm border-0 mb-4 border-start border-4 border-primary">
          <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="card-title fw-semibold mb-0 text-dark">
              <i className="bi bi-person-plus me-2 text-primary"></i>Create New Party
            </h5>
            <ContactPickerButton
              onSelectContact={(contact) => {
                setFormData((prev) => ({
                  ...prev,
                  ...(contact.name ? { name: contact.name } : {}),
                  ...(contact.whatsapp ? { whatsapp: contact.whatsapp } : {}),
                }));
              }}
            />
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-5">
                  <label className="form-label fw-semibold text-dark">Party Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. ABC Hardware Traders"
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold text-dark">WhatsApp Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    required
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold text-dark">Credit Payment Days</label>
                  <input
                    type="number"
                    className="form-control"
                    name="paymentDays"
                    value={formData.paymentDays}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4">
                  <i className="bi bi-check-circle me-1"></i> Save Party
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Party Form Card */}
      {editingParty && (
        <div className="card shadow-sm border-0 mb-4 border-start border-4 border-warning">
          <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="card-title fw-semibold mb-0 text-dark">
              <i className="bi bi-pencil-square me-2 text-warning"></i>Edit Party: {editingParty.name}
            </h5>
            <div className="d-flex align-items-center gap-2">
              <ContactPickerButton
                className="btn btn-outline-warning btn-sm"
                onSelectContact={(contact) => {
                  setEditFormData((prev) => ({
                    ...prev,
                    ...(contact.name ? { name: contact.name } : {}),
                    ...(contact.whatsapp ? { whatsapp: contact.whatsapp } : {}),
                  }));
                }}
              />
              <button className="btn-close" onClick={() => setEditingParty(null)}></button>
            </div>
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
                  onClick={() => setEditingParty(null)}
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

      {/* Search Input */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by party name or WhatsApp number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Party Grid */}
      <div className="row g-3">
        {filteredParties.map((party) => (
          <div className="col-12 col-md-6 col-lg-4" key={party._id}>
            <div
              className="party-card h-100 p-3 d-flex flex-column justify-content-between"
              onClick={() => navigate(`/parties/${party._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold mb-0 text-dark">{party.name}</h5>
                  <span className="badge bg-light text-dark border">
                    {party.paymentDays} Days Credit
                  </span>
                </div>
                <div className="text-muted small mb-3">
                  <i className="bi bi-whatsapp text-success me-1"></i>
                  <span>{party.whatsapp}</span>
                </div>
              </div>
              <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary py-1 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(party);
                    }}
                    title="Edit Party"
                  >
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger py-1 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteParty(party);
                    }}
                    title="Delete Party"
                  >
                    <i className="bi bi-trash me-1"></i>Delete
                  </button>
                </div>
                <i className="bi bi-arrow-right text-dark"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredParties.length === 0 && (
        <div className="card shadow-sm border-0 p-5 text-center text-muted mt-3">
          <i className="bi bi-people fs-1 d-block mb-2 text-secondary"></i>
          No parties found matching your search.
        </div>
      )}
    </div>
  );
};

export default Parties;
