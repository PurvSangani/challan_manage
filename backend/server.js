const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const partyRoutes = require("./routes/partyRoutes");
const challanRoutes = require("./routes/challanRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/parties", partyRoutes);
app.use("/api/challans", challanRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Challan App Backend Running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    // Drop legacy global index on challanNo if it exists so user-scoped index works
    try {
      await mongoose.connection.collection("challans").dropIndex("challanNo_1");
      console.log("Legacy index challanNo_1 dropped successfully");
    } catch (err) {
      // Index did not exist or already dropped
    }

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });
