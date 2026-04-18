import { type DeserializedGeneration as Generation } from "../lib/api/types";
import ReactMarkdown from "react-markdown";
import { FaEllipsisVertical, FaTrashCan } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { useDeleteGenerationMutation } from "../lib/api/generations";

export function GenerationItem(props: { g: Generation }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { mutate: deleteGeneration, isPending: deleteGenerationPending } =
    useDeleteGenerationMutation();
  const [deleteMode, setDeleteMode] = useState(false);

  function handleSubmitDeleteGeneration() {
    if (deleteGenerationPending) return;
    deleteGeneration({ generationId: props.g.generationId });
  }

  function handleClickOutside(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div key={props.g.generationId} className="relative mb-5">
      <div className="flex justify-between">
        <div className="text-xl text-cyan-500 font-bold mb-1">
          AI Recommendation generated on {props.g.createdAt.toLocaleString()}
        </div>
        <div
          ref={menuRef}
          onClick={() => setShowMenu(!showMenu)}
          className="px-5"
        >
          <FaEllipsisVertical size={20} className="cursor-pointer" />
        </div>
      </div>
      <div className="prose prose-invert max-w-none text-sm leading-snug prose-headings:mb-2 prose-headings:mt-3 prose-p:mb-2 prose-li:mb-1 prose-ul:mb-2 prose-h1:text-lg prose-h2:text-base prose-h3:text-base prose-h4:text-base">
        <ReactMarkdown>{props.g.content}</ReactMarkdown>
      </div>
      {showMenu && (
        <div className="absolute top-5 right-0 p-5 bg-[#303030] shadow-lg">
          <div
            onClick={() => setDeleteMode(true)}
            className="flex text-red-400 cursor-pointer"
          >
            <FaTrashCan size={20} className="w-8.75 cursor-pointer" />
            <div>Delete</div>
          </div>
        </div>
      )}
      {deleteMode && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#222222] p-6 rounded shadow-lg w-[90%] max-w-md text-center z-100`}
        >
          <div className="text-2xl font-bold">Delete Generation?</div>
          <div className="my-5">
            Once you delete this generation, it can’t be restored.
          </div>
          <div className="my-5 flex justify-end">
            <div
              onClick={handleSubmitDeleteGeneration}
              className="p-2 mr-1 bg-red-500 rounded text-white bold secondary-font font-bold cursor-pointer"
            >
              {deleteGenerationPending ? "Deleting..." : "DELETE"}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setDeleteMode(false);
              }}
              className="p-2 ml-1 bg-[#5c5c5c] rounded bold secondary-font font-bold cursor-pointer"
            >
              CANCEL
            </div>
          </div>
        </div>
      )}
      {deleteMode && (
        <div className="fixed inset-0 bg-black opacity-50 z-90"></div>
      )}
    </div>
  );
}
