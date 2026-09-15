import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PaymentSection from "../components/PaymentSection";

const ChallanDetails = () => {
  const { id } = useParams();

  const [challan, setChallan] = useState(null);

  const fetchChallan = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/challans/${id}`);

      const data = await response.json();

      setChallan(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchChallan();
  }, [id]);

  if (!challan) {
    return <p>Loading...</p>;
  }

  const remaining =
    Number(challan.amount || 0) - Number(challan.paidAmount || 0);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Challan Details</h1>

      <hr />

      <p>
        <strong>Challan No:</strong> {challan.challanNo}
      </p>

      <p>
        <strong>Party:</strong> {challan.party?.name}
      </p>

      <p>
        <strong>WhatsApp:</strong> {challan.party?.whatsapp}
      </p>

      <p>
        <strong>Challan Date:</strong>{" "}
        {new Date(challan.challanDate).toLocaleDateString("en-IN")}
      </p>

      <p>
        <strong>Amount:</strong> ₹{challan.amount}
      </p>

      <p>
        <strong>Paid:</strong> ₹{challan.paidAmount || 0}
      </p>

      <p>
        <strong>Remaining:</strong> ₹{remaining}
      </p>

      <p>
        <strong>Due Date:</strong>{" "}
        {new Date(challan.dueDate).toLocaleDateString("en-IN")}
      </p>

      <p>
        <strong>Status:</strong> {challan.status}
      </p>

      <hr />

      <PaymentSection challan={challan} onPaymentAdded={fetchChallan} />
    </div>
  );
};

export default ChallanDetails;
