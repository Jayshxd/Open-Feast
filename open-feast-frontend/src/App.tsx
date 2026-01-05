import { useEffect, useState } from 'react';
import axios from 'axios';
import type {FoodSpot} from './types';
import PostFoodForm from './components/PostFoodForm';

function App() {
    const [spots, setSpots] = useState<FoodSpot[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    // Function to fetch data from backend
    const fetchSpots = async () => {
        try {
            setLoading(true);
            setError('');
            console.log("Fetching from: http://localhost:8080/api/food-spots");

            const res = await axios.get('http://localhost:8080/api/food-spots');
            console.log("Data received:", res.data); // <--- CHECK THIS IN CONSOLE (F12)
            setSpots(res.data);
        } catch (err: any) {
            console.error("Fetch Error:", err);
            setError('Failed to load spots. Is the Backend running? Check Console (F12).');
        } finally {
            setLoading(false);
        }
    };

    const handleVoteFinished = async (id: number) => {
        try {
            await axios.post(`http://localhost:8080/api/food-spots/${id}/vote-finished`);
            alert("Vote Registered! ✅");
            fetchSpots(); // Refresh to see updated count
        } catch (e) {
            alert("Error voting. You might be offline.");
        }
    };

    // Run this once when page loads
    useEffect(() => { fetchSpots(); }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8"> {/* Dark Mode Background */}
            <h1 className="text-4xl font-bold text-center text-orange-500 mb-8">Open-Feast 🍔</h1>

            {/* 1. The Form */}
            <div className="max-w-2xl mx-auto mb-10 text-black">
                <PostFoodForm onPostSuccess={fetchSpots} />
            </div>

            {/* 2. Error Message (if any) */}
            {error && (
                <div className="max-w-4xl mx-auto bg-red-500 text-white p-4 rounded mb-6 text-center font-bold">
                    ⚠️ {error}
                </div>
            )}

            {/* 3. The List of Spots */}
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Available Food Spots</h2>

                {loading && <p className="text-center text-gray-400">Loading map data...</p>}

                {!loading && spots.length === 0 && !error && (
                    <div className="text-center p-10 bg-gray-800 rounded-xl">
                        <p className="text-xl">No food spots found yet. 🤷‍♂️</p>
                        <p className="text-gray-400">Be the first to share one above!</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {spots.map(spot => (
                        <div key={spot.id} className={`bg-white text-black rounded-xl shadow-lg overflow-hidden ${spot.status === 'FINISHED' ? 'opacity-50 grayscale' : ''}`}>

                            {/* Image */}
                            <div className="h-48 bg-gray-200 relative">
                                {spot.imageUrl ? (
                                    <img src={spot.imageUrl} alt={spot.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {new Date(spot.createdAt).toLocaleTimeString()}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold">{spot.title}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${spot.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {spot.status}
                    </span>
                                </div>
                                <p className="text-gray-600 mb-4 h-12 overflow-hidden">{spot.description}</p>

                                {/* ACTIONS */}
                                <div className="flex gap-2">
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 bg-blue-600 text-white text-center py-2 rounded font-bold hover:bg-blue-700 transition"
                                    >
                                        🗺️ Go
                                    </a>

                                    {spot.status === 'ACTIVE' && (
                                        <button
                                            onClick={() => handleVoteFinished(spot.id)}
                                            className="px-3 py-2 border-2 border-red-100 text-red-500 rounded hover:bg-red-50 font-bold transition"
                                        >
                                            Empty? ({spot.verificationCount}/3)
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

export default App;