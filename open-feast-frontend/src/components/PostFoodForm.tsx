import { useState } from 'react';
import axios from 'axios';

export default function PostFoodForm({ onPostSuccess }: { onPostSuccess: () => void }) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

    // 1. Get User Location
    const handleGetLocation = () => {
        if (!navigator.geolocation) return alert('Geolocation is not supported');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                alert("Location Locked! 📍");
            },
            () => alert("Unable to retrieve location")
        );
    };

    // 2. Submit to Backend
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location || !file) return alert("Please provide location and photo!");

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', desc);
        formData.append('image', file);
        // For this demo, we assume the user is AT the spot, so Target = Device
        formData.append('latitude', location.lat.toString());
        formData.append('longitude', location.lng.toString());
        formData.append('deviceLatitude', location.lat.toString());
        formData.append('deviceLongitude', location.lng.toString());

        try {
            await axios.post('http://localhost:8080/api/food-spots', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Food Spot Shared! 🍕');
            setTitle(''); setDesc(''); setFile(null); setLocation(null);
            onPostSuccess(); // Refresh the list
        } catch (error) {
            console.error(error);
            alert('Failed to post. Are you within 100m?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4">Share Free Food</h2>

            <input
                type="text" placeholder="Title (e.g., Free Pizza)"
                className="w-full p-2 border mb-2 rounded"
                value={title} onChange={e => setTitle(e.target.value)} required
            />

            <textarea
                placeholder="Description"
                className="w-full p-2 border mb-2 rounded"
                value={desc} onChange={e => setDesc(e.target.value)}
            />

            <div className="mb-4">
                <button type="button" onClick={handleGetLocation}
                        className={`w-full p-2 rounded text-white ${location ? 'bg-green-500' : 'bg-blue-500'}`}>
                    {location ? '📍 Location Locked' : '📍 Get My GPS Location'}
                </button>
            </div>

            <input
                type="file" accept="image/*"
                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                className="mb-4 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />

            <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white p-2 rounded font-bold hover:bg-orange-600">
                {loading ? 'Uploading...' : 'Post Food 🚀'}
            </button>
        </form>
    );
}