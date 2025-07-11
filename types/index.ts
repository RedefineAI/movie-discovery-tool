// types/index.ts
export interface TMDBMovie {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  release_date: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  imdb_id?: string; // <-- ADD THIS LINE FOR UNIQUE ID LOOKUP
}

export interface OMDbRating {
  imdbRating: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  Director?: string;
}

export interface CombinedMovie extends TMDBMovie {
  ratings: {
    imdb: string;
    rottenTomatoes: string;
    metacritic: string;
  };
  combinedScore: number;
  director?: string;
  genres: string[];
}

export interface Genre {
  id: number;
  name: string;
}

export type FilterState = {
  type: 'movie' | 'tv';
  with_genres: string;
  year: string;
  year_mode: 'exact' | 'after' | 'before';
  minRating: string;
};