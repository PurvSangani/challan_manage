import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Parties = () => {
  const [parties, setParties] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    paymentDays: 30,
  });

  const navigate = useNavigate();

  // Get all parties
  const fetchParties = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/parties");

      const data = await response.json();

      setParties(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  // Handle form input
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
      const response = await fetch("http://localhost:5001/api/parties", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...formData,
          paymentDays: Number(formData.paymentDays),
        }),
      });

      const data = await response.json();

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
        alert(data.message);
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
    <div style={{ padding: "30px" }}>
      <h1>Parties</h1>
      {/* Search */}
      <input
        type="text"
        placeholder="Search party..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />{" "}
      {/* Add Party Button */}
      <button onClick={() => setShowForm(!showForm)}>Add Party</button>
      {/* Add Party Form */}
      {showForm && (
        <div style={{ marginTop: "20px" }}>
          <h2>Add Party</h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Party Name</label>

              <br />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ABC Hardware"
                required
              />
            </div>

            <br />

            <div>
              <label>WhatsApp Number</label>

              <br />

              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="9876543210"
                required
              />
            </div>

            <br />

            <div>
              <label>Payment Days</label>

              <br />

              <input
                type="number"
                name="paymentDays"
                value={formData.paymentDays}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <br />

            <button type="submit">Save Party</button>
          </form>
        </div>
      )}
      <hr />
      {/* Party List */}
      {filteredParties.map((party) => (
        <div
          key={party._id}
          onClick={() => navigate(`/parties/${party._id}`)}
          style={{
            border: "1px solid black",
            padding: "15px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
        >
          <h3>{party.name}</h3>

          <p>WhatsApp: {party.whatsapp}</p>

          <p>Payment Days: {party.paymentDays} days</p>
        </div>
      ))}
      {filteredParties.length === 0 && <p>No parties found.</p>}
    </div>
  );
};

export default Parties;
