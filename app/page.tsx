// app/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CombinedMovie, Genre, FilterState } from '@/types';
import { useDebounce } from '@/app/hooks/useDebounce';
import { Header } from './components/ui/Header';
import { Footer } from './components/ui/Footer';
import { ResultsGrid } from './components/ResultsGrid';
import { SearchAndType } from './components/SearchAndType';
import { FiltersSidebar } from './components/FiltersSidebar';
import { ResultsHeader } from './components/ResultsHeader';

const calculateCombinedScore = (omdb: any, tmdb: any): number => {
    let total = 0, count = 0;
    if (tmdb.vote_average > 0) { total += tmdb.vote_average * 10; count++; }
    const imdb = parseFloat(omdb.imdbRating);
    if (!isNaN(imdb)) { total += imdb * 10; count++; }
    const rtRating = omdb.Ratings?.find((r: any) => r.Source === 'Rotten Tomatoes');
    if (rtRating) { const rtScore = parseInt(rtRating.Value.replace('%', ''), 10); if (!isNaN(rtScore)) { total += rtScore; count++; } }
    const meta = parseInt(omdb.Metascore, 10);
    if (!isNaN(meta)) { total += meta; count++; }
    return count > 0 ? Math.round(total / count) : 0;
};

export default function HomePage() {
    const initialFilters: FilterState = { type: 'movie', with_genres: '', year: '', year_mode: 'exact', minRating: '0' };

    const [apiMovies, setApiMovies] = useState<CombinedMovie[]>([]);
    const [displayedMovies, setDisplayedMovies] = useState<CombinedMovie[]>([]);
    const [allGenres, setAllGenres] = useState<Genre[]>([]);
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [sortOption, setSortOption] = useState('popularity.desc');
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(initialFilters);
    const debouncedQuery = useDebounce(query, 500);
    const debouncedFilters = useDebounce(filters, 500);

    const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const omdbApiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;

    const resetFilters = () => { setQuery(''); setFilters(initialFilters); };

    const genreMap = useMemo(() => new Map(allGenres.map(g => [g.id, g.name])), [allGenres]);

    const fetchAPIData = useCallback(async () => {
        if (!tmdbApiKey || !omdbApiKey) {
            setError("API key is not configured.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            let initialResults: any[] = [];

            // ========================================================================
            // == THE NEW "MERGE STRATEGY" LOGIC                                   ==
            // ========================================================================
            if (debouncedQuery) {
                // When searching, fetch from multiple sources to create a high-quality pool
                const searchUrl = `https://api.themoviedb.org/3/search/${debouncedFilters.type}?api_key=${tmdbApiKey}&query=${debouncedQuery}&include_adult=false`;
                const popularUrl = `https://api.themoviedb.org/3/discover/${debouncedFilters.type}?api_key=${tmdbApiKey}&sort_by=popularity.desc&include_adult=false`;

                const [searchResponse, popularResponse] = await Promise.all([
                    fetch(searchUrl),
                    fetch(popularUrl)
                ]);

                if (!searchResponse.ok || !popularResponse.ok) throw new Error('Failed to fetch initial data from TMDB.');

                const searchData = await searchResponse.json();
                const popularData = await popularResponse.json();
                
                // Merge and deduplicate the results
                const allResults = [...searchData.results, ...popularData.results];
                const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());
                initialResults = uniqueResults;
            } else {
                // When discovering, use the user's selected filters
                const params = new URLSearchParams({ api_key: tmdbApiKey, sort_by: sortOption, include_adult: 'false' });
                if (debouncedFilters.with_genres) params.append('with_genres', debouncedFilters.with_genres);
                if (debouncedFilters.year) {
                    const year = debouncedFilters.year;
                    const dateKey = debouncedFilters.type === 'movie' ? 'primary_release_date' : 'first_air_date';
                    if (debouncedFilters.year_mode === 'exact') params.append(debouncedFilters.type === 'movie' ? 'primary_release_year' : 'first_air_date_year', year);
                    else if (debouncedFilters.year_mode === 'after') params.append(`${dateKey}.gte`, `${year}-01-01`);
                    else if (debouncedFilters.year_mode === 'before') params.append(`${dateKey}.lte`, `${year}-12-31`);
                }
                const discoverRes = await fetch(`https://api.themoviedb.org/3/discover/${debouncedFilters.type}?${params.toString()}`);
                if (!discoverRes.ok) throw new Error('Failed to fetch from TMDB.');
                const discoverData = await discoverRes.json();
                initialResults = discoverData.results;
            }

            // Now, process the high-quality initialResults list
            const detailedMovies = await Promise.all(
                initialResults.slice(0, 40).map(async (baseMovie: any) => { // Process a larger pool
                    try {
                        const detailsRes = await fetch(`https://api.themoviedb.org/3/${filters.type}/${baseMovie.id}?api_key=${tmdbApiKey}`);
                        const tmdbDetails = await detailsRes.json();
                        const imdbId = tmdbDetails.imdb_id;
                        if (!imdbId) return null;
                        
                        const omdbRes = await fetch(`https://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbId}`);
                        const omdbData = await omdbRes.json();
                        if(omdbData.Response === "False") return null;

                        const movieGenres = baseMovie.genre_ids.map((id: number) => genreMap.get(id)).filter(Boolean) as string[];
                        return { ...baseMovie, title: baseMovie.title || baseMovie.name, release_date: baseMovie.release_date || baseMovie.first_air_date, ratings: { imdb: omdbData.imdbRating || 'N/A', rottenTomatoes: omdbData.Ratings?.find((r:any) => r.Source === 'Rotten Tomatoes')?.Value || 'N/A', metacritic: omdbData.Metascore || 'N/A' }, combinedScore: calculateCombinedScore(omdbData, baseMovie), director: omdbData.Director, genres: movieGenres };
                    } catch (e) { return null; }
                })
            );
            
            setApiMovies(detailedMovies.filter(Boolean) as CombinedMovie[]);

        } catch (err) {
            if (err instanceof Error) setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedFilters, debouncedQuery, sortOption, tmdbApiKey, omdbApiKey, filters.type, genreMap]);

    useEffect(() => { fetchAPIData(); }, [fetchAPIData]);
    
    useEffect(() => {
        const fetchAllGenres = async () => {
            if (!tmdbApiKey) return;
            const movieRes = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbApiKey}`);
            const tvRes = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${tmdbApiKey}`);
            const movieData = await movieRes.json();
            const tvData = await tvRes.json();
            setAllGenres(Array.from(new Map([...movieData.genres, ...tvData.genres].map(item => [item.id, item])).values()));
        };
        fetchAllGenres();
    }, [tmdbApiKey]);

    // This useEffect handles all client-side processing
    useEffect(() => {
        let processedMovies = [...apiMovies];

        // If there's a search query, we must filter the merged list to only show relevant titles.
        if (debouncedQuery) {
            processedMovies = processedMovies.filter(movie =>
                movie.title.toLowerCase().includes(debouncedQuery.toLowerCase())
            );
        }

        // Apply the minimum rating filter.
        processedMovies = processedMovies.filter(
            movie => movie.combinedScore >= parseInt(filters.minRating, 10)
        );
        
        // Apply the user-selected sort option. For searches, they can now re-sort the high-quality list.
        if (sortOption.startsWith('client-')) {
            processedMovies.sort((a, b) => {
                let valA = 0, valB = 0;
                if (sortOption === 'client-combined.desc') { valA = a.combinedScore; valB = b.combinedScore; }
                if (sortOption === 'client-imdb.desc') { valA = parseFloat(a.ratings.imdb); valB = parseFloat(b.ratings.imdb); }
                if (sortOption === 'client-tmdb.desc') { valA = a.vote_average * 10; valB = b.vote_average * 10; }
                return (isNaN(valB) ? 0 : valB) - (isNaN(valA) ? 0 : valA);
            });
        } else if (debouncedQuery) {
            // As a default for searches, sort by our combined score unless the user picks another client sort.
            processedMovies.sort((a, b) => b.combinedScore - a.combinedScore);
        }
        
        setDisplayedMovies(processedMovies);
    }, [apiMovies, filters.minRating, sortOption, debouncedQuery]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow container mx-auto px-4">
                <Header />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <FiltersSidebar genres={allGenres} filters={filters} setFilters={setFilters} resetFilters={resetFilters} hasActiveFilters={hasActiveFilters} />
                    </div>
                    <div className="lg:col-span-3">
                        <SearchAndType query={query} setQuery={setQuery} filters={filters} setFilters={setFilters} />
                        <div className="mt-8">
                            <ResultsHeader sortOption={sortOption} setSortOption={setSortOption} resultsCount={displayedMovies.length} />
                            <ResultsGrid movies={displayedMovies} isLoading={isLoading} error={error} searched={true} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}