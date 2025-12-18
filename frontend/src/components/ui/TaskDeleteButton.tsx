import { Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { useDeleteTaskMutation } from "../../query/services/task.service";
import { queryClient } from "../../App";
import { toast } from "sonner";

interface Props {
  id: string;
}
function TaskDeleteButton({ id }: Props) {
  const [isConfirmDialog, setIsConfirmDialog] = useState(false);
  const { mutate, isPending } = useDeleteTaskMutation();
  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        toast.success("Task deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        });
        setIsConfirmDialog(false);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => setIsConfirmDialog(true)}
        className="btn btn-xs btn-ghost text-error"
      >
        <Trash2 size={16} />
      </button>

      {isConfirmDialog ? (
        <ConfirmDialog
          message="Are you sure you want to continue? This action cannot be undone, and the selected item will be permanently deleted from the system."
          id={`delete-confirmation-${id}`}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmDialog(false)}
        />
      ) : null}
    </>
  );
}

export default TaskDeleteButton;
