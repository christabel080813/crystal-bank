import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [receipt, setReceipt] = useState(null);

    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [amount, setAmount] = useState("");
    const [depositMessage, setDepositMessage] = useState("");
    const [depositLoading, setDepositLoading] = useState(false);
    const [activeAction, setActiveAction] = useState("");

    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawMessage, setWithdrawMessage] = useState("");
    const [withdrawLoading, setWithdrawLoading] = useState(false);

    const [destinationAccount, setDestinationAccount] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [transferMessage, setTransferMessage] = useState("");
    const [transferLoading, setTransferLoading] = useState(false);

    const [transactions, setTransactions] = useState([]);
    const [transactionLoading, setTransactionLoading] = useState(true);



    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);


    useEffect(() => {
        const getAccount = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/accounts/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Unable to load account.");
                    setLoading(false);
                    return;
                }

                setAccount(data.account);
            } catch (error) {
                setError("Unable to connect to the server.");
            }

            setLoading(false);
        };

        getAccount();
    }, []);



    const getTransactions = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/transactions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to load transactions.");
                setTransactionLoading(false);
                return;
            }

            setTransactions(data.transactions);

        } catch (error) {
            setError("Unable to connect to the server.");
        }

        setTransactionLoading(false);
    };

    useEffect(() => {
        getTransactions();
    }, []);


    const handleDeposit = async () => {
        setDepositMessage("");
        setError("");

        if (!amount || Number(amount) <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        setDepositLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/transactions/deposit`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        amount: Number(amount),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Deposit failed.");
                setDepositLoading(false);
                return;
            }

            setAccount({
                ...account,
                balance: data.balance,
            });

            setDepositMessage("Deposit successful!");

            setReceipt({
                type: "Deposit",
                amount: Number(amount),
                account: account.account_number,
            });

            setAmount("");
            getTransactions();
        } catch (error) {
            setError("Unable to connect to the server.");
        }

        setDepositLoading(false);
    };


    const handleWithdraw = async () => {
        setWithdrawMessage("");
        setError("");

        if (!withdrawAmount || Number(withdrawAmount) <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        setWithdrawLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/transactions/withdraw`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        amount: Number(withdrawAmount),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Withdrawal failed.");
                setWithdrawLoading(false);
                return;
            }

            setAccount({
                ...account,
                balance: data.balance,
            });

            setWithdrawMessage("Withdrawal successful!");

            setReceipt({
                type: "Withdrawal",
                amount: Number(withdrawAmount),
                account: account.account_number,
            });

            setWithdrawAmount("");
            getTransactions();
        } catch (error) {
            setError("Unable to connect to the server.");
        }

        setWithdrawLoading(false);
    };


    const handleTransfer = async () => {
        setTransferMessage("");
        setError("");

        if (!destinationAccount || !transferAmount || Number(transferAmount) <= 0) {
            setError("Enter a destination account and valid amount.");
            return;
        }

        setTransferLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/transactions/transfer`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        destinationAccountNumber: destinationAccount,
                        amount: Number(transferAmount),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Transfer failed.");
                setTransferLoading(false);
                return;
            }

            setAccount({
                ...account,
                balance: data.balance,
            });

            setTransferMessage("Transfer successful!");

            setReceipt({
                type: "Transfer",
                amount: Number(transferAmount),
                account: destinationAccount,
            });

            setDestinationAccount("");
            setTransferAmount("");
            getTransactions();
        } catch (error) {
            setError("Unable to connect to the server.");
        }

        setTransferLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-8">

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Crystal<span className="text-red-600">Bank</span>
                        </h1>

                        <p className="text-gray-400 mt-2">
                            Welcome, {user?.full_name || "Customer"}
                        </p>
                    </div>

                </div>

                {/* Balance */}
                {loading ? (
                    <p className="text-gray-400">Loading account...</p>
                ) : (
                    <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 mb-6">

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

                            {/* Balance Information */}
                            <div>
                                <p className="text-gray-400 text-sm">
                                    Available Balance
                                </p>

                                <h2 className="text-4xl md:text-5xl font-bold mt-3">
                                    ₦{account.balance.toLocaleString()}
                                </h2>

                                <p className="text-gray-500 mt-4">
                                    Account Number: {account.account_number}
                                </p>
                            </div>

                                {/* Account Actions */}
                                <div className="flex flex-col sm:flex-row gap-3">

                                    <button
                                        onClick={() => navigate("/transactions")}
                                        className="border border-gray-700 hover:border-red-600 px-5 py-3 rounded-lg transition"
                                    >
                                        Transaction History →
                                    </button>

                                    <button
                                        onClick={() => navigate("/statement")}
                                        className="border border-gray-700 hover:border-red-600 px-5 py-3 rounded-lg transition"
                                    >
                                        Print Statement →
                                    </button>

                                </div>

                        </div>

                    </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                    <button
                        onClick={() => setActiveAction("deposit")}
                        className="bg-red-600 hover:bg-red-700 py-3 rounded-lg"
                    >
                        Deposit
                    </button>

                    <button
                        onClick={() => setActiveAction("withdraw")}
                        className="border border-gray-700 hover:border-red-600 py-3 rounded-lg"
                    >
                        Withdraw
                    </button>

                    <button
                        onClick={() => setActiveAction("transfer")}
                        className="border border-gray-700 hover:border-red-600 py-3 rounded-lg"
                    >
                        Transfer
                    </button>

                </div>


                {activeAction === "deposit" && (
                    <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 mb-8">

                        <h2 className="text-xl font-semibold mb-4">
                            Make a Deposit
                        </h2>

                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                        />

                        <button
                            onClick={handleDeposit}
                            disabled={depositLoading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 py-3 rounded-lg mt-4"
                        >
                            {depositLoading ? "Processing..." : "Deposit Money"}
                        </button>

                        {depositMessage && (
                            <p className="text-green-500 mt-4">
                                {depositMessage}
                            </p>
                        )}

                        {error && (
                            <p className="text-red-500 mt-4">
                                {error}
                            </p>
                        )}

                    </div>
                )}


                {activeAction === "withdraw" && (
                    <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 mb-8">

                        <h2 className="text-xl font-semibold mb-4">
                            Make a Withdrawal
                        </h2>

                        <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                        />

                        <button
                            onClick={handleWithdraw}
                            disabled={withdrawLoading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 py-3 rounded-lg mt-4"
                        >
                            {withdrawLoading ? "Processing..." : "Withdraw Money"}
                        </button>

                        {withdrawMessage && (
                            <p className="text-green-500 mt-4">
                                {withdrawMessage}
                            </p>
                        )}

                        {error && (
                            <p className="text-red-500 mt-4">
                                {error}
                            </p>
                        )}

                    </div>
                )}


                {activeAction === "transfer" && (
                    <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 mb-8">

                        <h2 className="text-xl font-semibold mb-4">
                            Transfer Money
                        </h2>

                        <input
                            type="text"
                            value={destinationAccount}
                            onChange={(e) => setDestinationAccount(e.target.value)}
                            placeholder="Destination account number"
                            className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600 mb-4"
                        />

                        <input
                            type="number"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                        />

                        <button
                            onClick={handleTransfer}
                            disabled={transferLoading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 py-3 rounded-lg mt-4"
                        >
                            {transferLoading ? "Processing..." : "Transfer Money"}
                        </button>

                        {transferMessage && (
                            <p className="text-green-500 mt-4">
                                {transferMessage}
                            </p>
                        )}

                        {error && (
                            <p className="text-red-500 mt-4">
                                {error}
                            </p>
                        )}

                    </div>
                )}


                {/* Transactions */}
                <div className="mt-6 space-y-3">

                    <h3 className="text-center text-2xl sm:text-3xl font-bold text-red-500 mb-6">
                        Recent Transactions
                    </h3>

                    {transactionLoading ? (
                        <p className="text-gray-500">
                            Loading transactions...
                        </p>
                    ) : transactions.length === 0 ? (
                        <div className="border border-gray-800 rounded-xl p-6 text-center">
                            <p className="text-gray-500">
                                No transactions yet.
                            </p>
                        </div>
                    ) : (
                        transactions.map((transaction) => (
                            <div
                                key={transaction._id}
                                className="border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >

                                <div>
                                    <p className="font-semibold capitalize">
                                        {transaction.type}
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        {new Date(transaction.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <div className="text-left md:text-right">
                                    <p
                                        className={
                                            transaction.type === "deposit" ||
                                                transaction.direction === "received"
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }
                                    >
                                        {transaction.type === "deposit" && "+"}
                                        {transaction.type === "transfer" && transaction.direction === "received" && "+"}
                                        {transaction.type === "withdrawal" && "-"}
                                        {transaction.type === "transfer" && transaction.direction === "sent" && "-"}
                                        ₦{transaction.amount.toLocaleString()}
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        Balance after: ₦
                                        {Number(transaction.balance_after).toLocaleString()}
                                    </p>
                                </div>

                            </div>
                        ))
                    )}

                </div>

            </div>


            {receipt && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50">

                    <div className="bg-[#111111] border border-gray-700 rounded-2xl p-6 w-full max-w-md relative">

                        {/* Close button */}
                        <button
                            onClick={() => setReceipt(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                        >
                            ×
                        </button>

                        <div className="text-center mb-6">

                            <h2 className="text-2xl font-bold">
                                Crystal<span className="text-red-600">Bank</span>
                            </h2>

                            <p className="text-green-500 mt-2">
                                Transaction Successful
                            </p>

                        </div>

                        <div className="border-t border-gray-800 pt-5 space-y-4">

                            <div className="flex justify-between">
                                <span className="text-gray-400">
                                    Transaction
                                </span>

                                <span className="capitalize">
                                    {receipt.type}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-400">
                                    Amount
                                </span>

                                <span className="font-semibold">
                                    ₦{receipt.amount.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-400">
                                    Account
                                </span>

                                <span>
                                    {receipt.account}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-400">
                                    Date
                                </span>

                                <span>
                                    {new Date().toLocaleString()}
                                </span>
                            </div>

                        </div>

                        <button
                            onClick={() => setReceipt(null)}
                            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg mt-6"
                        >
                            Done
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Dashboard;