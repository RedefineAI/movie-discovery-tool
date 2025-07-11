// app/components/ResultsGrid.tsx
import { motion } from 'framer-motion';
import { CombinedMovie } from '@/types';
import { MovieCard } from './MovieCard';
import { SkeletonCard } from './ui/SkeletonCard'; // We can reuse this for a list view

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Slightly slower stagger for larger cards
    },
  },
};

export const ResultsGrid = ({ movies, isLoading, error, searched }: { movies: CombinedMovie[], isLoading: boolean, error: string | null, searched: boolean }) => {
  if (isLoading) {
    return (
      <div className="space-y-4"> {/* Use space-y for list view skeleton */}
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">Error: {error}</p>;
  }

  if (searched && movies.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-slate-800/50 rounded-lg">
        <h3 className="text-xl font-semibold text-white">No Movies Found</h3>
        <p className="text-slate-400 mt-2">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4" // A single column list with spacing
    >
      {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
    </motion.div>
  );
};