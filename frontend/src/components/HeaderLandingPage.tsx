import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logobetter.png";

const HeaderLandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false); // Close the menu for mobile navigation
    setTimeout(() => {
      navigate(path); // Navigate after menu animation completes
    }, 200); // Match the duration of the menu close animation
  };

  const linkVariants = {
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 300 } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <motion.header
      className="bg-[#5E9ED9] text-white sticky top-0 z-50"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
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
          {[
            { to: "about", label: "About" },
            { to: "advice", label: "Advice" },
            { to: "faq", label: "FAQ" },
            { to: "reviews", label: "Reviews" },
            { to: "contact", label: "Contact Us" },
          ].map(({ to, label }) => (
            <motion.div
              key={to}
              variants={linkVariants}
              whileHover="hover"
              className="cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4]"
            >
              <Link to={to} smooth={true} duration={500}>
                {label}
              </Link>
            </motion.div>
          ))}
          <motion.div
            whileHover="hover"
            className="cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4]"
            onClick={() => handleNavigation("/for-therapists")}
          >
            For Therapists
          </motion.div>
          <motion.div
            whileHover="hover"
            className="cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4]"
            onClick={() => handleNavigation("/sign-up")}
          >
            Sign Up
          </motion.div>
          <motion.div
            whileHover="hover"
            className="cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4]"
            onClick={() => handleNavigation("/login")}
          >
            Login
          </motion.div>
        </nav>

        {/* Mobile Hamburger Icon */}
        <button onClick={toggleMenu} className="md:hidden">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden text-center font-bold bg-[#5E9ED9] text-white p-4 space-y-2"
          >
            {[
              { to: "about", label: "About" },
              { to: "advice", label: "Advice" },
              { to: "faq", label: "FAQ" },
              { to: "reviews", label: "Reviews" },
              { to: "contact", label: "Contact Us" },
            ].map(({ to, label }) => (
              <motion.div
                key={to}
                variants={linkVariants}
                whileHover="hover"
                className="block cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4]"
              >
                <Link
                  to={to}
                  smooth={true}
                  duration={500}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            <div className="space-y-2">
              <motion.div
                whileHover="hover"
                className="block cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4]"
                onClick={() => handleNavigation("/for-therapists")}
              >
                For Therapists
              </motion.div>
              <motion.div
                whileHover="hover"
                className="block cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4]"
                onClick={() => handleNavigation("/sign-up")}
              >
                Sign Up
              </motion.div>
              <motion.div
                whileHover="hover"
                className="block cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4]"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default HeaderLandingPage;
