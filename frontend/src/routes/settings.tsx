import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../store/AuthStore";
import { PiCaretDownBold } from "react-icons/pi";
import {
  getPlanByIdQueryOptions,
  getPlansQueryOptions,
  useCreatePlanMutation,
  useDeletePlanMutation,
  useUpdatePlanMutation,
} from "../lib/api/plans";
import { useQuery } from "@tanstack/react-query";
import {
  useUpdateCurrentPlanMutation,
  useUpdatePasswordMutation,
} from "../lib/api/users";
import { FaArrowLeft, FaCheck, FaXmark } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, logoutService } = useAuthStore();
  const navigate = useNavigate();
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
  const [showMenu, setShowMenu] = useState(false);
  const topMenuRef = useRef<HTMLDivElement | null>(null);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [editPlanTitleMode, setEditPlanTitleMode] = useState(false);
  const [planTitleContent, setplanTitleContent] = useState("");
  const { mutate: updatePassword, isPending: updatePasswordPending } =
    useUpdatePasswordMutation();
  const [passwordNotification, setPasswordNotification] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const { mutate: deletePlan, isPending: deletePlanPending } =
    useDeletePlanMutation();
  const [deleteNotification, setDeleteNotification] = useState("");
  const { mutate: updatePlanTitle, isPending: updatePlanTitlePending } =
    useUpdatePlanMutation();
  const [showLeftNav, setShowLeftNav] = useState(
    window.innerWidth > 639 ? true : false,
  );

  function handleClickOutside(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  }

  function handleClickOutsideTopMenuRef(event: MouseEvent) {
    if (
      topMenuRef.current &&
      !topMenuRef.current.contains(event.target as Node)
    ) {
      setShowMenu(false);
    }
  }

  function handleSubmitCreateWorkspace(e: React.FormEvent<HTMLFormElement>) {
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

  function handleSubmitUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (updatePasswordPending) return;
    const password = (e.target as HTMLFormElement).password.value;
    updatePassword(
      { password },
      {
        onSuccess: () => {
          setEditPasswordMode(false);
          setPasswordNotification("Success!");
        },
        onError: (errorMessage) => setNotification(errorMessage.toString()),
      },
    );
  }

  function handleSubmitDeletePlan() {
    if (deletePlanPending) return;
    if (!plan) return;
    deletePlan(
      {
        planId: plan.planId,
      },
      {
        onSuccess: () => setDeleteMode(false),
        onError: (errorMessage) => setNotification(errorMessage.toString()),
      },
    );
  }

  function handleSubmitUpdatePlanTitle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (updatePlanTitlePending || !plan) return;
    updatePlanTitle(
      { planId: plan.planId, title: planTitleContent },
      {
        onSuccess: () => {
          setEditPlanTitleMode(false);
        },
        onError: (errorMessage) => setNotification(errorMessage.toString()),
      },
    );
  }

  useEffect(() => {
    if (!user) navigate({ to: "/" });
  }, [user]);

  useEffect(() => {
    if (!plan) return;
    setplanTitleContent(plan.title);
  }, [plan]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideTopMenuRef);
    return () =>
      document.removeEventListener("click", handleClickOutsideTopMenuRef);
  }, []);

  useEffect(() => {
    if (!user) return;
    if (plans && plans.length < 1)
      createPlan({ title: `${user && user.username}'s plan` });
    if (user.currentPlan === 0)
      updateCurrentPlan({ currentPlan: plans ? plans[0].planId : 0 });
  }, [plans]);

  return (
    <div className="bg-[#303030] text-white min-h-screen p-2">
      <div
        ref={topMenuRef}
        className="fixed top-0 left-0 bg-[#303030] px-5 py-2 w-screen flex justify-between z-120 sm:z-80"
      >
        <div>
          <GiHamburgerMenu
            size={25}
            onClick={() => setShowLeftNav(!showLeftNav)}
            className="sm:hidden"
          />
        </div>
        <div
          onClick={() => setShowMenu(!showMenu)}
          className="px-4 cursor-pointer"
        >
          {user && user.username}
        </div>
        {showMenu && (
          <div className="absolute top-[40px] right-5 bg-[#404040] rounded py-2">
            <Link
              to="/settings"
              className="px-5 py-2 cursor-pointer hover:text-cyan-500 transition-all ease-in-out duration-300"
            >
              Settings
            </Link>
            <div
              onClick={logoutService}
              className="px-5 py-2 cursor-pointer hover:text-cyan-500 transition-all ease-in-out duration-300"
            >
              Logout
            </div>
          </div>
        )}
      </div>
      {showLeftNav && (
        <div className="fixed top-0 left-0 h-screen bg-[#303030] w-[250px] z-110 sm:z-90">
          <div className="hover:text-cyan-500 transition-all ease-in-out duration-300 flex px-5 pt-16 sm:pt-5 mb-10">
            <Link to="/" className="flex justify-center items-center">
              <FaArrowLeft />
              <div className="pl-2">Back to dashboard</div>
            </Link>
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
              <form
                onSubmit={handleSubmitCreateWorkspace}
                className="flex flex-col"
              >
                <label htmlFor="" className="text-left mb-2">
                  Financial plan name
                </label>
                <input
                  type="text"
                  name="plantitle"
                  id="plantitle"
                  className="border border-[#909090] rounded p-1 mb-2"
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
      )}
      <div className="sm:pl-[300px] pt-16 sm:pt-7">
        <div className="text-4xl font-bold">Settings</div>
        <div className="mt-5 mb-10">
          <div className="text-2xl font-bold mb-2">Account</div>
          <div className="flex">
            <div className="w-[150px] sm:w-[250px]">Username</div>
            <div>{user && user.username}</div>
          </div>
          <div className="flex">
            <div className="w-[150px] sm:w-[250px]">Email</div>
            <div>{user && user.email}</div>
          </div>
          <div className="flex">
            <div className="w-[150px] sm:w-[250px]">Password</div>
            {editPasswordMode ? (
              <form onSubmit={handleSubmitUpdatePassword} className="flex">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="sm:w-[150px] border rounded px-1"
                  required
                />
                <button className="w-[35px] cursor-pointer text-green-500 flex items-center justify-center">
                  <FaCheck />
                </button>
                <div
                  onClick={() => setEditPasswordMode(false)}
                  className="cursor-pointer text-red-500 flex items-center justify-center"
                >
                  <FaXmark />
                </div>
              </form>
            ) : (
              <div className="flex">
                <div className="sm:w-[150px]">●●●●●●●●●●●●</div>
                <div
                  onClick={() => setEditPasswordMode(true)}
                  className="ml-2 border rounded px-2 cursor-pointer hover:text-cyan-500 transition-all ease-in-out duration-300"
                >
                  Change
                </div>
              </div>
            )}
          </div>
          <div className="flex">
            <div className="w-[150px] sm:w-[250px]"></div>
            <div
              className={
                passwordNotification === "Success!"
                  ? "text-green-500"
                  : "text-yellow-500"
              }
            >
              {passwordNotification}
            </div>
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">Financial Plan</div>
          {planLoading ? (
            <div>Loading plan...</div>
          ) : planError ? (
            <div>Error loading plan</div>
          ) : plan ? (
            <div>
              <div className="my-2 flex">
                <div className="w-[150px] sm:w-[250px]">Name</div>
                {editPlanTitleMode ? (
                  <form onSubmit={handleSubmitUpdatePlanTitle} className="flex">
                    <input
                      type="text"
                      value={planTitleContent}
                      onChange={(e) => setplanTitleContent(e.target.value)}
                      className="sm:w-[150px] border rounded px-1"
                      required
                    />
                    <button className="w-[35px] cursor-pointer text-green-500 flex items-center justify-center">
                      <FaCheck />
                    </button>
                    <div
                      onClick={() => setEditPlanTitleMode(false)}
                      className="cursor-pointer text-red-500 flex items-center justify-center"
                    >
                      <FaXmark />
                    </div>
                  </form>
                ) : (
                  <div className="flex">
                    <div className="sm:w-[150px]">{plan.title}</div>
                    <div
                      onClick={() => setEditPlanTitleMode(true)}
                      className="ml-2 border rounded px-2 cursor-pointer hover:text-cyan-500 transition-all ease-in-out duration-300"
                    >
                      Change
                    </div>
                  </div>
                )}
              </div>
              <div
                onClick={() => setDeleteMode(true)}
                className="text-red-500 cursor-pointer w-[55px]"
              >
                Delete
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      {deleteMode && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#222222] p-6 rounded shadow-lg w-[90%] max-w-md text-center z-120`}
        >
          <div className="text-2xl font-bold">Delete Plan?</div>
          <div className="my-5">
            Once you delete this plan, it can’t be restored.
          </div>
          <div className="my-5 flex justify-end">
            <div
              onClick={handleSubmitDeletePlan}
              className="p-2 mr-1 bg-red-500 rounded text-white bold secondary-font font-bold cursor-pointer"
            >
              {deletePlanPending ? "Deleting..." : "DELETE"}
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
      {(deleteMode || (window.innerWidth < 639 && showLeftNav)) && (
        <div className="fixed inset-0 bg-black opacity-50 z-100"></div>
      )}
      <div>{deleteNotification}</div>
    </div>
  );
}
