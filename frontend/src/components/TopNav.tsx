import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import useAuthStore from "../store/AuthStore";
import { Link } from "@tanstack/react-router";
import { GiHamburgerMenu } from "react-icons/gi";

export function TopNav(props: {
  showLeftNav: boolean;
  setShowLeftNav: Dispatch<SetStateAction<boolean>>;
}) {
  const { user, logoutService } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
    <div
      ref={menuRef}
      className="fixed top-0 left-0 bg-[#242424] px-5 py-2 w-screen flex justify-between z-110 md:z-80"
    >
      <div>
        <GiHamburgerMenu
          size={25}
          onClick={() => props.setShowLeftNav(!props.showLeftNav)}
          className="md:hidden"
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
  );
}
