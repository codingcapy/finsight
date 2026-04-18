import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import capylogo from "/capyness.png";
import useAuthStore from "../store/AuthStore";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const { loginService, authLoading, user } = useAuthStore();
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!!user) navigate({ to: "/dashboard" });
  }, [user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;
    loginService(email, password);
    if (authLoading) setNotification("Loading...");
    if (!user) {
      setTimeout(() => {
        setNotification("Invalid login credentials");
      }, 700);
    }
  }

  return (
    <div className="pt-5 md:flex items-center h-screen bg-[#242424] text-white">
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
            className="border rounded p-2 mt-2"
            required
          />
          <Link
            to="/forgotpassword"
            className="my-2 text-xs font-bold text-[#c0c0c0] underline"
          >
            Forgot password
          </Link>
          <button className="my-2 px-5 py-3 bg-cyan-500 font-bold cursor-pointer hover:bg-cyan-400 transition-all ease-in-out duration-300">
            LOGIN
          </button>
          <div className="text-yellow-500">{notification}</div>
        </form>
        <div className="text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-cyan-500 font-bold hover:text-cyan-400 transition-all ease-in-out duration-300"
          >
            register
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
        <div className="hidden md:flex absolute bottom-0 left-0">
          <Link to="/terms" className="p-3">
            Terms & Conditions
          </Link>
          <Link to="/privacypolicy" className="p-3">
            Privacy Policy
          </Link>
          <div className="p-3 text-[#aaaaaa]">
            Copyright &copy; 2026 Finsight. All rights reserved.
          </div>
        </div>
      </div>
      <div className="mt-5 md:mt-0 flex flex-col">
        <img src={capylogo} alt="" className="hidden md:block mx-auto" />
      </div>
      <div className="absolute hidden md:block right-2 top-10 sm:right-10 font-bold hover:text-cyan-500 transition-all ease-in-out duration-300">
        <Link to="/demo">Try demo</Link>
      </div>
      <div className="absolute bottom-0 left-0 w-screen flex justify-between md:hidden">
        <Link to="/terms" className="p-3">
          Terms & Conditions
        </Link>
        <Link to="/privacypolicy" className="p-3">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
