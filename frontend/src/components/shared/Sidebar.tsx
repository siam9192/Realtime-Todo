import { Home, ListChecks, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserLogoutMutation } from "../../query/services/auth.service";
import { queryClient } from "../../App";

function Sidebar() {
  const menuItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Tasks", icon: ListChecks, path: "/tasks" },
    { label: "Edit Profile", icon: User, path: "/edit-profile" },
    // { label: "Overdue", icon: AlertTriangle, path: "/tasks/overdue" },
    // { label: "Teams", icon: Users, path: "/teams" },
  ];

  const {mutate} = useUserLogoutMutation()
  

  const logout = ()=>{
    mutate(undefined,{
      onSuccess:()=>{
        console.log(11)
        queryClient.invalidateQueries({ queryKey: ["getCurrentUser"] });
         
      
      }
    })
  }


  return (
    <aside className=" bg-base-100 dark:bg-base-200 border-r border-base-300 flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-base-300">
        <h2 className="text-lg font-semibold">Welcome 👋</h2>
        <p className="text-sm opacity-70">Task Dashboard</p>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="menu menu-md w-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link to={item.path} className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-base-300 space-y-2">
        <button onClick={logout} className="btn btn-ghost btn-sm w-full justify-start gap-3 text-error">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
