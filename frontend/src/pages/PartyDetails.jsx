import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PartyDetails = () => {
  const { id } = useParams();

  const [party, setParty] = useState(null);
  const [challans, setChallans] = useState([]);

  const fetchPartyDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/parties/${id}`);

      const data = await response.json();

      setParty(data.party);
      setChallans(data.challans);
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

  if (!party) {
    return <p>Loading...</p>;
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

  return (
    <div style={{ padding: "30px" }}>
      <h1>Party Details</h1>

      <hr />

      <h2>{party.name}</h2>

      <p>
        <strong>WhatsApp:</strong> {party.whatsapp}
      </p>

      <p>
        <strong>Payment Days:</strong> {party.paymentDays} days
      </p>

      <hr />

      <h2>Payment Summary</h2>

      <p>
        <strong>Total Challans:</strong> {challans.length}
      </p>

      <p>
        <strong>Total Amount:</strong> ₹{totalAmount}
      </p>

      <p>
        <strong>Total Paid:</strong> ₹{totalPaid}
      </p>

      <p>
        <strong>Total Remaining:</strong> ₹{totalRemaining}
      </p>

      <hr />

      <h2>Party Challans</h2>

      {challans.length === 0 ? (
        <p>No challans found for this party.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Challan No</th>
              <th>Challan Date</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Overdue</th>
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
                  <td>{challan.challanNo}</td>
                  <td>{formatDate(challan.challanDate)}</td>
                  <td>₹{challan.amount}</td>
                  <td>₹{challan.paidAmount || 0}</td>
                  <td>₹{remaining}</td>
                  <td>{formatDate(challan.dueDate)}</td>
                  <td>{challan.status}</td>
                  <td>{overdue ? "Yes" : "No"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PartyDetails;
