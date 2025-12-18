import { useEffect, useState } from "react";
import FilterModal, { type TaskFilterValues } from "./FilterModal";

const sortOptions = [
  { label: "Created Date", value: "createdAt" },
  { label: "Due Date", value: "dueDate" },
];

interface Data extends TaskFilterValues {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface Props {
  onChange?: (values: Data) => void;
}

function FilterBox({ onChange }: Props) {
  const [sortBy, setSortBy] = useState(sortOptions[0].value);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterValues, setFilterValues] = useState<TaskFilterValues>({});

  useEffect(() => {
    onChange &&
      onChange({
        sortBy,
        sortOrder,
        ...filterValues,
      });
  }, [sortBy, sortOrder, filterValues]);

  return (
    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-4">
      {/* Sort By */}
      <div className="flex items-center gap-2">
        <label htmlFor="sortBy" className="text-sm font-medium">
          Sort By:
        </label>

        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select select-bordered select-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Sort Order */}
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
        >
          {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>

      {/* Filter */}
      <FilterModal onApply={setFilterValues} />
    </div>
  );
}

export default FilterBox;
