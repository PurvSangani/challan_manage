import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditChallan = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        challanNo: "",
        challanDate: "",
        amount: "",
        paidAmount: 0
    });

    const [party, setParty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchChallan = async () => {
        try {
            const response = await fetch(
                `http://localhost:5001/api/challans/${id}`
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Challan not found");
                navigate("/challans");
                return;
            }

            setParty(data.party);

            setFormData({
                challanNo: data.challanNo || "",
                challanDate: data.challanDate
                    ? new Date(data.challanDate)
                        .toISOString()
                        .split("T")[0]
                    : "",
                amount: data.amount || "",
                paidAmount: data.paidAmount || 0
            });

            setLoading(false);

        } catch (error) {
            console.log("Error:", error);
            alert("Something went wrong");
            navigate("/challans");
        }
    };

    useEffect(() => {
        fetchChallan();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const remaining =
        Math.max(
            0,
            Number(formData.amount || 0) -
            Number(formData.paidAmount || 0)
        );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.challanNo.trim()) {
            alert("Enter challan number");
            return;
        }

        if (!formData.challanDate) {
            alert("Select challan date");
            return;
        }

        if (!formData.amount || Number(formData.amount) <= 0) {
            alert("Enter a valid amount");
            return;
        }

        if (Number(formData.paidAmount) > Number(formData.amount)) {
            alert(
                "Paid amount cannot be greater than challan amount"
            );
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(
                `http://localhost:5001/api/challans/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        challanNo: formData.challanNo,
                        challanDate: formData.challanDate,
                        amount: Number(formData.amount),
                        paidAmount: Number(formData.paidAmount)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Update failed");
                return;
            }

            alert("Challan updated successfully");

            navigate(`/challans/${id}`);

        } catch (error) {
            console.log("Error:", error);
            alert("Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-4">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold mb-1">
                        Edit Challan
                    </h2>

                    <p className="text-muted mb-0">
                        Update challan details
                    </p>
                </div>

                <button
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        navigate(`/challans/${id}`)
                    }
                >
                    Back
                </button>

            </div>

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    {/* Party Information */}

                    <div className="mb-4">

                        <h5 className="fw-bold">
                            Party Information
                        </h5>

                        <div className="p-3 bg-light rounded">

                            <strong>
                                {party?.name || "—"}
                            </strong>

                            <br />

                            <span className="text-muted">
                                WhatsApp:{" "}
                                {party?.whatsapp || "—"}
                            </span>

                        </div>

                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* Challan Number */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Challan Number
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="challanNo"
                                value={formData.challanNo}
                                onChange={handleChange}
                            />

                        </div>

                        {/* Challan Date */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Challan Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                name="challanDate"
                                value={formData.challanDate}
                                onChange={handleChange}
                            />

                        </div>

                        {/* Amount */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Challan Amount
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                min="0"
                            />

                        </div>

                        {/* Paid Amount */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Paid Amount
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                name="paidAmount"
                                value={formData.paidAmount}
                                onChange={handleChange}
                                min="0"
                            />

                        </div>

                        {/* Remaining */}

                        <div className="alert alert-light border">

                            <strong>
                                Remaining Amount:
                            </strong>{" "}
                            ₹{remaining}

                        </div>

                        {/* Buttons */}

                        <div className="d-flex gap-2">

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving
                                    ? "Updating..."
                                    : "Update Challan"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate(`/challans/${id}`)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default EditChallan;