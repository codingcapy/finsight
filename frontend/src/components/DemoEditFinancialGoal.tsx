import { format } from "date-fns";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { DayPicker, MonthChangeEventHandler } from "react-day-picker";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { MONTHS, YEARS } from "../lib/utils";

export function DemoEditFinancialGoal(props: {
  financialGoal: {
    financialGoalId: string;
    planId: string;
    name: string;
    amount: number;
    target: Date;
  };
  targetDate: Date;
  setTargetDate: Dispatch<SetStateAction<Date>>;
  showCalendar: boolean;
  setShowCalendar: (value: SetStateAction<boolean>) => void;
  handleSubmitEditFinancialGoal: (e: FormEvent<HTMLFormElement>) => void;
  setEditFinancialGoalPointer: (value: SetStateAction<string>) => void;
}) {
  const [nameContent, setNameContent] = useState(props.financialGoal.name);
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    props.financialGoal.target,
  );
  const [amountContent, setAmountContent] = useState(
    props.financialGoal.amount,
  );

  function handleMonthDropdown(e: React.ChangeEvent<HTMLSelectElement>) {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(parseInt(e.target.value));
    setCalendarMonth(newMonth);
  }

  function handleYearDropdown(e: React.ChangeEvent<HTMLSelectElement>) {
    const newMonth = new Date(calendarMonth);
    newMonth.setFullYear(parseInt(e.target.value));
    setCalendarMonth(newMonth);
  }

  return (
    <form onSubmit={props.handleSubmitEditFinancialGoal} className="my-2">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-2">
        <div className="xl:w-[33%]">
          <div className="xl:hidden w-[100px] inline-block">Name:</div>
          <input
            type="text"
            name="financialgoalname"
            value={nameContent}
            onChange={(e) => setNameContent(e.target.value)}
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="xl:w-[33%]">
          <div className="xl:hidden w-[100px] inline-block">Amount:</div>
          <input
            type="number"
            step="any"
            name="financialgoalamount"
            value={amountContent}
            onChange={(e) => setAmountContent(e.target.valueAsNumber)}
            required
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="xl:w-[33%] relative">
          <div className="xl:hidden w-[100px] inline-block">Target Date:</div>
          <div
            onClick={() => props.setShowCalendar(!props.showCalendar)}
            className="inline-block px-2 border border-[#777777] rounded w-[100px] text-left cursor-pointer"
          >
            {format(props.targetDate, "yyyy-MM-dd")}
          </div>
          {props.showCalendar && (
            <div className="absolute bottom-[10px] md:bottom-[25px] md:right-[200px] scale-75">
              <div className="text-xs bg-[#404040] p-2">
                <div className="flex justify-between items-center gap-1 px-1 pb-2">
                  <select
                    value={calendarMonth.getMonth()}
                    onChange={handleMonthDropdown}
                    className="bg-[#555555] text-white text-xs rounded px-1 py-0.5 cursor-pointer"
                  >
                    {MONTHS.map((month, i) => (
                      <option key={month} value={i}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={calendarMonth.getFullYear()}
                    onChange={handleYearDropdown}
                    className="bg-[#555555] text-white text-xs rounded px-1 py-0.5 cursor-pointer"
                  >
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <DayPicker
                  mode="single"
                  selected={props.targetDate}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth as MonthChangeEventHandler}
                  onSelect={(date) => {
                    props.setTargetDate(date || new Date());
                    props.setShowCalendar(false);
                  }}
                  classNames={{ caption: "hidden" }}
                />
              </div>
            </div>
          )}
        </div>
        <button className="w-[35px] cursor-pointer text-green-500 flex items-center justify-center">
          <FaCheck />
        </button>
        <div
          onClick={() => props.setEditFinancialGoalPointer("none")}
          className="w-[35px] cursor-pointer text-red-500 flex items-center justify-center"
        >
          <FaXmark />
        </div>
      </div>
    </form>
  );
}
