import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import PaymentSection from "../components/PaymentSection";

const ChallanDetails = () => {
  const { id } = useParams();

  const [challan, setChallan] = useState(null);

  const fetchChallan = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/challans/${id}`);

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
    return (
      <div className="container py-5 text-center text-muted">
        <div className="spinner-border text-dark mb-2" role="status"></div>
        <p>Loading challan details...</p>
      </div>
    );
  }

  const remaining =
    Number(challan.amount || 0) - Number(challan.paidAmount || 0);

  const getStatusBadge = (status) => {
    if (status === "Paid") return <span className="badge badge-status-paid">Paid</span>;
    if (status === "Partial") return <span className="badge badge-status-partial">Partial</span>;
    return <span className="badge badge-status-pending">Pending</span>;
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(challan.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const canSendWhatsApp =
    challan.status !== "Paid" &&
    dueDate <= today;
  const openWhatsApp = () => {
    const phone = challan.party?.whatsapp;

    if (!phone) {
      alert("WhatsApp number not available");
      return;
    }

    let cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }

    const remaining = Math.max(
      0,
      Number(challan.amount || 0) -
      Number(challan.paidAmount || 0)
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDateObj = new Date(challan.dueDate);
    dueDateObj.setHours(0, 0, 0, 0);

    let paymentMessage;

    if (dueDateObj < today) {
      paymentMessage = `Your payment is overdue. Please make the payment at the earliest.`;
    } else if (dueDateObj.getTime() === today.getTime()) {
      paymentMessage = `Your payment is due today. Please make the payment today.`;
    } else {
      paymentMessage = `Please make the payment by the due date.`;
    }

    const message = `Hello ${challan.party?.name || ""},

This is a reminder regarding Challan No. ${challan.challanNo}.

Challan Amount: ₹${challan.amount}
Paid Amount: ₹${challan.paidAmount || 0}
Remaining Amount: ₹${remaining}
Due Date: ${dueDateObj.toLocaleDateString("en-IN")}

${paymentMessage}

Thank you.`;

    const whatsappUrl =
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };
  return (
    <div className="container">
      {/* Back Link */}
      <Link to="/challans" className="btn btn-outline-secondary btn-sm mb-3">
        <i className="bi bi-arrow-left me-1"></i> Back to Challans
      </Link>

      {/* Detail Header Card */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <h4 className="fw-bold mb-0 text-dark">
              Challan #{challan.challanNo}
            </h4>
            {getStatusBadge(challan.status)}
          </div>
          <div>
            {canSendWhatsApp && (
              <button
                type="button"
                className="btn btn-whatsapp d-inline-flex align-items-center gap-2 fw-semibold px-3 py-2 shadow-sm"
                onClick={openWhatsApp}
              >
                <i className="bi bi-whatsapp fs-5"></i>
                <span>Send WhatsApp Reminder</span>
              </button>
            )}
          </div>
        </div>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-3">
              <span className="text-muted small text-uppercase d-block fw-semibold">Party Name</span>
              <strong className="fs-5 text-dark">{challan.party?.name || "—"}</strong>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <span className="text-muted small text-uppercase d-block fw-semibold">WhatsApp Contact</span>
              <span className="text-dark">
                <i className="bi bi-whatsapp text-success me-1"></i>
                {challan.party?.whatsapp || "—"}
              </span>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <span className="text-muted small text-uppercase d-block fw-semibold">Challan Date</span>
              <span className="text-dark">
                {new Date(challan.challanDate).toLocaleDateString("en-IN")}
              </span>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <span className="text-muted small text-uppercase d-block fw-semibold">Due Date</span>
              <span className="text-dark fw-medium">
                {new Date(challan.dueDate).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Payment Section */}
      <PaymentSection challan={challan} onPaymentAdded={fetchChallan} />
    </div>
  );
};

export default ChallanDetails;
