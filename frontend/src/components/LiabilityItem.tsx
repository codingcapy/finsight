import { MdModeEditOutline } from "react-icons/md";
import { type DeserializedLiability as Liability } from "../lib/api/types";
import { FaCheck, FaTrashCan, FaXmark } from "react-icons/fa6";
import {
  useDeleteLiabilityMutation,
  useUpdateLiabilityMutation,
} from "../lib/api/liabilities";
import { useState } from "react";

export function LiabilityItem(props: { liability: Liability }) {
  const [editMode, setEditMode] = useState(false);
  const { mutate: deleteLiability, isPending: deleteLiabilityPending } =
    useDeleteLiabilityMutation();
  const { mutate: updateLiability, isPending: updateLiabilityPending } =
    useUpdateLiabilityMutation();
  const [nameContent, setNameContent] = useState(props.liability.name);
  const [amountContent, setAmountContent] = useState(
    props.liability.amount / 100,
  );
  const [interestContent, setInterestContent] = useState(
    props.liability.interest,
  );
  const [notification, setNotification] = useState("");

  function handleSubmitEditLiability(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (updateLiabilityPending) return;
    updateLiability(
      {
        liabilityId: props.liability.liabilityId,
        name: nameContent,
        amount: Math.round(amountContent * 100),
        interest: Math.round(interestContent * 100),
      },
      {
        onSuccess: () => setEditMode(false),
        onError: (errorMessage) => setNotification(errorMessage.toString()),
      },
    );
  }

  function handleSubmitDeleteLiability() {
    if (deleteLiabilityPending) return;
    deleteLiability({ liabilityId: props.liability.liabilityId });
  }

  return (
    <div>
      {editMode ? (
        <form onSubmit={handleSubmitEditLiability} className="my-2">
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
              <div className="xl:hidden w-[100px] inline-block">
                Interest %:
              </div>
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
              onClick={() => setEditMode(false)}
              className="w-[35px] cursor-pointer text-red-500 flex items-center justify-center"
            >
              <FaXmark />
            </div>
          </div>
          <div>{notification}</div>
        </form>
      ) : (
        <div className="flex justify-between my-2">
          <div className="w-[33%]">{props.liability.name}</div>
          <div className="w-[33%]">
            $
            {(props.liability.amount / 100).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="w-[33%]">{props.liability.interest / 100}</div>
          <MdModeEditOutline
            onClick={() => setEditMode(true)}
            size={20}
            className="w-8.75 cursor-pointer"
          />
          <FaTrashCan
            onClick={handleSubmitDeleteLiability}
            size={20}
            className="text-red-400 w-8.75 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
