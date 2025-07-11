// app/components/ResultsHeader.tsx
interface ResultsHeaderProps {
  sortOption: string;
  setSortOption: (option: string) => void;
  resultsCount: number;
}

export const ResultsHeader = ({ sortOption, setSortOption, resultsCount }: ResultsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-slate-300">
        Showing <span className="text-white font-bold">{resultsCount}</span> results
      </h3>
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm font-semibold text-white focus:ring-amber-500 focus:border-amber-500"
      >
        <optgroup label="Popularity & Date">
          <option value="popularity.desc">Sort by Popularity</option>
          <option value="release_date.desc">Sort by Newest</option>
        </optgroup>
        <optgroup label="Ratings (Client-side)">
          <option value="client-combined.desc">Sort by Combined</option>
          <option value="client-imdb.desc">Sort by IMDb</option>
          <option value="client-tmdb.desc">Sort by TMDb</option>
        </optgroup>
      </select>
    </div>
  );
};