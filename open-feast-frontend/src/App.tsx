import { useEffect, useState } from 'react';
import axios from 'axios';
import type { FoodSpot } from './types';
import PostFoodForm from './components/PostFoodForm';
import { 
    MapPin, 
    Clock, 
    Navigation, 
    AlertCircle, 
    Loader2, 
    UtensilsCrossed,
    ThumbsDown,
    Sparkles
} from 'lucide-react';

function App() {
    const [spots, setSpots] = useState<FoodSpot[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const fetchSpots = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await axios.get('http://localhost:8080/api/food-spots');
            setSpots(res.data);
        } catch (err: unknown) {
            console.error("Fetch Error:", err);
            setError('Failed to load spots. Is the Backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handleVoteFinished = async (id: number) => {
        try {
            await axios.post(`http://localhost:8080/api/food-spots/${id}/vote-finished`);
            alert("Vote Registered!");
            fetchSpots();
        } catch {
            alert("Error voting. You might be offline.");
        }
    };

    useEffect(() => { fetchSpots(); }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-surface-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2.5 rounded-xl shadow-lg shadow-primary-500/25">
                                <UtensilsCrossed className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Open-Feast</h1>
                                <p className="text-sm text-surface-500 hidden sm:block">Share free food with your community</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-surface-500">
                            <Sparkles className="w-4 h-4 text-primary-500" />
                            <span className="hidden sm:inline">{spots.filter(s => s.status === 'ACTIVE').length} active spots</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Post Form Section */}
                <section className="mb-12">
                    <div className="max-w-2xl mx-auto">
                        <PostFoodForm onPostSuccess={fetchSpots} />
                    </div>
                </section>

                {/* Error Alert */}
                {error && (
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-800">Connection Error</h3>
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Food Spots Grid */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-surface-900">Available Food Spots</h2>
                        <button 
                            onClick={fetchSpots}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1.5 transition-colors"
                        >
                            <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
                            <p className="text-surface-500">Loading food spots...</p>
                        </div>
                    )}

                    {!loading && spots.length === 0 && !error && (
                        <div className="card p-12 text-center">
                            <div className="bg-surface-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UtensilsCrossed className="w-8 h-8 text-surface-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-surface-800 mb-2">No food spots yet</h3>
                            <p className="text-surface-500 mb-4">Be the first to share free food in your area!</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {spots.map(spot => (
                            <article 
                                key={spot.id} 
                                className={`card card-hover ${spot.status === 'FINISHED' ? 'opacity-60' : ''}`}
                            >
                                {/* Image */}
                                <div className="aspect-video bg-surface-100 relative overflow-hidden">
                                    {spot.imageUrl ? (
                                        <img 
                                            src={spot.imageUrl} 
                                            alt={spot.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <UtensilsCrossed className="w-12 h-12 text-surface-300" />
                                        </div>
                                    )}
                                    
                                    {/* Time Badge */}
                                    <div className="absolute top-3 right-3 bg-surface-900/80 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        {new Date(spot.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`absolute top-3 left-3 text-xs px-2.5 py-1.5 rounded-lg font-semibold ${
                                        spot.status === 'ACTIVE' 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-surface-500 text-white'
                                    }`}>
                                        {spot.status}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-surface-900 mb-2 line-clamp-1">{spot.title}</h3>
                                    <p className="text-surface-600 text-sm mb-4 line-clamp-2">{spot.description || 'No description provided'}</p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-primary flex-1"
                                        >
                                            <Navigation className="w-4 h-4" />
                                            Navigate
                                        </a>

                                        {spot.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => handleVoteFinished(spot.id)}
                                                className="btn bg-surface-100 text-surface-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                title="Report as empty"
                                            >
                                                <ThumbsDown className="w-4 h-4" />
                                                <span className="text-xs">{spot.verificationCount}/3</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Location hint */}
                                    <div className="mt-3 pt-3 border-t border-surface-100 flex items-center gap-1.5 text-xs text-surface-400">
                                        <MapPin className="w-3 h-3" />
                                        <span>Lat: {spot.latitude.toFixed(4)}, Lng: {spot.longitude.toFixed(4)}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-surface-50 border-t border-surface-100 mt-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-surface-500 text-sm">
                        <p className="flex items-center justify-center gap-2">
                            <UtensilsCrossed className="w-4 h-4 text-primary-500" />
                            <span>Open-Feast — Fighting food waste, one share at a time</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;