import { useEffect, useState } from "react";

const AddChallan = () => {
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
      const response = await fetch("http://localhost:5001/api/challans", {
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
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Error:", error);

      alert("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Add Challan</h1>

      <form onSubmit={handleSubmit}>
        {/* Challan Number */}

        <div>
          <label>Challan Number</label>

          <br />

          <input
            type="text"
            name="challanNo"
            value={formData.challanNo}
            onChange={handleChange}
            placeholder="CH-1001"
            required
          />
        </div>

        <br />

        {/* Search Party */}

        <div style={{ position: "relative" }}>
          <label>Party</label>

          <br />

          <input
            type="text"
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
            placeholder="Search party..."
            required
          />

          {/* Party Results */}

          {showParties && searchParty && (
            <div
              style={{
                border: "1px solid #ccc",
                width: "220px",
                background: "white",
                position: "absolute",
                zIndex: 10,
              }}
            >
              {filteredParties.map((party) => (
                <div
                  key={party._id}
                  onClick={() => selectParty(party)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <strong>{party.name}</strong>

                  <br />

                  <small>{party.whatsapp}</small>
                </div>
              ))}

              {filteredParties.length === 0 && (
                <p
                  style={{
                    padding: "10px",
                  }}
                >
                  No party found
                </p>
              )}
            </div>
          )}
        </div>

        <br />

        {/* Selected Party Information */}

        {selectedParty && (
          <div>
            <p>
              <strong>WhatsApp:</strong> {selectedParty.whatsapp}
            </p>

            <p>
              <strong>Payment Days:</strong> {selectedParty.paymentDays} days
            </p>
          </div>
        )}

        {/* Challan Date */}

        <div>
          <label>Challan Date</label>

          <br />

          <input
            type="date"
            name="challanDate"
            value={formData.challanDate}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Amount */}

        <div>
          <label>Amount</label>

          <br />

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="25000"
            min="0"
            required
          />
        </div>

        <br />
        {/* Paid Amount */}

        <div>
          <label>Paid Amount</label>

          <br />

          <input
            type="number"
            name="paidAmount"
            value={formData.paidAmount}
            onChange={handleChange}
            min="0"
            placeholder="0"
          />
        </div>

        <br />
        {formData.amount && (
          <p>
            <strong>Remaining Amount:</strong> ₹
            {Math.max(
              0,
              Number(formData.amount) - Number(formData.paidAmount || 0),
            )}
          </p>
        )}

        {/* Due Date */}

        <div>
          <label>Due Date</label>

          <br />

          <input type="date" value={calculateDueDate()} readOnly />
        </div>

        <br />

        <button type="submit">Save Challan</button>
      </form>
    </div>
  );
};

export default AddChallan;
