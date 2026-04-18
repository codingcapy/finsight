import { SetStateAction, useState } from "react";
import { useCreateIncomeMutation } from "../lib/api/incomes";
import { type DeserializedPlan as Plan } from "../lib/api/types";

export function CreateIncome(props: {
  plan: Plan;
  setCreateIncomeMode: (value: SetStateAction<boolean>) => void;
}) {
  const { mutate: createIncome, isPending: createIncomePending } =
    useCreateIncomeMutation();
  const [notification, setNotification] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (createIncomePending) return;
    const company = (e.target as HTMLFormElement).company.value;
    const position = (e.target as HTMLFormElement).position.value;
    const amount = Math.round(
      parseFloat((e.target as HTMLFormElement).amount.value) * 100,
    );
    const tax = Math.round(
      parseFloat((e.target as HTMLFormElement).tax.value) * 100,
    );
    createIncome(
      { planId: props.plan.planId, company, position, amount, tax },
      {
        onSuccess: () => {
          props.setCreateIncomeMode(false);
        },
        onError: (errorMessage) => setNotification(errorMessage.toString()),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="my-2">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-2">
        <div className="xl:w-[25%]">
          <div className="xl:hidden w-[100px] inline-block">Company:</div>
          <input
            type="text"
            name="company"
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="xl:w-[25%]">
          <div className="xl:hidden w-[100px] inline-block">Position:</div>
          <input
            type="text"
            name="position"
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="xl:w-[25%]">
          <div className="xl:hidden w-[100px] inline-block">Amount:</div>
          <input
            type="number"
            step="any"
            name="amount"
            required
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="xl:w-[25%]">
          <div className="xl:hidden w-[100px] inline-block">Tax %:</div>
          <input
            type="number"
            step="any"
            name="tax"
            required
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="w-[70px]"></div>
      </div>
      <div className="flex mt-2">
        <div
          onClick={() => props.setCreateIncomeMode(false)}
          className="cursor-pointer py-1 px-2 mr-1 bg-[#777777] rounded"
        >
          Cancel
        </div>
        <button className="cursor-pointer py-1 px-2 ml-1 bg-cyan-500 rounded">
          Create
        </button>
      </div>
      <div>{notification}</div>
    </form>
  );
}
