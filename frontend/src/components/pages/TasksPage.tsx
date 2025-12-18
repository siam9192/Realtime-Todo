import CreatedTasks from "../sections/CreatedTasks";
import AssignedTasks from "../sections/AssignedTasks";
import OverdueTasks from "../sections/OverdueTasks";
import CreateTaskModal from "../ui/CreateTaskModal";

export default function TasksPage() {
  return (
    <div className=" mx-auto space-y-10">
      <CreateTaskModal />
      <CreatedTasks />
      <AssignedTasks />
      <OverdueTasks />
    </div>
  );
}
