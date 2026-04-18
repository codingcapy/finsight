import { FaCheck, FaTrashCan, FaXmark } from "react-icons/fa6";
import { type DeserializedExpenditure as Expenditure } from "../lib/api/types";
import { MdModeEditOutline } from "react-icons/md";
import { useState } from "react";
import {
  useDeleteExpenditureMutation,
  useUpdateExpenditureMutation,
} from "../lib/api/expenditures";

export function ExpenditureItem(props: { expenditure: Expenditure }) {
  const [editMode, setEditMode] = useState(false);
  const [nameContent, setNameContent] = useState(props.expenditure.name);
  const [amountContent, setAmountContent] = useState(
    props.expenditure.amount / 100,
  );
  const { mutate: deleteExpenditure, isPending: deleteExpenditurePending } =
    useDeleteExpenditureMutation();
  const { mutate: updateExpenditure, isPending: updateExpenditurePending } =
    useUpdateExpenditureMutation();
  const [notification, setNotification] = useState("");

  function handleSubmitEditExpenditure(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (updateExpenditurePending) return;
    updateExpenditure(
      {
        expenditureId: props.expenditure.expenditureId,
        name: nameContent,
        amount: Math.round(amountContent * 100),
      },
      {
        onSuccess: () => setEditMode(false),
        onError: (errorMessage) => setNotification(errorMessage.toString()),
      },
    );
  }

  function handleSubmitDeleteExpenditure() {
    if (deleteExpenditurePending) return;
    deleteExpenditure({ expenditureId: props.expenditure.expenditureId });
  }

  return (
    <div>
      {editMode ? (
        <form onSubmit={handleSubmitEditExpenditure} className="my-2">
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
              onClick={() => setEditMode(false)}
              className="w-[35px] cursor-pointer text-red-500 flex items-center justify-center"
            >
              <FaXmark />
            </div>
          </div>
          <div>{notification}</div>
        </form>
      ) : (
        <div
          key={props.expenditure.expenditureId}
          className="flex justify-between my-2"
        >
          <div className="w-[50%]">{props.expenditure.name}</div>
          <div className="w-[50%]">
            $
            {(props.expenditure.amount / 100).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <MdModeEditOutline
            onClick={() => setEditMode(true)}
            size={20}
            className="w-8.75 cursor-pointer"
          />
          <FaTrashCan
            onClick={handleSubmitDeleteExpenditure}
            size={20}
            className="text-red-400 w-8.75 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
