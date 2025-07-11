// app/components/MovieCard.tsx
import Image from 'next/image';
import { CombinedMovie } from '@/types';
import { CombinedScoreCircle } from './CombinedScoreCircle';
import { Calendar, Clapperboard, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { TMDbIcon, IMDbIcon, TomatoIcon, MetacriticIcon } from './ui/Icons';

const RatingRow = ({ icon, source, value }: { icon: React.ReactNode, source: string, value: string }) => (
    <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-700/50 last:border-b-0">
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-slate-400">{source}</span>
        </div>
        <span className="font-semibold text-white">{value}</span>
    </div>
);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const MovieCard = ({ movie }: { movie: CombinedMovie }) => {
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
    return (
        <motion.div
            variants={cardVariants}
            className="shine-effect bg-slate-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700/50 transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/10 flex flex-col md:flex-row"
        >
            {/* Left Side: Poster */}
            <div className="md:w-1/3 w-full h-64 md:h-auto relative shrink-0">
                {posterUrl ? (
                    <Image src={posterUrl} alt={movie.title} fill style={{ objectFit: 'cover' }} className="rounded-t-lg md:rounded-l-lg md:rounded-t-none" />
                ) : (
                    <div className="w-full h-full bg-slate-700/50 flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                        <Clapperboard className="w-16 h-16 text-slate-500" />
                    </div>
                )}
            </div>

            {/* Right Side: Details */}
            <div className="p-4 md:p-6 flex flex-col flex-1">
                {/* Header */}
                <div className="mb-3">
                    <h3 className="text-xl font-bold text-white" title={movie.title}>{movie.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                        <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /><span>{movie.release_date?.substring(0, 4) || 'N/A'}</span></div>
                        {movie.director && <div className="flex items-center gap-1.5"><Video className="w-4 h-4" /><span>Directed by {movie.director}</span></div>}
                    </div>
                </div>

                {/* Genre Pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {movie.genres.map(genre => (
                        <span key={genre} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full text-xs">{genre}</span>
                    ))}
                </div>

                {/* Overview */}
                <p className="text-sm text-slate-300 mb-4 line-clamp-3 flex-grow">{movie.overview}</p>

                {/* Ratings */}
                <div className="mt-auto flex justify-between items-end gap-4">
                    <div className="flex-1 space-y-1">
                        <RatingRow icon={<TMDbIcon />} source="TMDb" value={`${movie.vote_average.toFixed(1)} / 10`} />
                        <RatingRow icon={<IMDbIcon className="w-5 h-5 text-yellow-400" />} source="IMDb" value={movie.ratings.imdb} />
                        <RatingRow icon={<TomatoIcon />} source="Rotten Tomatoes" value={movie.ratings.rottenTomatoes} />
                        <RatingRow icon={<MetacriticIcon className="w-5 h-5 text-blue-400" />} source="Metacritic" value={movie.ratings.metacritic} />
                    </div>
                    <div className="w-20 shrink-0">
                       <CombinedScoreCircle score={movie.combinedScore} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};