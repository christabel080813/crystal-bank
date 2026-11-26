import { useEffect, useState } from "react";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/transactions/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Unable to load transactions.");
                    setLoading(false);
                    return;
                }

                setTransactions(data.transactions);
            } catch (error) {
                setError("Unable to connect to the server.");
            }

            setLoading(false);
        };

        getTransactions();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white px-4 sm:px-6 py-8">

            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold mb-8">
                    Transaction History
                </h1>

                {loading && (
                    <p className="text-gray-400">
                        Loading transactions...
                    </p>
                )}

                {error && (
                    <p className="text-red-500">
                        {error}
                    </p>
                )}

                {!loading && !error && transactions.length === 0 && (
                    <p className="text-gray-500">
                        No transactions yet.
                    </p>
                )}

                <div className="space-y-4">

                    {transactions.map((transaction) => {

                        const moneyIn =
                            transaction.type === "deposit" ||
                            transaction.direction === "received";

                        return (
                            <div
                                key={transaction._id}
                                className="bg-[#111111] border border-gray-800 rounded-2xl p-5"
                            >

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                    <div>
                                        <h2 className="font-semibold capitalize">
                                            {transaction.type}
                                        </h2>

                                        <p className="text-gray-500 text-sm mt-1">
                                            {new Date(transaction.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="text-left sm:text-right">

                                        <p
                                            className={
                                                moneyIn
                                                    ? "text-green-500 font-semibold text-lg"
                                                    : "text-red-500 font-semibold text-lg"
                                            }
                                        >
                                            {moneyIn ? "+" : "-"}₦
                                            {transaction.amount.toLocaleString()}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            Balance after: ₦
                                            {transaction.balance_after.toLocaleString()}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>

        </div>
    );
}

export default Transactions;