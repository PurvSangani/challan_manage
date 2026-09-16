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
        `${import.meta.env.VITE_API_URL}/api/payments/challan/${challan._id}`,
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
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
    <div className="mt-4">
      {/* Add Payment Card */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-bottom py-3">
          <h5 className="card-title fw-semibold mb-0 text-dark">
            <i className="bi bi-credit-card me-2"></i>Record New Payment
          </h5>
        </div>
        <div className="card-body p-4">
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="p-3 bg-light rounded border text-center">
                <span className="text-muted small text-uppercase fw-semibold d-block">Challan Amount</span>
                <span className="fs-5 fw-bold text-dark">₹{challan.amount}</span>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-3 bg-light rounded border text-center">
                <span className="text-muted small text-uppercase fw-semibold d-block">Total Paid</span>
                <span className="fs-5 fw-bold text-success">₹{challan.paidAmount || 0}</span>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-3 bg-light rounded border text-center">
                <span className="text-muted small text-uppercase fw-semibold d-block">Balance Remaining</span>
                <span className="fs-5 fw-bold text-dark">₹{remaining}</span>
              </div>
            </div>
          </div>

          {remaining > 0 ? (
            <form onSubmit={handlePayment}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-dark">Payment Amount (₹)</label>

                  {remaining > 0 && (
                    <button
                      type="button"
                      className="btn btn-success btn-sm mt-2"
                      onClick={() => setAmount(remaining)}
                    >
                      Pay Full ₹{remaining}
                    </button>
                  )}

                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    max={remaining}
                    placeholder={`Max ₹${remaining}`}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-dark">Payment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-3 text-end">
                <button type="submit" className="btn btn-primary px-4 fw-semibold">
                  <i className="bi bi-check-lg me-1"></i> Submit Payment
                </button>
              </div>
            </form>
          ) : (
            <div className="alert alert-success border-0 bg-success-subtle text-success-emphasis text-center fw-bold mb-0">
              <i className="bi bi-check-circle-fill me-2"></i> This challan is fully paid.
            </div>
          )}
        </div>
      </div>

      {/* Payment History Card */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom py-3">
          <h5 className="card-title fw-semibold mb-0 text-dark">
            <i className="bi bi-clock-history me-2"></i>Payment History
          </h5>
        </div>
        <div className="card-body p-0">
          {payments.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <i className="bi bi-receipt fs-2 d-block mb-2 text-secondary"></i>
              No payment transactions recorded yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Payment Date</th>
                    <th>Amount Paid</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        <i className="bi bi-calendar-event me-2 text-muted"></i>
                        {new Date(payment.paymentDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="fw-bold text-success">₹{payment.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
