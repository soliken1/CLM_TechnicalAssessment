import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const API_URL = "http://34.132.80.69:8000/api/entries";
const PAGE_SIZE = 5;

function App() {
    const [formData, setFormData] = useState({ first_name: "", last_name: "" });
    const [entries, setEntries] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const res = await axios.get(API_URL);
            setEntries(res.data.reverse());
        } catch (err) {
            toast.error("Failed to fetch entries");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, formData);
                toast.success("Entry updated!");
            } else {
                await axios.post(API_URL, formData);
                toast.success("Entry added!");
            }
            setFormData({ first_name: "", last_name: "" });
            setEditingId(null);
            fetchEntries();
        } catch (err) {
            toast.error("Failed to save entry");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (entry) => {
        setFormData({
            first_name: entry.first_name,
            last_name: entry.last_name,
        });
        setEditingId(entry.id);
    };

    const handleDelete = async (id) => {
        toast((t) => (
            <span>
                Confirm delete?
                <div className="mt-2 flex gap-2">
                    <button
                        className="bg-red-600 text-white px-2 py-1 rounded"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await axios.delete(`${API_URL}/${id}`);
                                toast.success("Entry deleted!");
                                fetchEntries();
                            } catch {
                                toast.error("Failed to delete entry");
                            }
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="bg-gray-300 text-black px-2 py-1 rounded"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        No
                    </button>
                </div>
            </span>
        ));
    };

    const paginatedEntries = entries.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const totalPages = Math.ceil(entries.length / PAGE_SIZE);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Toaster position="top-right" />
            <div className="max-w-xl mx-auto space-y-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-2xl font-bold text-center mb-4">
                        {editingId ? "Edit Entry" : "Name Entry Form"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                        />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                        />
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                    ? "Update"
                                    : "Submit"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({
                                            first_name: "",
                                            last_name: "",
                                        });
                                        setEditingId(null);
                                    }}
                                    className="text-sm text-gray-500 hover:underline"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Entries</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border border-gray-200">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-3 border">#</th>
                                    <th className="p-3 border">First Name</th>
                                    <th className="p-3 border">Last Name</th>
                                    <th className="p-3 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedEntries.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center p-4"
                                        >
                                            No entries found.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedEntries.map((entry, idx) => (
                                        <tr
                                            key={entry.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="p-3 border">
                                                {(currentPage - 1) * PAGE_SIZE +
                                                    idx +
                                                    1}
                                            </td>
                                            <td className="p-3 border">
                                                {entry.first_name}
                                            </td>
                                            <td className="p-3 border">
                                                {entry.last_name}
                                            </td>
                                            <td className="p-3 border space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(entry)
                                                    }
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(entry.id)
                                                    }
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4 space-x-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 border rounded ${
                                        currentPage === i + 1
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-700"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
