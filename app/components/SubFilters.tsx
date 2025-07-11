// app/components/SubFilters.tsx
import { FilterState } from "@/types";
import { SlidersHorizontal, X } from "lucide-react";

interface SubFiltersProps {
  sortOption: string;
  setSortOption: (option: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  openModal: () => void;
}

export const SubFilters = ({ sortOption, setSortOption, resetFilters, hasActiveFilters, openModal }: SubFiltersProps) => {
  return (
    <div className="mb-8 p-4 bg-slate-800/60 rounded-lg border border-slate-700/50 backdrop-blur-sm flex flex-wrap items-center gap-4">
      <button onClick={openModal} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700/50 border border-slate-700 rounded-lg p-2.5 h-full text-sm font-semibold text-white transition-colors">
        <SlidersHorizontal size={16} /> All Filters
      </button>

      {/* Sort By is now the primary control */}
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm font-semibold text-white focus:ring-amber-500 focus:border-amber-500 h-full"
      >
        <optgroup label="Popularity & Date">
          <option value="popularity.desc">Most Popular</option>
          <option value="release_date.desc">Newest</option>
        </optgroup>
        <optgroup label="Ratings (Client-side)">
          <option value="client-combined.desc">Highest Combined</option>
          <option value="client-imdb.desc">Highest IMDb</option>
          <option value="client-tmdb.desc">Highest TMDb</option>
        </optgroup>
      </select>
      
      {hasActiveFilters && (
        <button onClick={resetFilters} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 rounded-lg p-2.5 h-full text-sm text-slate-300 transition-colors">
          <X size={16} /> Reset
        </button>
      )}
    </div>
  );
}