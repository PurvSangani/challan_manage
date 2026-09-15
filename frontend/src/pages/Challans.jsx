import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PaymentSection from "../components/PaymentSection";

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

  return (
    <div style={{ padding: "30px" }}>
      <h1>All Challans</h1>
      {/* Search */}
      <input
        type="text"
        placeholder="Search challan or party..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />{" "}
      {/* Status */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All</option>

        <option value="Pending">Pending</option>

        <option value="Partial">Partial</option>

        <option value="Paid">Paid</option>
      </select>
      <br />
      <br />
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Challan No</th>

            <th>Party</th>

            <th>WhatsApp</th>

            <th>Challan Date</th>

            <th>Amount</th>

            <th>Paid Amount</th>

            <th>Remaining</th>

            <th>Due Date</th>

            <th>Status</th>

            <th>Overdue</th>
          </tr>
        </thead>

        <tbody>
          {filteredChallans.map((challan) => {
            const remaining = Math.max(
              0,
              Number(challan.amount || 0) - Number(challan.paidAmount || 0),
            );

            const overdue = isOverdue(challan);

            return (
              <tr key={challan._id}>
                {/* Challan Number */}
                <td>
                  {" "}
                  <button onClick={() => navigate(`/challans/${challan._id}`)}>
                    {" "}
                    {challan.challanNo}{" "}
                  </button>{" "}
                </td>
                {/* Party */}
                <td>{challan.party?.name}</td>
                {/* WhatsApp */}
                <td>{challan.party?.whatsapp}</td>
                {/* Challan Date */}
                <td>{formatDate(challan.challanDate)}</td>
                {/* Amount */}
                <td>₹{challan.amount}</td>
                {/* Paid */}
                <td>₹{challan.paidAmount || 0}</td>
                {/* Remaining */}
                <td>₹{remaining}</td>
                {/* Due Date */}
                <td>{formatDate(challan.dueDate)}</td>
                {/* Status */}
                <td>{challan.status}</td>
                {/* Overdue */}
                <td>{overdue ? "Yes" : "No"}</td>

                <td>
                  <button
                    onClick={() => {
                      alert("Payment section will be opened here.");
                    }}
                  >
                    Add Payment
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filteredChallans.length === 0 && <p>No challans found.</p>}
    </div>
  );
};

export default Challans;
