// app/components/ui/Icons.tsx

// TMDb Icon - a simplified version of their logo
export const TMDbIcon = () => (
  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 14C26 20.6274 20.6274 26 14 26C7.37258 26 2 20.6274 2 14C2 7.37258 7.37258 2 14 2C20.6274 2 26 7.37258 26 14Z" fill="#032541"/>
    <rect x="6" y="10" width="16" height="8" rx="4" fill="#01D277"/>
  </svg>
);

// IMDb Icon - using a star
export { Star as IMDbIcon } from 'lucide-react';

// Rotten Tomatoes Icon
export const TomatoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
    <path d="M16.417 2.5c2.302 0 4.225 1.521 4.545 3.735 1.07 1.522.999 3.635.074 5.37-1.168 2.185-3.049 4.312-5.18 5.762-1.393 1.02-3.155.62-3.832-1.042-.321-.784.221-1.68 1.041-1.871.956-.22 1.868.495 2.152 1.411.537 1.714 3.028 1.418 3.395-.436.331-1.674-1.123-3.266-2.83-3.322-3.238-.103-5.28 2.508-4.321 5.337.96 2.828-1.285 5.672-4.114 4.712-2.828-.96-3.792-3.792-2.828-6.621s3.792-4.752 6.621-3.792c.783.268 1.637-.217 1.871-1.041.234-.824-.496-1.68-1.317-1.871C4.706 5.166 2.5 7.09 2.5 9.583c0 1.522 1.07 3.635 2.144 5.37C2.459 13.785.877 11.672.637 9.5.336 7.09 1.579 4.328 3.735 2.89 5.89.812 9.073.54 11.833.56c2.46.017 4.584.897 4.584 1.94z"/>
  </svg>
);

// Metacritic Icon
export { Bot as MetacriticIcon } from 'lucide-react';