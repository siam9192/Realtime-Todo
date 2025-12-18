import { useForm } from "react-hook-form";
import { TaskPriority, TaskStatus } from "../../types/task.type";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import AssignToDialog from "./AssignToDialog";
import { DEFAULT_PROFILE_PHOTO, TASK_PROPERTY_LENGTH } from "../../utils/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import taskValidation from "../../validations/task.validation";
import type z from "zod";
import type { AssignUser } from "../../types/user.type";
import { useCreateTaskMutation } from "../../query/services/task.service";
import { toast } from "sonner";
import { queryClient } from "../../App";

type CreateTaskFormValues = z.infer<typeof taskValidation.createTaskSchema>;

function CreateTaskModal() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    defaultValues: {
      priority: TaskPriority.Medium,
      status: TaskStatus.To_Do,
      assignedToId: null,
    },
    resolver: zodResolver(taskValidation.createTaskSchema),
  });

  const [isAssignDialog, setIsAssignDialog] = useState(false);
  const [assignUser, setAssignUser] = useState<AssignUser | null>(null);

  const titleLength = watch("title")?.length || 0;
  const descLength = watch("description")?.length || 0;

  const close = () => (document.getElementById("create-task-modal") as HTMLDialogElement)?.close();

  const { mutate, isPending } = useCreateTaskMutation();
  const handleFormSubmit = (data: CreateTaskFormValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Task created successfully");
        reset();
        setAssignUser(null);
        close();
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        });
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <>
      {/* Open Button */}
      <button
        className="btn btn-primary btn-md md:btn-lg"
        onClick={() =>
          (document.getElementById("create-task-modal") as HTMLDialogElement)?.showModal()
        }
      >
        + Create Task
      </button>

      {/* Modal */}
      <dialog id="create-task-modal" className="modal">
        <div className="modal-box max-w-xl">
          <h3 className="font-bold text-lg mb-4">Create New Task</h3>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* ---------- Title ---------- */}
            <div>
              <label className="label font-medium">Title</label>
              <input
                className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
                {...register("title")}
              />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-error">{errors.title?.message}</span>
                <span
                  className={
                    titleLength > TASK_PROPERTY_LENGTH.title.max ? "text-error" : "opacity-70"
                  }
                >
                  {titleLength}/{TASK_PROPERTY_LENGTH.title.max}
                </span>
              </div>
            </div>

            {/* ---------- Description ---------- */}
            <div>
              <label className="label font-medium">Description</label>
              <textarea
                className={`textarea textarea-bordered w-full min-h-[120px] ${
                  errors.description ? "textarea-error" : ""
                }`}
                {...register("description")}
              />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-error">{errors.description?.message}</span>
                <span
                  className={
                    descLength > TASK_PROPERTY_LENGTH.description.max ? "text-error" : "opacity-70"
                  }
                >
                  {descLength}/{TASK_PROPERTY_LENGTH.description.max}
                </span>
              </div>
            </div>

            {/* ---------- Due Date ---------- */}
            <div>
              <label className="label font-medium">Due Date</label>
              <input
                type="datetime-local"
                className={`input input-bordered w-full ${errors.dueDate ? "input-error" : ""}`}
                {...register("dueDate")}
              />
              <p className="text-xs text-error mt-1">{errors.dueDate?.message}</p>
            </div>

            {/* ---------- Priority & Status ---------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label font-medium">Priority</label>
                <select
                  className={`select select-bordered w-full ${
                    errors.priority ? "select-error" : ""
                  }`}
                  {...register("priority")}
                >
                  {Object.values(TaskPriority).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-error mt-1">{errors.priority?.message}</p>
              </div>

              <div>
                <label className="label font-medium">Status</label>
                <select
                  className={`select select-bordered w-full ${errors.status ? "select-error" : ""}`}
                  {...register("status")}
                >
                  {Object.values(TaskStatus).map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-error mt-1">{errors.status?.message}</p>
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
                          src={assignUser.profilePhoto ?? DEFAULT_PROFILE_PHOTO}
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
                      setValue("assignedToId", undefined);
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
                Create Task
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Assign Dialog */}
      {isAssignDialog && (
        <AssignToDialog
          onAssign={(user) => {
            setValue("assignedToId", user?.id);
            setAssignUser(user);
          }}
          onClose={() => setIsAssignDialog(false)}
        />
      )}
    </>
  );
}

export default CreateTaskModal;
