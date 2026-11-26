import { useEffect, useState } from "react";

function Statement() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/transactions/all",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Unable to load statement.");
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

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <h1 className="text-3xl font-bold">
                        Statement of Account
                    </h1>

                    <button
                        onClick={() => window.print()}
                        className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg"
                    >
                        Print Statement
                    </button>

                </div>

                {loading && (
                    <p className="text-gray-400">
                        Loading statement...
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

                {!loading && !error && transactions.length > 0 && (
                    <div className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden">

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="border-b border-gray-800">
                                    <tr className="text-left text-gray-400">
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Transaction</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Balance</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {transactions.map((transaction) => {

                                        const moneyIn =
                                            transaction.type === "deposit" ||
                                            transaction.direction === "received";

                                        return (
                                            <tr
                                                key={transaction._id}
                                                className="border-b border-gray-800"
                                            >

                                                <td className="p-4 text-gray-400">
                                                    {new Date(
                                                        transaction.createdAt
                                                    ).toLocaleString()}
                                                </td>

                                                <td className="p-4 capitalize">
                                                    {transaction.type}
                                                </td>

                                                <td
                                                    className={`p-4 font-semibold ${moneyIn
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                        }`}
                                                >
                                                    {moneyIn ? "+" : "-"}₦
                                                    {transaction.amount.toLocaleString()}
                                                </td>

                                                <td className="p-4 text-gray-400">
                                                    ₦
                                                    {transaction.balance_after.toLocaleString()}
                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Statement;