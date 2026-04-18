import { FormEvent, SetStateAction, useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";

export function DemoEditLiability(props: {
  liability: {
    liabilityId: string;
    planId: string;
    name: string;
    amount: number;
    interest: number;
  };
  handleSubmitEditLiability: (e: FormEvent<HTMLFormElement>) => void;
  setEditLiabilityPointer: (value: SetStateAction<string>) => void;
}) {
  const [nameContent, setNameContent] = useState(props.liability.name);
  const [amountContent, setAmountContent] = useState(props.liability.amount);
  const [interestContent, setInterestContent] = useState(
    props.liability.interest,
  );

  return (
    <form onSubmit={props.handleSubmitEditLiability} className="my-2">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-2">
        <div className="xl:w-[50%]">
          <div className="xl:hidden w-[100px] inline-block">Name:</div>
          <input
            type="text"
            name="liabilityname"
            value={nameContent}
            onChange={(e) => setNameContent(e.target.value)}
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="xl:w-[50%]">
          <div className="xl:hidden w-[100px] inline-block">Amount:</div>
          <input
            type="number"
            step="any"
            name="liabilityamount"
            value={amountContent}
            onChange={(e) => setAmountContent(e.target.valueAsNumber)}
            required
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="xl:w-[50%]">
          <div className="xl:hidden w-[100px] inline-block">Interest %:</div>
          <input
            type="number"
            step="any"
            name="liabilityinterest"
            value={interestContent}
            onChange={(e) => setInterestContent(e.target.valueAsNumber)}
            required
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <button className="w-[35px] cursor-pointer text-green-500 flex items-center justify-center">
          <FaCheck />
        </button>
        <div
          onClick={() => props.setEditLiabilityPointer("none")}
          className="w-[35px] cursor-pointer text-red-500 flex items-center justify-center"
        >
          <FaXmark />
        </div>
      </div>
    </form>
  );
}
