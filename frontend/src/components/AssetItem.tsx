import { MdModeEditOutline } from "react-icons/md";
import { type DeserializedAsset as Asset } from "../lib/api/types";
import { FaCheck, FaTrashCan, FaXmark } from "react-icons/fa6";
import {
  useDeleteAssetMutation,
  useUpdateAssetMutation,
} from "../lib/api/assets";
import { useState } from "react";

export function AssetItem(props: { asset: Asset }) {
  const [editMode, setEditMode] = useState(false);
  const { mutate: deleteAsset, isPending: deleteAssetPending } =
    useDeleteAssetMutation();
  const { mutate: updateAsset, isPending: updateAssetPending } =
    useUpdateAssetMutation();
  const [nameContent, setNameContent] = useState(props.asset.name);
  const [valueContent, setValueContent] = useState(props.asset.value / 100);
  const [roiContent, setRoiContent] = useState(props.asset.roi / 100);
  const [notification, setNotification] = useState("");

  function handleSubmitEditAsset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (updateAssetPending) return;
    updateAsset(
      {
        assetId: props.asset.assetId,
        name: nameContent,
        value: Math.round(valueContent * 100),
        roi: Math.round(roiContent * 100),
      },
      {
        onSuccess: () => setEditMode(false),
        onError: (errorMessage) => setNotification(errorMessage.toString()),
      },
    );
  }

  function handleSubmitDeleteAsset() {
    if (deleteAssetPending) return;
    deleteAsset({ assetId: props.asset.assetId });
  }

  return (
    <div>
      {editMode ? (
        <form onSubmit={handleSubmitEditAsset} className="my-2">
          <div className="flex flex-col xl:flex-row xl:justify-between gap-2">
            <div className="xl:w-[50%]">
              <div className="xl:hidden w-[100px] inline-block">Name:</div>
              <input
                type="text"
                name="assetname"
                value={nameContent}
                onChange={(e) => setNameContent(e.target.value)}
                className="px-2 border border-[#777777] rounded"
              />
            </div>
            <div className="xl:w-[50%]">
              <div className="xl:hidden w-[100px] inline-block">Value:</div>
              <input
                type="number"
                step="any"
                name="assetvalue"
                value={valueContent}
                onChange={(e) => setValueContent(e.target.valueAsNumber)}
                required
                className="px-2 border border-[#777777] rounded"
              />
            </div>
            <div className="xl:w-[50%]">
              <div className="xl:hidden w-[100px] inline-block">
                Return on Investment:
              </div>
              <input
                type="number"
                step="any"
                name="assetroi"
                value={roiContent}
                onChange={(e) => setRoiContent(e.target.valueAsNumber)}
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
          <div className="w-[33%]">{props.asset.name}</div>
          <div className="w-[33%]">
            $
            {(props.asset.value / 100).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="w-[33%]">{props.asset.roi / 100}</div>
          <MdModeEditOutline
            onClick={() => setEditMode(true)}
            size={20}
            className="w-8.75 cursor-pointer"
          />
          <FaTrashCan
            onClick={handleSubmitDeleteAsset}
            size={20}
            className="text-red-400 w-8.75 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
