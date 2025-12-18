import type { Metadata } from "../../types";
import { UserCheck, AlertCircle, ClipboardList } from "lucide-react";
import MetadataCard from "../card/MetadataCard";
import { useGetUserGlobalMetadataQuery } from "../../query/services/metadata.service";

function GlobalOverview() {
  const { data: resData } = useGetUserGlobalMetadataQuery();
  const data = resData?.data;
  const metadata: Metadata[] = [
    {
      label: "Created Tasks",
      value: data?.totalCreatedTasks ?? 0,
      icon: ClipboardList,
    },
    {
      label: "Assigned Tasks",
      value: data?.totalAssignedTasks ?? 0,
      icon: UserCheck,
    },
    {
      label: "Overdue Tasks",
      value: data?.totalOverdueTasks ?? 0,
      icon: AlertCircle,
    },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-10">
      {metadata.map((data, index) => (
        <MetadataCard data={data} key={index} />
      ))}
    </div>
  );
}

export default GlobalOverview;
