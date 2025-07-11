// app/page.tsx
"use client";

import { useState } from 'react';
import { TMDBMovie, OMDbRating, CombinedMovie } from '@/types';
import Image from 'next/image';

// Helper to calculate the combined score
const calculateCombinedScore = (ratings: OMDbRating): number => {
    let total = 0;
    let count = 0;

    // 1. IMDb (x10 to be out of 100)
    const imdb = parseFloat(ratings.imdbRating);
    if (!isNaN(imdb)) {
        total += imdb * 10;
        count++;
    }

    // 2. Rotten Tomatoes (remove '%' and parse)
    const rtRating = ratings.Ratings?.find(r => r.Source === 'Rotten Tomatoes');
    if (rtRating) {
        const rtScore = parseInt(rtRating.Value.replace('%', ''), 10);
        if (!isNaN(rtScore)) {
            total += rtScore;
            count++;
        }
    }

    // 3. Metacritic
    const meta = parseInt(ratings.Metascore, 10);
    if (!isNaN(meta)) {
        total += meta;
        count++;
    }

    return count > 0 ? Math.round(total / count) : 0;
};

// Movie Card Component
const MovieCard = ({ movie }: { movie: CombinedMovie }) => {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="relative h-96">
                {posterUrl ? (
                    <Image src={posterUrl} alt={movie.title} fill objectFit="cover" />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">No Poster</span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-white">{movie.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{movie.release_date?.substring(0, 4)}</p>
                
                <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-yellow-400">Combined Score</span>
                        <span className="text-2xl font-extrabold text-white bg-yellow-500 rounded-full flex items-center justify-center w-12 h-12">
                            {movie.combinedScore}
                        </span>
                    </div>
                    <div className="text-xs text-gray-300 space-y-1">
                        <p>IMDb: {movie.ratings.imdb}</p>
                        <p>Rotten Tomatoes: {movie.ratings.rottenTomatoes}</p>
                        <p>Metacritic: {movie.ratings.metacritic}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Homepage Component
export default function HomePage() {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState<CombinedMovie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const omdbApiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        setIsLoading(true);
        setError(null);
        setMovies([]);
        setSearched(true);

        try {
            // 1. Fetch from TMDB
            const tmdbRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}`);
            if (!tmdbRes.ok) throw new Error('Failed to fetch from TMDB');
            const tmdbData = await tmdbRes.json();
            const tmdbMovies: TMDBMovie[] = tmdbData.results;

            // 2. For each movie, fetch ratings from OMDb
            const combinedMoviesData = await Promise.all(
                tmdbMovies.map(async (movie) => {
                    const omdbRes = await fetch(`https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${encodeURIComponent(movie.title)}`);
                    const omdbData: OMDbRating = await omdbRes.json();
                    
                    const combinedScore = calculateCombinedScore(omdbData);

                    const rtRating = omdbData.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value || 'N/A';
                    
                    return {
                        ...movie,
                        ratings: {
                            imdb: omdbData.imdbRating || 'N/A',
                            rottenTomatoes: rtRating,
                            metacritic: omdbData.Metascore || 'N/A',
                        },
                        combinedScore,
                    };
                })
            );

            setMovies(combinedMoviesData);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center text-white mb-8">Movie Discovery Tool</h1>
            
            <form onSubmit={handleSearch} className="flex justify-center mb-8 gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a movie..."
                    className="w-full max-w-md p-3 rounded-l-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button type="submit" disabled={isLoading} className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-r-md hover:bg-yellow-400 disabled:bg-gray-500">
                    {isLoading ? '...' : 'Search'}
                </button>
            </form>

            {isLoading && <p className="text-center text-white">Loading...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}

            {!isLoading && searched && movies.length === 0 && (
                <p className="text-center text-gray-400">No movies found. Try another search!</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
            </div>
        </main>
    );
}