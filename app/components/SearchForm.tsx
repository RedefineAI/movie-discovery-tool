import { Search } from 'lucide-react';

interface SearchFormProps {
  query: string;
  setQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const SearchForm = ({ query, setQuery, handleSearch, isLoading }: SearchFormProps) => (
  <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-10">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for a movie like 'Inception'..."
      className="w-full p-4 pl-12 rounded-full bg-slate-800/80 text-white border-2 border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
    />
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
    <button
      type="submit"
      disabled={isLoading}
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-600 text-white font-bold px-6 py-2 rounded-full hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? 'Searching...' : 'Search'}
    </button>
  </form>
);