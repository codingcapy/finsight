import { SetStateAction, FormEvent, useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";

export function DemoEditIncome(props: {
  income: {
    incomeId: string;
    planId: string;
    company: string;
    position: string;
    amount: number;
    tax: number;
  };
  handleSubmitEditIncome: (e: FormEvent<HTMLFormElement>) => void;
  setEditIncomePointer: (value: SetStateAction<string>) => void;
}) {
  const [companyContent, setCompanyContent] = useState(props.income.company);
  const [positionContent, setPositionContent] = useState(props.income.position);
  const [amountContent, setAmountContent] = useState(props.income.amount);
  const [taxContent, setTaxContent] = useState(props.income.tax);

  return (
    <form onSubmit={props.handleSubmitEditIncome} className="my-2">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-2">
        <div className="xl:w-[25%]">
          <div className="xl:hidden w-[100px] inline-block">Company:</div>
          <input
            type="text"
            name="company"
            value={companyContent}
            onChange={(e) => setCompanyContent(e.target.value)}
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="xl:w-[25%]">
          <div className="xl:hidden w-[100px] inline-block">Position:</div>
          <input
            type="text"
            name="position"
            value={positionContent}
            onChange={(e) => setPositionContent(e.target.value)}
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="xl:w-[25%]">
          <div className="xl:hidden w-[100px] inline-block">Amount:</div>
          <input
            type="number"
            step="any"
            name="amount"
            value={amountContent}
            onChange={(e) => setAmountContent(e.target.valueAsNumber)}
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
            value={taxContent}
            onChange={(e) => setTaxContent(e.target.valueAsNumber)}
            required
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <button className="w-[35px] cursor-pointer text-green-500 flex items-center justify-center">
          <FaCheck />
        </button>
        <div
          onClick={() => props.setEditIncomePointer("none")}
          className="w-[35px] cursor-pointer text-red-500 flex items-center justify-center"
        >
          <FaXmark />
        </div>
      </div>
    </form>
  );
}
