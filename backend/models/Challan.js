const mongoose = require("mongoose");

const challanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    challanNo: {
      type: String,
      required: true,
      trim: true,
    },

    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: true,
    },

    challanDate: {
      type: Date,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure challanNo is unique per user
challanSchema.index({ user: 1, challanNo: 1 }, { unique: true });

module.exports = mongoose.model("Challan", challanSchema);
