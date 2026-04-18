import { type DeserializedPlan as Plan } from "../lib/api/types";
import { useUpdateCurrencyMutation } from "../lib/api/plans";
import { currencySymbols } from "../lib/utils";

export function CurrencyComponent(props: { plan: Plan }) {
  const { mutate: updateCurrency, isPending: updateCurrencyPending } =
    useUpdateCurrencyMutation();

  return (
    <div className="absolute top-12 left-23.5 border border-[#a0a0a0] bg-[#303030] custom-scrollbar h-[200px] overflow-y-auto">
      {currencySymbols.map((s) => (
        <div
          onClick={() => {
            if (updateCurrencyPending) return;
            updateCurrency({ planId: props.plan.planId, currency: s });
          }}
          className="pl-1 pr-5 cursor-pointer hover:bg-[#222222] transition-all ease-in-out duration-300"
        >
          {s}
        </div>
      ))}
    </div>
  );
}
