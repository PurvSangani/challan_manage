const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const partyRoutes = require("./routes/partyRoutes");
const challanRoutes = require("./routes/challanRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
require("dotenv").config();

const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/parties", partyRoutes);
app.use("/api/challans", challanRoutes);
app.use("/api/payments", paymentRoutes);
app.get("/", (req, res) => {
  res.send("Challan App Backend Running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });
