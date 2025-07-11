// app/components/FiltersSidebar.tsx
import { Genre, FilterState } from "@/types";
import { X } from "lucide-react";

interface FiltersSidebarProps {
  genres: Genre[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const GenrePill = ({ label, isSelected, onClick }: { label: string, isSelected: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors ${
            isSelected
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-amber-500'
        }`}
    >
        {label}
    </button>
);

export const FiltersSidebar = ({ genres, filters, setFilters, resetFilters, hasActiveFilters }: FiltersSidebarProps) => {

    const handleGenreChange = (genreId: string) => {
        setFilters((prev) => {
            const currentGenres = prev.with_genres.split(',').filter(Boolean);
            const isSelected = currentGenres.includes(genreId);
            const newGenres = isSelected
                ? currentGenres.filter(id => id !== genreId)
                : [...currentGenres, genreId];
            return { ...prev, with_genres: newGenres.join(',') };
        });
    };

    return (
        <aside className="lg:col-span-1 bg-slate-800/60 p-6 rounded-lg border border-slate-700/50 backdrop-blur-sm h-fit sticky top-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Filters</h2>
                {hasActiveFilters && (
                    <button onClick={resetFilters} className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 hover:underline">
                        <X size={14}/> Reset All
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* SORT BY DROPDOWN HAS BEEN REMOVED FROM HERE */}

                {/* Min Rating (Compact Design) */}
                <div>
                    <label htmlFor="minRating" className="block text-sm font-medium text-slate-300 mb-2">Min. Rating</label>
                    <div className="flex items-center gap-3">
                         <input type="range" id="minRating" min="0" max="100" step="1" value={filters.minRating} onChange={(e) => setFilters(p => ({ ...p, minRating: e.target.value }))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"/>
                         <span className="font-bold text-amber-400 text-sm w-8 text-center">{filters.minRating}</span>
                    </div>
                </div>

                {/* Year Filter */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Year</label>
                    <div className="flex items-center gap-2">
                        <select
                            value={filters.year_mode}
                            onChange={(e) => setFilters(p => ({ ...p, year_mode: e.target.value as FilterState['year_mode'] }))}
                            className="bg-slate-700 border border-slate-600 rounded-l-md p-2.5 text-sm text-slate-300 focus:ring-amber-500 focus:border-amber-500 h-full"
                        >
                            <option value="exact">In</option>
                            <option value="after">After</option>
                            <option value="before">Before</option>
                        </select>
                        <input
                            type="number" placeholder="Year" value={filters.year}
                            onChange={(e) => setFilters(p => ({ ...p, year: e.target.value }))}
                            className="flex-1 bg-slate-700 border-y border-r border-slate-600 rounded-r-md p-2.5 text-sm w-full text-white focus:ring-amber-500 focus:border-amber-500 h-full"
                        />
                    </div>
                </div>

                {/* Genre Filter */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Genres</label>
                    <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                            <GenrePill
                                key={genre.id}
                                label={genre.name}
                                isSelected={filters.with_genres.includes(genre.id.toString())}
                                onClick={() => handleGenreChange(genre.id.toString())}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};