import React, { useState } from "react";
import { FaBars, FaTimes, FaHome } from "react-icons/fa";
import { IoIosNotifications, IoMdSettings } from "react-icons/io";
import Logo from "../assets/images/logobetter.png";

const HeaderTherapistDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-[#5E9ED9] text-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center cursor-pointer">
          <a href="/" className="flex items-center">
            <img
              src={Logo}
              alt="Peace of Mind Logo"
              className="w-12 h-12 object-cover rounded-full mr-2"
            />
            <h1 className="text-lg font-bold">Peace of Mind</h1>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden font-bold md:flex space-x-1">
            <div className="justify-center flex cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4] space-x-1">
                <FaHome className="mt-1"/>
                <a href="Link for Dashboard" className="cursor-pointer rounded hover:bg-[#4b8cc4]">
                    Dashboard
                </a>
            </div>
            <div className="justify-center flex cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4] space-x-1">
                <IoIosNotifications className="mt-1" />
                <a href="Link for Notifications" className="cursor-pointer rounded hover:bg-[#4b8cc4]">
                    Notifications
                </a>
            </div>
            <div className="justify-center flex cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4] space-x-1">
                <IoMdSettings className="mt-1" />
                <a href="Link for settings" className="cursor-pointer rounded hover:bg-[#4b8cc4]">
                    Settings
                </a>
            </div>
        </nav>

        {/* Mobile Hamburger Icon */}
        <button onClick={toggleMenu} className="md:hidden">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden text-center font-bold bg-[#5E9ED9] text-white p-4 space-y-2">
          <div className="space-y-2">
            <div className="justify-center flex space-x-1 px-3 py-2 rounded hover:bg-[#4b8cc4]">
                <FaHome className="mt-1"/>
                <a href="Link for Dashboard"> Dashboard </a>
            </div>
            <div className="justify-center flex space-x-1 px-3 py-2 rounded hover:bg-[#4b8cc4]">
                <IoIosNotifications className="mt-1"/>
                <a href="Link for Dashboard"> Notification </a>
            </div>
            <div className="justify-center flex space-x-1 px-3 py-2 rounded hover:bg-[#4b8cc4]">
                <IoMdSettings className="mt-1"/>
                <a href="Link for Dashboard"> Settings </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default HeaderTherapistDashboard;
