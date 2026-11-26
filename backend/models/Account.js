import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    account_number: {
      type: String,
      required: true,
      unique: true,
    },

    account_type: {
      type: String,
      default: "Savings",
    },

    balance: {
      type: Number,
      default: 100000,
    },

    status: {
      type: String,
      enum: ["active", "frozen"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;