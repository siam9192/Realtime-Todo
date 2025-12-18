import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { userGetVisibleUsersQuery } from "../../query/services/user.service";
import { DEFAULT_PROFILE_PHOTO } from "../../utils/constant";
import type { AssignUser } from "../../types/user.type";

interface Props {
  onAssign: (user: AssignUser) => void;
  onClose: () => void;
}

function AssignToDialog({ onAssign, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AssignUser | null>(null);
  const [limit, setLimit] = useState(10);
  const { data, refetch } = userGetVisibleUsersQuery({
    searchTerm: query,
    limit,
  });

  const users = data?.data ?? [];

  useEffect(() => {
    if (query) {
      setLimit(100);
    } else setLimit(10);
    refetch();
  }, [query]);

  const close = () => {
    (document.getElementById("assign-user-dialog") as HTMLDialogElement)?.close();
    onClose();
  };
  const handleAssign = () => {
    if (!selectedUser) return;

    onAssign(selectedUser);
    setQuery("");
    setSelectedUser(null);
    close();
  };

  useEffect(() => {
    (document.getElementById("assign-user-dialog") as HTMLDialogElement)?.showModal();
  }, []);

  return (
    <>
      {/* Dialog */}
      <dialog id="assign-user-dialog" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Assign Task To</h3>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 opacity-50" size={18} />
            <input
              type="text"
              placeholder="Search by email or username"
              className="input input-bordered w-full pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* User Results */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {users.length === 0 && query && <p className="text-sm opacity-60">No users found</p>}

            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user as AssignUser)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border
                ${
                  selectedUser?.id === user.id
                    ? "border-primary bg-primary/10"
                    : "border-base-200 hover:bg-base-200"
                }`}
              >
                <img
                  src={user.profilePhoto ?? DEFAULT_PROFILE_PHOTO}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm opacity-70">
                    @{user.username} • {user.email}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={close}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={!selectedUser} onClick={handleAssign}>
              Assign
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default AssignToDialog;
