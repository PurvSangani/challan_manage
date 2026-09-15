import { useEffect, useState } from "react";

const PaymentSection = ({ challan, onPaymentAdded }) => {
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState("");

  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const remaining =
    Number(challan.amount || 0) - Number(challan.paidAmount || 0);

  // Get payment history
  const fetchPayments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/payments/challan/${challan._id}`,
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      setPayments(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [challan._id]);

  // Add payment
  const handlePayment = async (e) => {
    e.preventDefault();

    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      alert("Enter a valid payment amount");
      return;
    }

    if (paymentAmount > remaining) {
      alert("Payment cannot be greater than remaining amount");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/payments", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          challan: challan._id,
          amount: paymentAmount,
          paymentDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Payment added successfully");

      // Clear payment amount
      setAmount("");

      // Refresh payment history
      await fetchPayments();

      // Refresh challan
      onPaymentAdded();
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Payment</h2>

      <p>
        <strong>Challan Amount:</strong> ₹{challan.amount}
      </p>

      <p>
        <strong>Paid:</strong> ₹{challan.paidAmount || 0}
      </p>

      <p>
        <strong>Remaining:</strong> ₹{remaining}
      </p>

      {/* Add Payment Form */}

      {remaining > 0 ? (
        <form onSubmit={handlePayment}>
          <div>
            <label>Payment Amount</label>

            <br />

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max={remaining}
              placeholder="Enter payment"
              required
            />
          </div>

          <br />

          <div>
            <label>Payment Date</label>

            <br />

            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </div>

          <br />

          <button type="submit">Add Payment</button>
        </form>
      ) : (
        <p>
          <strong>Fully Paid</strong>
        </p>
      )}

      <hr />

      {/* Payment History */}

      <h2>Payment History</h2>

      {payments.length === 0 ? (
        <p>No payments yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Payment Date</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>
                  {new Date(payment.paymentDate).toLocaleDateString("en-IN")}
                </td>

                <td>₹{payment.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentSection;
