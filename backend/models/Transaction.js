import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    type: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer"],
      required: true,
    },

    direction: {
      type: String,
      enum: ["sent", "received"],
    },

    amount: {
      type: Number,
      required: true,
    },

    balance_after: {
      type: Number,
      required: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;