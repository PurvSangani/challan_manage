import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddChallan = () => {
  const navigate = useNavigate();
  const [parties, setParties] = useState([]);
  const [searchParty, setSearchParty] = useState("");
  const [showParties, setShowParties] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);

  const [formData, setFormData] = useState({
    challanNo: "",
    party: "",
    challanDate: "",
    amount: "",
    paidAmount: 0,
  });

  // Get parties
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/parties");
        const data = await response.json();
        setParties(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchParties();
  }, []);

  // Select party
  const selectParty = (party) => {
    setSelectedParty(party);
    setSearchParty(party.name);
    setShowParties(false);
    setFormData({
      ...formData,
      party: party._id,
    });
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Search parties
  const filteredParties = parties.filter((party) =>
    party.name.toLowerCase().includes(searchParty.toLowerCase()),
  );

  // Calculate due date
  const calculateDueDate = () => {
    if (!formData.challanDate || !selectedParty) {
      return "";
    }
    const date = new Date(formData.challanDate);
    date.setDate(date.getDate() + selectedParty.paymentDays);
    return date.toISOString().split("T")[0];
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedParty) {
      alert("Please select a party");
      return;
    }

    try {
      const response = fetch(`${import.meta.env.VITE_API_URL}/api/challans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Challan added successfully!");
        setFormData({
          challanNo: "",
          party: "",
          challanDate: "",
          amount: "",
          paidAmount: 0,
        });
        setSelectedParty(null);
        setSearchParty("");
        navigate("/challans");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container py-2" style={{ maxWidth: "720px" }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Add New Challan</h2>
          <p className="text-muted mb-0">Create a new bill entry for a party</p>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/challans")}
        >
          <i className="bi bi-arrow-left me-1"></i> Back to Challans
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Challan Number */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-dark">Challan Number</label>
              <input
                type="text"
                className="form-control"
                name="challanNo"
                value={formData.challanNo}
                onChange={handleChange}
                placeholder="e.g. CH-1001"
                required
              />
            </div>

            {/* Search Party Dropdown */}
            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold text-dark">Select Party</label>
              <input
                type="text"
                className="form-control"
                value={searchParty}
                onChange={(e) => {
                  setSearchParty(e.target.value);
                  setShowParties(true);
                  setSelectedParty(null);
                  setFormData({
                    ...formData,
                    party: "",
                  });
                }}
                onFocus={() => setShowParties(true)}
                placeholder="Type to search party name..."
                required
              />

              {showParties && searchParty && (
                <div className="card shadow-sm border party-search-dropdown">
                  {filteredParties.map((party) => (
                    <div
                      key={party._id}
                      className="party-search-item"
                      onClick={() => selectParty(party)}
                    >
                      <strong className="text-dark d-block">{party.name}</strong>
                      <small className="text-muted">
                        <i className="bi bi-whatsapp me-1 text-success"></i>
                        {party.whatsapp} | {party.paymentDays} Days Credit
                      </small>
                    </div>
                  ))}

                  {filteredParties.length === 0 && (
                    <div className="p-3 text-muted text-center small">No party found</div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Party Info Box */}
            {selectedParty && (
              <div className="alert alert-secondary py-2 px-3 mb-3 border-0 bg-light">
                <div className="row small">
                  <div className="col-6">
                    <strong className="text-muted">WhatsApp:</strong>{" "}
                    <span className="text-dark fw-medium">{selectedParty.whatsapp}</span>
                  </div>
                  <div className="col-6">
                    <strong className="text-muted">Payment Days:</strong>{" "}
                    <span className="text-dark fw-medium">{selectedParty.paymentDays} days</span>
                  </div>
                </div>
              </div>
            )}

            {/* Challan Date */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-dark">Challan Date</label>
              <input
                type="date"
                className="form-control"
                name="challanDate"
                value={formData.challanDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Amount and Paid Amount Row */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-dark">Total Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="25000"
                  min="0"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-dark">Initial Paid Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Summary Highlights */}
            {formData.amount && (
              <div className="alert alert-light border py-2 px-3 mb-3 d-flex justify-content-between align-items-center">
                <span className="text-muted fw-medium">Calculated Remaining:</span>
                <span className="fw-bold text-dark fs-5">
                  ₹{Math.max(0, Number(formData.amount) - Number(formData.paidAmount || 0))}
                </span>
              </div>
            )}

            {/* Calculated Due Date */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-dark">Auto-Calculated Due Date</label>
              <input
                type="date"
                className="form-control bg-light"
                value={calculateDueDate()}
                readOnly
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
              <i className="bi bi-check-circle me-1"></i> Save Challan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddChallan;
