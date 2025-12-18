import { useEffect, useState } from "react";
import { useGetCreatedTasksQuery } from "../../query/services/task.service";
import { calculateTotalPages } from "../../utils/helper";
import TaskCard from "../card/TaskCard";
import FilterBox from "../ui/FilterBox";
import Pagination from "../ui/Pagination";
import type { Params } from "../../types";
import useLoadingBouncer from "../../hooks/useLoadingBouncer";
import TasksLoading from "./TasksLoading";

function CreatedTasks() {
  const [params, setParams] = useState<Params>({});
  const { data, isLoading, refetch } = useGetCreatedTasksQuery(params);

  const tasks = data?.data ?? [];
  const meta = data?.meta;

  useEffect(() => {
    if (isLoading) return;
    refetch();
  }, [params]);
  const showResult = useLoadingBouncer(isLoading, 2000);

  return (
    <section>
      <div className="flex lg:flex-row flex-col justify-between lg:items-center">
        <h2 className="text-2xl font-bold mb-4">Tasks Created by Me</h2>
        <FilterBox onChange={(params) => setParams(params as any)} />
      </div>
      {showResult ? (
        <>
          {meta?.totalResults === 0 ? (
            <p className="text-sm opacity-70">No created tasks found.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
          {meta && meta.totalResults !== tasks.length && (
            <div className="mt-6">
              <Pagination
                currentPage={1}
                totalPages={calculateTotalPages(meta?.totalResults, meta?.limit)}
                onPageChange={() => {}}
              />
            </div>
          )}
        </>
      ) : (
        <TasksLoading />
      )}
    </section>
  );
}

export default CreatedTasks;
