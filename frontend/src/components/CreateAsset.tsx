import { SetStateAction, useState } from "react";
import { useCreateAssetMutation } from "../lib/api/assets";
import { type DeserializedPlan as Plan } from "../lib/api/types";

export function CreateAsset(props: {
  plan: Plan;
  setCreateAssetMode: (value: SetStateAction<boolean>) => void;
}) {
  const { mutate: createAsset, isPending: createAssetPending } =
    useCreateAssetMutation();
  const [notification, setNotification] = useState("");

  function handleSubmitCreateAsset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (createAssetPending) return;
    createAsset(
      {
        planId: props.plan.planId,
        name: (e.target as HTMLFormElement).assetname.value,
        value: Math.round(
          parseFloat((e.target as HTMLFormElement).assetvalue.value) * 100,
        ),
        roi: Math.round(
          parseFloat((e.target as HTMLFormElement).roi.value) * 100,
        ),
      },
      {
        onSuccess: () => props.setCreateAssetMode(false),
        onError: (errorMessage) => setNotification(errorMessage.toString()),
      },
    );
  }

  return (
    <form onSubmit={handleSubmitCreateAsset} className="my-2">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-2">
        <div className="xl:w-[33%]">
          <div className="xl:hidden w-[100px] inline-block">Name:</div>
          <input
            type="text"
            name="assetname"
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="xl:w-[33%]">
          <div className="xl:hidden w-[100px] inline-block">Value:</div>
          <input
            type="number"
            step="any"
            name="assetvalue"
            required
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="xl:w-[33%]">
          <div className="xl:hidden w-[100px] inline-block">
            Return on investment %:
          </div>
          <input
            type="number"
            step="any"
            name="roi"
            required
            className="px-2 border border-[#777777] rounded"
          />
        </div>
        <div className="w-[70px]"></div>
      </div>
      <div className="flex mt-2">
        <div
          onClick={() => props.setCreateAssetMode(false)}
          className="cursor-pointer py-1 px-2 mr-1 bg-[#777777] rounded"
        >
          Cancel
        </div>
        <button className="cursor-pointer py-1 px-2 ml-1 bg-cyan-500 rounded">
          Create
        </button>
      </div>
      {notification}
    </form>
  );
}
