// app/components/ui/Header.tsx
import { Film } from 'lucide-react';

// This component is now simpler and has no props.
export const Header = () => (
  <header className="py-8 md:py-10">
    <div className="inline-flex items-center gap-3">
      <Film className="w-8 h-8 text-amber-400" />
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        CineScope
      </h1>
    </div>
    <p className="mt-1 text-slate-400">Discover your next favorite film.</p>
  </header>
);