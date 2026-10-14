import React, { useContext } from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Logo from "../assets/images/Logo.png";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const {logout} = useContext(AuthContext);
  function handleLogout(){
    logout()
  }
  return (
    <>
      <nav className="shadow-md top-0 left-0 w-full z-50 px-10 py-5 bg-black">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <img src={Logo} alt="logo" className="w-[220px]" />
          </div>
          <div className="flex items-center">
            <button onClick={handleLogout}>
              <RiLogoutBoxRLine className="size-6 text-[#FFD700]" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
