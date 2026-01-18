import { useState, useEffect } from "react";
import {
    FaTrash,
    FaUndo,
    FaCheckCircle,
    FaTimes,
    FaArrowUp,
    FaArrowDown,
    FaRegSave
} from "react-icons/fa";
import PageLayout from "../components/PageLayout";

interface DeletedItem {
    id: number;
    amount: number | string;
    description: string;
    date: string;
    category_name?: string;
    category_color?: string;
    category_icon?: string;
    item_type: 'income' | 'expense' | 'savings';
    deleted_at: string;
}

const RecycleBin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const fetchDeletedItems = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:3001/api/recycle-bin');
            if (!response.ok) throw new Error('Failed to fetch items');
            const data = await response.json();
            setDeletedItems(data);
        } catch (error) {
            console.error('Error:', error);
            setMessage({ text: 'Failed to load recycle bin items', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDeletedItems();
    }, []);

    const handleRestore = async (type: string, id: number) => {
        try {
            const response = await fetch(`http://localhost:3001/api/recycle-bin/restore/${type}/${id}`, {
                method: 'POST',
            });
            if (response.ok) {
                setMessage({ text: 'Item restored successfully', type: 'success' });
                fetchDeletedItems();
            } else {
                setMessage({ text: 'Failed to restore item', type: 'error' });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage({ text: 'Failed to restore item', type: 'error' });
        }
    };

    const handlePurge = async (type: string, id: number) => {
        if (!window.confirm('Are you sure you want to permanently delete this item? This action cannot be undone.')) return;

        try {
            const response = await fetch(`http://localhost:3001/api/recycle-bin/purge/${type}/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessage({ text: 'Item permanently deleted', type: 'success' });
                fetchDeletedItems();
            } else {
                setMessage({ text: 'Failed to purge item', type: 'error' });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage({ text: 'Failed to purge item', type: 'error' });
        }
    };

    return (
        <PageLayout
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title="Recycle Bin"
            subtitle="Restore or permanently delete your recently removed items"
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {message && (
                    <div className={`p-4 rounded-xl shadow-lg border-2 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                        {message.type === 'success' ? <FaCheckCircle className="text-xl" /> : <FaTrash className="text-xl" />}
                        <span className="font-bold">{message.text}</span>
                        <button onClick={() => setMessage(null)} className="ml-auto hover:scale-110 transition-transform">
                            <FaTimes />
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin shadow-xl"></div>
                        <p className="text-gray-500 font-bold animate-pulse">Loading deleted items...</p>
                    </div>
                ) : deletedItems.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-dashed border-gray-200 p-20 text-center shadow-xl">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <FaTrash className="text-4xl text-blue-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Recycle Bin is Empty</h2>
                        <p className="text-gray-500 max-w-md mx-auto">Items you delete will appear here for 30 days before being permanently removed.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deletedItems.map((item) => (
                            <div key={`${item.item_type}-${item.id}`} className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white hover:shadow-2xl transition-all hover:scale-[1.02] group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl -z-10 group-hover:from-blue-400/20 group-hover:to-purple-400/20 transition-all"></div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20">
                                            {item.item_type === 'income' ? <FaArrowUp /> : item.item_type === 'expense' ? <FaArrowDown /> : <FaRegSave />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 capitalize">{item.item_type}</h3>
                                            <p className="text-xs text-gray-500">{new Date(item.deleted_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm ${item.item_type === 'income' ? 'bg-green-100 text-green-700' :
                                            item.item_type === 'expense' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                        {Number(item.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </div>
                                </div>

                                <p className="text-gray-600 font-medium mb-6 line-clamp-2 min-h-[3rem]">{item.description || 'No description provided'}</p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleRestore(item.item_type, item.id)}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        <FaUndo className="group-hover/btn:rotate-[-45deg] transition-transform" />
                                        Restore
                                    </button>
                                    <button
                                        onClick={() => handlePurge(item.item_type, item.id)}
                                        className="px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-colors border border-red-100 hover:scale-105"
                                        title="Permanently Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default RecycleBin;
