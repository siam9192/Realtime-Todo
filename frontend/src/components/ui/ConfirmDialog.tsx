import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface ConfirmDialogProps {
  id: string;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

function ConfirmDialog({
  id,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const close = () => {
    (document.getElementById(id) as HTMLDialogElement)?.close();
  };
  const open = () => {
    (document.getElementById(id) as HTMLDialogElement)?.showModal();
  };

  useEffect(() => {
    open();
  }, []);

  const cancel = () => {
    onCancel && onCancel();
    close();
  };
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <div className="flex justify-center mb-3 text-warning p-5 bg-base-300 rounded-full size-fit mx-auto">
          <AlertTriangle size={60} />
        </div>

        <h3 className="font-bold text-lg text-center">{title}</h3>

        <p className="text-sm opacity-70 text-center mt-2">{message}</p>

        {/* Actions */}
        <div className="modal-action flex justify-end gap-3">
          <button type="button" className="btn btn-ghost" onClick={cancel}>
            {cancelText}
          </button>

          <button
            type="button"
            className="btn  bg-pink-600"
            disabled={loading}
            onClick={() => {
              onConfirm();
              (document.getElementById(id) as HTMLDialogElement)?.close();
            }}
          >
            {loading ? <span className="loading loading-spinner loading-sm" /> : confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
