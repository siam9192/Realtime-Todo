import { TaskStatus, type Task } from "../../types/task.type";
import UpdateTaskModal from "../ui/UpdateTaskModal";

import { useCurrentUserProviderContext } from "../../context/CurrentUserProviderContext";
import { DEFAULT_PROFILE_PHOTO } from "../../utils/constant";
import TaskDeleteButton from "../ui/TaskDeleteButton";

function TaskCard({ task }: { task: Task }) {
  const { data } = useCurrentUserProviderContext();

  const currentUser = data?.data!;
  const isOverdue =
    new Date(task.dueDate || task.updatedAt) < new Date() && task.status !== TaskStatus.Completed;

  const isOwner = task.creatorId === currentUser.id;
  const createdAt = new Date(task.createdAt);
  const updatedAt = new Date(task.updatedAt);
  const dueDate = new Date(task.dueDate);

  return (
    <div className="relative p-5 bg-base-100 rounded-2xl border border-base-200 shadow-sm hover:shadow-md transition-all duration-200 group h-full flex flex-col">
      <div className="grow">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-semibold leading-tight">{task.title}</h3>

          {isOverdue && <span className="text-warning gap-1">Overdue</span>}
        </div>

        <p className="mt-2 text-sm opacity-70 line-clamp-2">{task.description}</p>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm">
        {/* Assignee */}
        {task.assignedTo ? (
          <div>
            <p className="text-xs opacity-60 mb-1">Assigned To:</p>
            <div className="flex items-center gap-2">
              <img
                src={task.assignedTo.profilePhoto ?? DEFAULT_PROFILE_PHOTO}
                alt={task.assignedTo.name}
                className="w-7 h-7 rounded-full ring-2 ring-base-200"
              />
              <span className="opacity-70">
                {task.assignedTo.id === currentUser.id ? "You" : task.assignedTo.name}
              </span>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        {/* Priority */}
        <span
          className={`
            badge badge-outline font-medium
            ${task.priority === "Urgent" && "badge-error"}
            ${task.priority === "High" && "badge-warning"}
            ${task.priority === "Medium" && "badge-info"}
            ${task.priority === "Low" && "badge-success"}
          `}
        >
          {task.priority}
        </span>
      </div>

      {/* ---------- Footer ---------- */}
      <div className="mt-4 pt-3 border-t border-base-200 flex flex-col md:flex-row md:justify-between gap-2 text-xs text-base-content/60">
        {/* Creator */}
        <span>
          Created by{" "}
          <span className="font-medium text-base-content">
            {task.creatorId === currentUser.id ? "You" :`@${task.creator.username}`}
          </span>
        </span>

        {/* Dates */}
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
          <span>
            <span className="font-medium">Created:</span> {createdAt.toLocaleDateString()} •{" "}
            {createdAt.toLocaleTimeString()}
          </span>

          <span>
            <span className="font-medium">Updated:</span> {updatedAt.toLocaleDateString()} •{" "}
            {updatedAt.toLocaleTimeString()}
          </span>

          <span>
            <span className="font-medium">Due:</span> {dueDate.toLocaleDateString()} •{" "}
            {dueDate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Actions  */}
      <div className="mt-2  right-3 flex justify-end gap-1 ">
        <UpdateTaskModal task={task} />

        {isOwner && <TaskDeleteButton id={task.id} />}
      </div>
    </div>
  );
}

export default TaskCard;
