export const SkeletonCard = () => (
  <div className="bg-slate-800/50 p-4 rounded-lg animate-pulse">
    <div className="h-48 bg-slate-700 rounded-md"></div>
    <div className="mt-4 space-y-3">
      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
      <div className="h-3 bg-slate-700 rounded w-1/4"></div>
      <div className="pt-4 flex justify-between items-center">
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-slate-700 rounded"></div>
          <div className="h-3 bg-slate-700 rounded"></div>
          <div className="h-3 bg-slate-700 rounded"></div>
        </div>
        <div className="w-24 h-24 bg-slate-700 rounded-full ml-4"></div>
      </div>
    </div>
  </div>
);