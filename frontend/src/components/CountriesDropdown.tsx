import { type DeserializedPlan as Plan } from "../lib/api/types";
import { useUpdateLocationMutation } from "../lib/api/plans";
import { countries } from "../lib/utils";

export function CountriesDropdown(props: { plan: Plan }) {
  const { mutate: updateLocation, isPending: updateLocationPending } =
    useUpdateLocationMutation();

  function handleUpdateLocation(l: string) {
    if (updateLocationPending) return;
    updateLocation({ planId: props.plan.planId, location: l });
  }

  return (
    <div className="absolute top-8 left-[32%] border border-[#a0a0a0] bg-[#303030] custom-scrollbar h-[150px] overflow-y-auto">
      {countries.map((c) => (
        <div
          onClick={() => handleUpdateLocation(c)}
          className="pl-1 pr-5 cursor-pointer hover:bg-[#222222] transition-all ease-in-out duration-300"
        >
          {c}
        </div>
      ))}
    </div>
  );
}
