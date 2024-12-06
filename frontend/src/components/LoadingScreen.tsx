import React from "react";
import { MoonLoader } from "react-spinners";
import { motion } from "framer-motion";

const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen bg-white"
    >
      <div className="flex flex-col items-center">
        <MoonLoader color="#5E9ED9" size={50} />
        <p className="mt-4 text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;