import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [challans, setChallans] = useState([]);

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

  // -------------------------
  // Amount calculations
  // -------------------------

  const totalChallans = challans.length;

  const totalAmount = challans.reduce(
    (total, challan) => total + Number(challan.amount || 0),
    0,
  );

  const paidAmount = challans.reduce(
    (total, challan) => total + Number(challan.paidAmount || 0),
    0,
  );

  const remainingAmount = totalAmount - paidAmount;

  // -------------------------
  // Status calculations
  // -------------------------

  const pendingChallans = challans.filter(
    (challan) => challan.status === "Pending",
  ).length;

  const partialChallans = challans.filter(
    (challan) => challan.status === "Partial",
  ).length;

  const paidChallans = challans.filter(
    (challan) => challan.status === "Paid",
  ).length;

  // -------------------------
  // Date helper
  // -------------------------

  const getDateOnly = (date) => {
    const newDate = new Date(date);

    newDate.setHours(0, 0, 0, 0);

    return newDate;
  };

  const today = getDateOnly(new Date());

  // -------------------------
  // Due Today
  // -------------------------

  const dueTodayChallans = challans.filter((challan) => {
    if (challan.status === "Paid") {
      return false;
    }

    const dueDate = getDateOnly(challan.dueDate);

    return dueDate.getTime() === today.getTime();
  });

  // -------------------------
  // Overdue
  // -------------------------

  const overdueChallans = challans.filter((challan) => {
    if (challan.status === "Paid") {
      return false;
    }

    const dueDate = getDateOnly(challan.dueDate);

    return dueDate < today;
  });

  // -------------------------
  // Upcoming
  // -------------------------

  const upcomingChallans = challans.filter((challan) => {
    if (challan.status === "Paid") {
      return false;
    }

    const dueDate = getDateOnly(challan.dueDate);

    return dueDate > today;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Challan Dashboard</h1>
      <p>Welcome to Challan & Payment Reminder App</p>
      <br />
      <button onClick={() => navigate("/add-challan")}>Add Challan</button>{" "}
      <button onClick={() => navigate("/challans")}>View All Challans</button>{" "}
      <button onClick={() => navigate("/parties")}>View Parties</button>
      <hr />
      <h2>Financial Overview</h2>
      <p>
        <strong>Total Challans:</strong> {totalChallans}
      </p>
      <p>
        <strong>Total Amount:</strong> ₹{totalAmount}
      </p>
      <p>
        <strong>Paid Amount:</strong> ₹{paidAmount}
      </p>
      <p>
        <strong>Remaining Amount:</strong> ₹{remainingAmount}
      </p>
      <hr />
      <h2>Payment Status</h2>
      <p>
        <strong>Pending:</strong> {pendingChallans}
      </p>
      <p>
        <strong>Partial:</strong> {partialChallans}
      </p>
      <p>
        <strong>Paid:</strong> {paidChallans}
      </p>
      <hr />
      <h2>Payment Reminders</h2>
      <p>
        <strong>Due Today:</strong> {dueTodayChallans.length}
      </p>
      <p>
        <strong>Overdue:</strong> {overdueChallans.length}
      </p>
      <p>
        <strong>Upcoming:</strong> {upcomingChallans.length}
      </p>
      <hr />
      {/* Due Today */}
      <h2>Due Today</h2>
      {dueTodayChallans.length === 0 ? (
        <p>No payments due today.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Challan</th>
              <th>Party</th>
              <th>Amount</th>
              <th>Remaining</th>
              <th>Due Date</th>
            </tr>
          </thead>

          <tbody>
            {dueTodayChallans.map((challan) => {
              const remaining =
                Number(challan.amount || 0) - Number(challan.paidAmount || 0);

              return (
                <tr key={challan._id}>
                  <td>{challan.challanNo}</td>

                  <td>{challan.party?.name}</td>

                  <td>₹{challan.amount}</td>

                  <td>₹{remaining}</td>

                  <td>{formatDate(challan.dueDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <br />
      {/* Overdue */}
      <h2>Overdue Payments</h2>
      {overdueChallans.length === 0 ? (
        <p>No overdue payments.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Challan</th>
              <th>Party</th>
              <th>Remaining</th>
              <th>Due Date</th>
            </tr>
          </thead>

          <tbody>
            {overdueChallans.map((challan) => {
              const remaining =
                Number(challan.amount || 0) - Number(challan.paidAmount || 0);

              return (
                <tr key={challan._id}>
                  <td>{challan.challanNo}</td>

                  <td>{challan.party?.name}</td>

                  <td>₹{remaining}</td>

                  <td>{formatDate(challan.dueDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
