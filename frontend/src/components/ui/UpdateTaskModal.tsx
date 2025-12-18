import { useForm } from "react-hook-form";
import { TaskPriority, TaskStatus, type Task } from "../../types/task.type";
import { Pencil, UserPlus } from "lucide-react";
import { useState } from "react";
import AssignToDialog from "./AssignToDialog";
import { DEFAULT_PROFILE_PHOTO, TASK_PROPERTY_LENGTH } from "../../utils/constant";
import { zodResolver } from "@hookform/resolvers/zod";

import type { z } from "zod";
import taskValidation from "../../validations/task.validation";
import type { AssignUser } from "../../types/user.type";
import { useUpdateTaskMutation } from "../../query/services/task.service";
import { toast } from "sonner";
import { queryClient } from "../../App";

type UpdateTaskFormValues = z.infer<typeof taskValidation.updateTaskSchema>;

interface Props {
  task: Task;
}

function UpdateTaskModal({ task }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateTaskFormValues>({
    resolver: zodResolver(taskValidation.updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
      assignedToId: task.assignedToId ?? "",
    },
  });

  const [isAssignDialog, setIsAssignDialog] = useState(false);
  const [assignUser, setAssignUser] = useState<AssignUser | null>(task.assignedTo as AssignUser);
  const titleLength = watch("title")?.length || 0;
  const descLength = watch("description")?.length || 0;

  const close = () =>
    (document.getElementById(`update-task-${task.id}`) as HTMLDialogElement)?.close();

  const { mutate, isPending } = useUpdateTaskMutation();
  const handleFormSubmit = (data: UpdateTaskFormValues) => {
    mutate(
      { id: task.id, payload: data },
      {
        onSuccess: () => {
          toast.success("Task updated successfully");
          queryClient.invalidateQueries({
            queryKey: ["tasks"],
          });
          reset();
          close();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };

  return (
    <>
      {/* Open Button */}
      <button
        onClick={() =>
          (document.getElementById(`update-task-${task.id}`) as HTMLDialogElement)?.showModal()
        }
        className="btn btn-xs btn-ghost"
      >
        <Pencil size={16} />
      </button>

      {/* Modal */}
      <dialog id={`update-task-${task.id}`} className="modal">
        <div className="modal-box max-w-xl">
          <h3 className="font-bold text-lg mb-4">Update Task</h3>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* ---------- Title ---------- */}
            <div>
              <label className="label font-medium">Title</label>
              <input className="input input-bordered w-full" {...register("title")} />
              {errors.title && <p className="text-error text-sm">{errors.title.message}</p>}
              <div className="flex justify-end text-xs opacity-70">
                {titleLength}/{TASK_PROPERTY_LENGTH.title.max}
              </div>
            </div>

            {/* ---------- Description ---------- */}
            <div>
              <label className="label font-medium">Description</label>
              <textarea
                className="textarea textarea-bordered w-full min-h-[120px]"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-error text-sm">{errors.description.message}</p>
              )}
              <div className="flex justify-end text-xs opacity-70">
                {descLength}/{TASK_PROPERTY_LENGTH.description.max}
              </div>
            </div>

            {/* ---------- Due Date ---------- */}
            <div>
              <label className="label font-medium">Due Date</label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                {...register("dueDate")}
              />
              {errors.dueDate && <p className="text-error text-sm">{errors.dueDate.message}</p>}
            </div>

            {/* ---------- Priority & Status ---------- */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label font-medium">Priority</label>
                <select className="select select-bordered w-full" {...register("priority")}>
                  {Object.values(TaskPriority).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label font-medium">Status</label>
                <select className="select select-bordered w-full" {...register("status")}>
                  {Object.values(TaskStatus).map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ---------- Assign To ---------- */}
            <div>
              <label className="label font-medium">Assign To (optional)</label>
              {!assignUser ? (
                <button
                  type="button"
                  onClick={() => setIsAssignDialog(true)}
                  className="p-5 bg-base-300 block mt-2 rounded-lg"
                >
                  {" "}
                  <UserPlus size={24} />{" "}
                </button>
              ) : (
                <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg mt-2">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 rounded-full bg-base-300">
                        <img
                          src={assignUser.profilePicture ?? DEFAULT_PROFILE_PHOTO}
                          alt={assignUser.name}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-sm">{assignUser.name}</p>
                      <p className="text-xs opacity-70">@{assignUser.username}</p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setAssignUser(null);
                      setValue("assignedToId", null);
                    }}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    Remove
                  </button>
                </div>
              )}

              <p className="text-xs text-error mt-1">{errors.assignedToId?.message}</p>
            </div>

            {/* ---------- Actions ---------- */}
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" disabled={isPending} onClick={close}>
                Cancel
              </button>
              <button disabled={isPending} type="submit" className="btn btn-primary">
                Update Task
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Assign Dialog */}
      {isAssignDialog && (
        <AssignToDialog
          onAssign={(user) => setValue("assignedToId", user.id)}
          onClose={() => setIsAssignDialog(false)}
        />
      )}
    </>
  );
}

export default UpdateTaskModal;
