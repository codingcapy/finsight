import { FormEvent, SetStateAction, useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";

export function DemoEditExpenditure(props: {
  expenditure: {
    expenditureId: string;
    planId: string;
    name: string;
    amount: number;
  };
  handleSubmitEditExpenditure: (e: FormEvent<HTMLFormElement>) => void;
  setEditExpenditurePointer: (value: SetStateAction<string>) => void;
}) {
  const [nameContent, setNameContent] = useState(props.expenditure.name);
  const [amountContent, setAmountContent] = useState(props.expenditure.amount);

  return (
    <form onSubmit={props.handleSubmitEditExpenditure} className="my-2">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-2">
        <div className="xl:w-[50%]">
          <div className="xl:hidden w-[100px] inline-block">Name:</div>
          <input
            type="text"
            name="expenditurename"
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
            name="expenditureamount"
            value={amountContent}
            onChange={(e) => setAmountContent(e.target.valueAsNumber)}
            required
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <button className="w-[35px] cursor-pointer text-green-500 flex items-center justify-center">
          <FaCheck />
        </button>
        <div
          onClick={() => props.setEditExpenditurePointer("none")}
          className="w-[35px] cursor-pointer text-red-500 flex items-center justify-center"
        >
          <FaXmark />
        </div>
      </div>
    </form>
  );
}
