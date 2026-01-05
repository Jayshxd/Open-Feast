import { useState } from 'react';
import axios from 'axios';
import { MapPin, Upload, Loader2, Send, Image, CheckCircle, XCircle } from 'lucide-react';

export default function PostFoodForm({ onPostSuccess }: { onPostSuccess: () => void }) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocationLoading(false);
            },
            () => {
                alert("Unable to retrieve your location");
                setLocationLoading(false);
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location || !file) {
            alert("Please provide both location and a photo!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', desc);
        formData.append('image', file);
        formData.append('latitude', location.lat.toString());
        formData.append('longitude', location.lng.toString());
        formData.append('deviceLatitude', location.lat.toString());
        formData.append('deviceLongitude', location.lng.toString());

        try {
            await axios.post('http://localhost:8080/api/food-spots', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Food spot shared successfully!');
            setTitle(''); 
            setDesc(''); 
            setFile(null); 
            setLocation(null);
            onPostSuccess();
        } catch (error) {
            console.error(error);
            alert('Failed to post. Make sure you are within 100m of the location.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-100 p-2 rounded-xl">
                    <Send className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-surface-900">Share Free Food</h2>
                    <p className="text-sm text-surface-500">Help others find food that would go to waste</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title Input */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-surface-700 mb-1.5">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder="e.g., Free Pizza at Student Center"
                        className="input"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Description Input */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-surface-700 mb-1.5">
                        Description <span className="text-surface-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        id="description"
                        placeholder="Add details like quantity, type of food, or how long it will be available..."
                        className="input min-h-[100px] resize-none"
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        rows={3}
                    />
                </div>

                {/* Location Button */}
                <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">
                        Location
                    </label>
                    <button 
                        type="button" 
                        onClick={handleGetLocation}
                        disabled={locationLoading}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-all ${
                            location 
                                ? 'border-green-300 bg-green-50 text-green-700' 
                                : 'border-surface-200 bg-surface-50 text-surface-600 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                    >
                        {locationLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Getting location...</span>
                            </>
                        ) : location ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                <span>Location captured ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})</span>
                            </>
                        ) : (
                            <>
                                <MapPin className="w-5 h-5" />
                                <span>Get My GPS Location</span>
                            </>
                        )}
                    </button>
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">
                        Photo
                    </label>
                    <label 
                        className={`w-full flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                            file 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-surface-200 bg-surface-50 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                            className="sr-only"
                        />
                        {file ? (
                            <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">{file.name}</span>
                                <button 
                                    type="button" 
                                    onClick={(e) => { e.preventDefault(); setFile(null); }}
                                    className="ml-2 text-surface-400 hover:text-red-500 transition-colors"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="bg-surface-100 p-3 rounded-full">
                                    <Image className="w-6 h-6 text-surface-400" />
                                </div>
                                <div className="text-center">
                                    <span className="text-primary-600 font-medium">Click to upload</span>
                                    <span className="text-surface-500"> or drag and drop</span>
                                </div>
                                <p className="text-xs text-surface-400">PNG, JPG, GIF up to 10MB</p>
                            </>
                        )}
                    </label>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading || !location || !file || !title}
                    className="btn btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            <span>Share Food Spot</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}