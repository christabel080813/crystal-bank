import { useEffect, useState } from "react";

function AdminDashboard() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getAccounts = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/accounts/admin/accounts`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to load accounts.");
                setLoading(false);
                return;
            }

            setAccounts(data.accounts);
        } catch (error) {
            setError("Unable to connect to the server.");
        }

        setLoading(false);
    };

    useEffect(() => {
        getAccounts();
    }, []);

    const updateAccountStatus = async (id, action) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/accounts/admin/accounts/${id}/${action}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to update account.");
                return;
            }

            getAccounts();

        } catch (error) {
            setError("Unable to connect to the server.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white px-4 sm:px-6 py-8">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-2">
                    Crystal<span className="text-red-600">Bank</span> Admin
                </h1>

                <p className="text-gray-400 mb-8">
                    Manage customer accounts
                </p>

                {loading && (
                    <p className="text-gray-400">
                        Loading accounts...
                    </p>
                )}

                {error && (
                    <p className="text-red-500 mb-4">
                        {error}
                    </p>
                )}

                <div className="space-y-4">

                    {accounts.map((account) => (
                        <div
                            key={account._id}
                            className="bg-[#111111] border border-gray-800 rounded-2xl p-5"
                        >

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                                <div>

                                    <h2 className="font-semibold text-lg">
                                        {account.user_id?.full_name}
                                    </h2>

                                    <p className="text-gray-400 text-sm">
                                        {account.user_id?.email}
                                    </p>

                                    <p className="text-gray-500 text-sm mt-2">
                                        Account: {account.account_number}
                                    </p>

                                    <p className="mt-2">
                                        Balance: ₦{account.balance.toLocaleString()}
                                    </p>

                                    <p className="text-sm mt-2">
                                        Status:{" "}
                                        <span
                                            className={
                                                account.status === "frozen"
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }
                                        >
                                            {account.status}
                                        </span>
                                    </p>

                                </div>

                                <div>

                                    {account.status === "frozen" ? (
                                        <button
                                            onClick={() =>
                                                updateAccountStatus(account._id, "unfreeze")
                                            }
                                            className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg"
                                        >
                                            Unfreeze
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                updateAccountStatus(account._id, "freeze")
                                            }
                                            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg"
                                        >
                                            Freeze
                                        </button>
                                    )}

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;