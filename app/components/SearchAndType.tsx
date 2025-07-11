// app/components/SearchAndType.tsx
import { FilterState } from "@/types";
import { Search } from "lucide-react";

interface SearchAndTypeProps {
  query: string;
  setQuery: (query: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const SearchAndType = ({ query, setQuery, filters, setFilters }: SearchAndTypeProps) => {
  return (
    <div className="mb-4 p-4 bg-slate-800/60 rounded-lg border border-slate-700/50 backdrop-blur-sm flex flex-col md:flex-row items-center gap-4">
      <div className="relative w-full md:flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title (e.g., 'The Matrix')..."
          className="w-full p-3 pl-10 rounded-full bg-slate-900 text-white border-2 border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
      <div className="flex items-center bg-slate-900 border border-slate-700 rounded-full p-1 w-full md:w-auto">
        {['movie', 'tv'].map(type => (
          <button
            key={type}
            type="button"
            onClick={() => setFilters((p) => ({ ...p, type: type as 'movie' | 'tv' }))}
            className={`flex-1 px-6 py-1.5 rounded-full text-sm font-semibold transition-colors ${filters.type === type ? 'bg-amber-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700/50'}`}
          >
            {type === 'movie' ? 'Movies' : 'TV'}
          </button>
        ))}
      </div>
    </div>
  );
};