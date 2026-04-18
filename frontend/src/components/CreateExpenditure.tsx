import { SetStateAction, useState } from "react";
import { useCreateExpenditureMutation } from "../lib/api/expenditures";
import { type DeserializedPlan as Plan } from "../lib/api/types";

export function CreateExpenditure(props: {
  plan: Plan;
  setCreateExpenditureMode: (value: SetStateAction<boolean>) => void;
}) {
  const { mutate: createExpenditure, isPending: createExpenditurePending } =
    useCreateExpenditureMutation();
  const [notification, setNotification] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (createExpenditurePending) return;
    const expenditurename = (e.target as HTMLFormElement).expenditurename.value;
    const amount = Math.round(
      parseFloat((e.target as HTMLFormElement).expenditureamount.value) * 100,
    );
    createExpenditure(
      {
        planId: props.plan.planId,
        name: expenditurename,
        amount: amount,
      },
      {
        onSuccess: () => props.setCreateExpenditureMode(false),
        onError: (errorMessage) => setNotification(errorMessage.toString()),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="my-2">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-2">
        <div className="xl:w-[50%]">
          <div className="xl:hidden w-25 inline-block">Name:</div>
          <input
            type="text"
            name="expenditurename"
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="xl:w-[50%]">
          <div className="xl:hidden w-25 inline-block">Amount (Monthly):</div>
          <input
            type="number"
            step="any"
            name="expenditureamount"
            required
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="w-17.5"></div>
      </div>
      <div className="flex mt-2">
        <div
          onClick={() => props.setCreateExpenditureMode(false)}
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
