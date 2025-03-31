import { motion } from "framer-motion";

export default function RecipeCardSkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div 
          key={index}
          className="w-full p-4 bg-white rounded-2xl shadow-md animate-pulse"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="w-full h-40 bg-gray-300 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-gray-400 rounded w-full"></div>
        </motion.div>
      ))}
    </div>
  );
}