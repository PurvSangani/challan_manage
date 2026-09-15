const mongoose = require("mongoose");

const partySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    whatsapp: {
      type: String,
      required: true,
      trim: true,
    },
    paymentDays: {
      type: Number,
      required: true,
      default: 30,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Party", partySchema);
