import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import generateReference from "../utils/generateReference.js";

const deposit = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Enter a valid deposit amount.",
      });
    }

    const account = await Account.findOne({
      user_id: req.user.userId,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }

    if (account.status === "frozen") {
      return res.status(400).json({
        message: "Your account is frozen.",
      });
    }

    account.balance += Number(amount);

    await account.save();

    const transaction = await Transaction.create({
      account_id: account._id,
      type: "deposit",
      amount: Number(amount),
      balance_after: account.balance,
      reference: generateReference(),
    });

    res.status(201).json({
      message: "Deposit successful.",
      balance: account.balance,
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Enter a valid withdrawal amount.",
      });
    }

    const account = await Account.findOne({
      user_id: req.user.userId,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }

    if (account.status === "frozen") {
      return res.status(400).json({
        message: "Your account is frozen.",
      });
    }

    if (Number(amount) > account.balance) {
      return res.status(400).json({
        message: "Insufficient balance.",
      });
    }

    account.balance -= Number(amount);

    await account.save();

    const transaction = await Transaction.create({
      account_id: account._id,
      type: "withdrawal",
      amount: Number(amount),
      balance_after: account.balance,
      reference: generateReference(),
    });

    res.status(201).json({
      message: "Withdrawal successful.",
      balance: account.balance,
      transaction,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};


const transfer = async (req, res) => {
  try {
    const { destinationAccountNumber, amount } = req.body;

    if (!destinationAccountNumber || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Enter a destination account number and valid amount.",
      });
    }

    const sender = await Account.findOne({
      user_id: req.user.userId,
    });

    if (!sender) {
      return res.status(404).json({
        message: "Your account was not found.",
      });
    }

    if (sender.status === "frozen") {
      return res.status(400).json({
        message: "Your account is frozen.",
      });
    }

    if (Number(amount) > sender.balance) {
      return res.status(400).json({
        message: "Insufficient balance.",
      });
    }

    const receiver = await Account.findOne({
      account_number: destinationAccountNumber,
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Destination account not found.",
      });
    }

    if (receiver.status === "frozen") {
      return res.status(400).json({
        message: "Destination account is frozen.",
      });
    }

    if (sender._id.toString() === receiver._id.toString()) {
      return res.status(400).json({
        message: "You cannot transfer money to your own account.",
      });
    }

    sender.balance -= Number(amount);
    receiver.balance += Number(amount);

    await sender.save();
    await receiver.save();

    await Transaction.create({
      account_id: sender._id,
      type: "transfer",
      direction: "sent",
      amount: Number(amount),
      balance_after: sender.balance,
      reference: generateReference(),
    });

    await Transaction.create({
      account_id: receiver._id,
      type: "transfer",
      direction: "received",
      amount: Number(amount),
      balance_after: receiver.balance,
      reference: generateReference(),
    });

    res.status(201).json({
      message: "Transfer successful.",
      balance: sender.balance,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};



const getTransactions = async (req, res) => {
  try {
    const account = await Account.findOne({
      user_id: req.user.userId,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }

    const transactions = await Transaction.find({
      account_id: account._id,
    }).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      transactions,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};


const getAllTransactions = async (req, res) => {
  try {
    const account = await Account.findOne({
      user_id: req.user.userId,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }

    const transactions = await Transaction.find({
      account_id: account._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      transactions,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

export { deposit, withdraw, transfer, getTransactions, getAllTransactions};
