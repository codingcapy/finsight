import { useEffect, useRef, useState } from "react";
import useAuthStore from "../store/AuthStore";
import logo from "/capyness.png";
import { PiCaretDownBold } from "react-icons/pi";
import {
  getPlanByIdQueryOptions,
  getPlansQueryOptions,
  useCreatePlanMutation,
} from "../lib/api/plans";
import { useQuery } from "@tanstack/react-query";
import { useUpdateCurrentPlanMutation } from "../lib/api/users";

export function LeftNav() {
  const { user } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const {
    data: plans,
    isLoading: plansLoading,
    error: plansError,
  } = useQuery(getPlansQueryOptions());
  const { mutate: createPlan, isPending: createPlanPending } =
    useCreatePlanMutation();
  const [notification, setNotification] = useState("");
  const {
    data: plan,
    isLoading: planLoading,
    error: planError,
  } = useQuery(getPlanByIdQueryOptions((user && user.currentPlan) || 0));
  const { mutate: updateCurrentPlan, isPending: updateCurrentPlanPending } =
    useUpdateCurrentPlanMutation();

  function handleClickOutside(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (createPlanPending) return;
    const title = (e.target as HTMLFormElement).plantitle.value;
    if (title.length > 400) return setNotification("Title is too long!");
    createPlan(
      { title },
      {
        onSuccess: () => {
          setShowCreatePlanModal(false);
        },
        onError: (errorMessage) => setNotification(errorMessage.toString()),
      },
    );
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;
    if (plans && plans.length < 1)
      createPlan({ title: `${user && user.username}'s plan` });
    if (user.currentPlan === 0)
      updateCurrentPlan({ currentPlan: plans ? plans[0].planId : 0 });
  }, [plans]);

  return (
    <div className="fixed top-0 left-0 h-screen bg-[#101010] w-[250px] z-110 md:z-90">
      <div className="flex items-center px-5 pt-16 md:pt-5 mb-5">
        <img src={logo} alt="" className="w-[25px]" />
        <div className="ml-2 text-lg">FinSight</div>
      </div>
      <div className="px-5">Financial Plan</div>
      <div
        ref={menuRef}
        onClick={() => setShowDropdown(!showDropdown)}
        className="border border-[#555555] rounded m-2 px-3 py-2 flex cursor-pointer hover:bg-[#202020] transition-all ease-in-out duration-300"
      >
        <div className="w-[175px] line-clamp-1">
          {planLoading ? (
            <div>Loading...</div>
          ) : planError ? (
            <div>Error loading plan</div>
          ) : plan ? (
            plan.title
          ) : (
            <div></div>
          )}
        </div>
        <div className="ml-5 mt-1">
          <PiCaretDownBold />
        </div>
      </div>
      {showDropdown && (
        <div className="custom-scrollbar relative bg-[#303030] rounded m-2 px-3 py-2 max-h-[175px] overflow-y-auto">
          <div className="py-1 cursor-pointer hover:text-cyan-500 transition-all ease-in-out duration-300"></div>
          {plansLoading ? (
            <div>Loading plans...</div>
          ) : plansError ? (
            <div>Error loading plans</div>
          ) : plans ? (
            plans.map((p) => (
              <div
                onClick={() => updateCurrentPlan({ currentPlan: p.planId })}
                key={p.planId}
                className="py-2 cursor-pointer hover:text-cyan-500 transition-all ease-in-out duration-300"
              >
                {p.title}
              </div>
            ))
          ) : (
            <div></div>
          )}
          <div
            onClick={() => setShowCreatePlanModal(!showCreatePlanModal)}
            className="sticky py-1 bottom-0 bg-[#303030] cursor-pointer hover:text-cyan-500 transition-all ease-in-out duration-300"
          >
            + create new plan
          </div>
        </div>
      )}
      {showCreatePlanModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#222222] p-6 rounded shadow-lg w-[90%] max-w-md text-center z-1000">
          <div className="text-xl font-bold mb-5">
            Create a new financial plan
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label htmlFor="" className="text-left mb-2">
              Financial plan name
            </label>
            <input
              type="text"
              name="plantitle"
              id="plantitle"
              className="border border-[#909090] rounded p-1 mb-2"
              required
            />
            <div className="flex justify-end">
              <div
                onClick={() => setShowCreatePlanModal(false)}
                className="px-3 py-1 mx-1 cursor-pointer"
              >
                CANCEL
              </div>
              <button
                type="submit"
                className="px-3 py-1 mx-1 bg-cyan-500 rounded"
              >
                {createPlanPending ? "Creating..." : "CREATE"}
              </button>
            </div>
          </form>
        </div>
      )}
      {showCreatePlanModal && (
        <div className="fixed inset-0 bg-black opacity-50 z-900"></div>
      )}
    </div>
  );
}
