import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useResetPasswordMutation } from "../lib/api/users";

export const Route = createFileRoute("/forgotpassword")({
  component: RouteComponent,
});

function RouteComponent() {
  const [emailContent, setEmailContent] = useState("");
  const [notification, setNotification] = useState("");
  const { mutate: resetPassword, isPending: resetPasswordPending } =
    useResetPasswordMutation();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    resetPassword(
      { email: emailContent },
      {
        onSuccess: () =>
          setNotification("Success! Check your email for recovery code"),
        onError: () =>
          setNotification(
            "An error occurred sending recovery code 😵‍💫 we'll look into it ASAP.",
          ),
      },
    );
  }

  return (
    <div className="h-screen bg-[#242424] text-white flex flex-col">
      <Link
        to="/"
        className="p-3 flex hover:text-cyan-500 transition-all ease-in-out duration-300"
      >
        <div className="flex justify-center items-center">
          <FaArrowLeft />
        </div>
        <div className="ml-2">Back to home</div>
      </Link>
      <div className="mx-auto mt-10 md:mt-20">
        <div className="text-2xl text-center font-bold mb-5">
          Password Recovery
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Enter email address"
            className="border rounded mb-2 p-2 w-[90vw] max-w-[600px]"
            required
          />
          <button className="bg-cyan-500 py-2 cursor-pointer">
            Send recovery code
          </button>
        </form>
      </div>
      <div className="text-center my-2">{notification}</div>
    </div>
  );
}
