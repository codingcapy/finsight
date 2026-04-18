import { type DeserializedPlan as Plan } from "../lib/api/types";
import { useUpdateYearOfBirthMutation } from "../lib/api/plans";
import { birthYears, countries } from "../lib/utils";

export function YearsDropdown(props: { plan: Plan }) {
  const { mutate: updateYearOfBirth, isPending: updateYearOfBirthPending } =
    useUpdateYearOfBirthMutation();

  function handleUpdateYearOfBirth(y: string) {
    if (updateYearOfBirthPending) return;
    updateYearOfBirth({ planId: props.plan.planId, yearOfBirth: y });
  }

  return (
    <div className="absolute top-8 left-[32%] border border-[#a0a0a0] bg-[#303030] custom-scrollbar h-[150px] overflow-y-auto z-[120]">
      {birthYears.map((y) => (
        <div
          onClick={() => handleUpdateYearOfBirth(y)}
          className="pl-1 pr-5 cursor-pointer hover:bg-[#222222] transition-all ease-in-out duration-300"
        >
          {y}
        </div>
      ))}
    </div>
  );
}
