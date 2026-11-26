import Account from "../models/Account.js";

const getMyAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      user_id: req.user.userId,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.status(200).json({
      account: {
        account_number: account.account_number,
        account_type: account.account_type,
        balance: account.balance,
        status: account.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};



const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find()
      .populate("user_id", "full_name email phone role");

    res.status(200).json({
      accounts,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};


const freezeAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }

    account.status = "frozen";

    await account.save();

    res.status(200).json({
      message: "Account frozen successfully.",
      account,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};


const unfreezeAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }

    account.status = "active";

    await account.save();

    res.status(200).json({
      message: "Account unfrozen successfully.",
      account,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

export { getMyAccount, getAllAccounts, freezeAccount, unfreezeAccount };