import { FormEvent, SetStateAction, useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";

export function DemoEditAsset(props: {
  asset: {
    assetId: string;
    planId: string;
    name: string;
    value: number;
    roi: number;
  };
  handleSubmitEditAsset: (e: FormEvent<HTMLFormElement>) => void;
  setEditAssetPointer: (value: SetStateAction<string>) => void;
}) {
  const [nameContent, setNameContent] = useState(props.asset.name);
  const [valueContent, setValueContent] = useState(props.asset.value);
  const [roiContent, setRoiContent] = useState(props.asset.roi);

  return (
    <form onSubmit={props.handleSubmitEditAsset} className="my-2">
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
          onClick={() => props.setEditAssetPointer("none")}
          className="w-[35px] cursor-pointer text-red-500 flex items-center justify-center"
        >
          <FaXmark />
        </div>
      </div>
    </form>
  );
}
