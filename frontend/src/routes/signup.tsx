import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import capylogo from "/capyness.png";
import { useCreateUserMutation } from "../lib/api/users";
import { useEffect, useState } from "react";
import useAuthStore from "../store/AuthStore";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const { mutate: createUser, isPending: createUserPending } =
    useCreateUserMutation();
  const [notification, setNotification] = useState("");
  const { loginService, authLoading, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!!user) navigate({ to: "/dashboard" });
  }, [user]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (createUserPending) return;
    const username = (e.target as HTMLFormElement).username.value;
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;
    if (username.length > 255) return setNotification("Username too long!");
    if (email.length > 255) return setNotification("Email too long!");
    if (password.length > 80)
      return setNotification("Password too long! Max character limit is 80");
    createUser(
      { username, password, email },
      {
        onSuccess: () => {
          loginService(email, password);
          if (authLoading) setNotification("Loading...");
        },
        onError: (errorMessage) => setNotification(errorMessage.toString()),
      },
    );
  }

  return (
    <div className="pt-5 md:mt-0 md:flex md:items-center h-screen bg-[#242424] text-white">
      <div className="md:w-[50vw]">
        <div className="text-4xl text-center mb-2 font-bold">FinSight</div>
        <div className="text-center mb-5 md:mb-10">
          Your financial plan, in your hands
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-[80%] md:w-[50%] mx-auto mb-5"
        >
          <input
            type="text"
            id="username"
            name="username"
            placeholder="username"
            className="border rounded p-2 my-2"
            required
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email"
            className="border rounded p-2 my-2"
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            className="border rounded p-2 my-2"
            required
          />
          <button className="my-2 px-5 py-3 bg-cyan-500 font-bold cursor-pointer hover:bg-cyan-400 transition-all ease-in-out duration-300">
            {createUserPending ? "Signing up..." : "SIGN UP"}
          </button>
          <div className="text-yellow-500">{notification}</div>
        </form>
        <div className="text-center">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-cyan-500 font-bold hover:text-cyan-400 transition-all ease-in-out duration-300"
          >
            login
          </Link>
        </div>
        <div className="flex flex-col mt-10">
          <Link
            to="/demo"
            className="md:hidden mx-auto text-cyan-500 border rounded px-3 py-2"
          >
            Try the demo
          </Link>
        </div>
      </div>
      <div className="hidden md:flex absolute bottom-0 left-0">
        <Link to="/terms" className="p-3">
          Terms & Conditions
        </Link>
        <Link to="/privacypolicy" className="p-3">
          Privacy Policy
        </Link>
        <div className="p-3 text-[#aaaaaa]">
          Copyright &copy; 2026 FinSight. All rights reserved.
        </div>
      </div>
      <div className="mt-5 md:mt-0 flex flex-col">
        <img src={capylogo} alt="" className="hidden md:block mx-auto" />
      </div>
      <div className="hidden md:block absolute top-1 right-2 sm:top-10 sm:right-10 font-bold hover:text-cyan-500 transition-all ease-in-out duration-300">
        <Link to="/demo">Try demo</Link>
      </div>
    </div>
  );
}
