// app/components/AdvancedFiltersModal.tsx
import { Genre, FilterState } from "@/types";

interface AdvancedFiltersModalProps {
  genres: Genre[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClose: () => void;
}

const GenrePill = ({ label, isSelected, onClick }: { label: string, isSelected: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
            isSelected
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-amber-500'
        }`}
    >
        {label}
    </button>
);

export const AdvancedFiltersModal = ({ genres, filters, setFilters, onClose }: AdvancedFiltersModalProps) => {

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
        <div className="space-y-6">
            {/* Year Filter Section */}
            <div>
                <h4 className="text-lg font-semibold text-white mb-3">Year</h4>
                <div className="flex items-center gap-2">
                    <select
                        value={filters.year_mode}
                        onChange={(e) => setFilters(p => ({ ...p, year_mode: e.target.value as FilterState['year_mode'] }))}
                        className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-300 focus:ring-amber-500 focus:border-amber-500 h-full"
                    >
                        <option value="exact">In Year</option>
                        <option value="after">After</option>
                        <option value="before">Before</option>
                    </select>
                    <input
                        type="number"
                        placeholder="e.g., 2023"
                        value={filters.year}
                        onChange={(e) => setFilters(p => ({ ...p, year: e.target.value }))}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-amber-500 focus:border-amber-500 h-full"
                    />
                </div>
            </div>

            {/* Min. Rating Filter Section - MOVED HERE */}
            <div>
                <h4 className="text-lg font-semibold text-white mb-3">Minimum Combined Rating</h4>
                <div className="flex items-center gap-4">
                    <input
                        type="range" id="minRating" name="minRating"
                        min="0" max="100" step="1" value={filters.minRating}
                        onChange={(e) => setFilters(p => ({ ...p, minRating: e.target.value }))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <span className="font-bold text-amber-400 text-lg w-12 text-center">{filters.minRating}</span>
                </div>
            </div>

            {/* Genre Filter Section */}
            <div>
                <h4 className="text-lg font-semibold text-white mb-3">Genres</h4>
                <div className="flex flex-wrap gap-3">
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
            
            <div className="flex justify-end pt-4 border-t border-slate-700">
                <button onClick={onClose} className="bg-amber-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-amber-500 transition-colors">
                    Done
                </button>
            </div>
        </div>
    );
};