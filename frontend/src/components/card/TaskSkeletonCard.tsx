function TaskSkeletonCard() {
  return (
    <div className="p-4 bg-base-100 rounded-xl border border-base-200 shadow-sm animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-4 w-40 bg-base-300 rounded"></div>
        <div className="h-3 w-16 bg-base-300 rounded"></div>
      </div>

      <div className="space-y-2">
        <div className="h-3 w-full bg-base-300 rounded"></div>
        <div className="h-3 w-5/6 bg-base-300 rounded"></div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-base-300"></div>
          <div className="h-3 w-20 bg-base-300 rounded"></div>
        </div>

        <div className="h-4 w-16 bg-base-300 rounded-full"></div>
      </div>

      <div className="pt-2 border-t border-base-200 flex justify-between">
        <div className="h-3 w-24 bg-base-300 rounded"></div>
        <div className="h-3 w-32 bg-base-300 rounded"></div>
      </div>
    </div>
  );
}

export default TaskSkeletonCard;
