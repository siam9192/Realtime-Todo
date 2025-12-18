import TaskSkeletonCard from "../card/TaskSkeletonCard";

function TasksLoading() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_) => (
        <TaskSkeletonCard />
      ))}
    </div>
  );
}

export default TasksLoading;
