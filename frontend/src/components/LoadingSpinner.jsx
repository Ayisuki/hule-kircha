import { motion } from "framer-motion";

export const LoadingSpinner = ({ size = "md", text = null }) => {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className={`${sizes[size]} rounded-full border-gold border-t-transparent`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && <p className="text-text-secondary text-sm">{text}</p>}
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="rounded-2xl bg-bg-secondary overflow-hidden">
    <div className="h-40 shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-5 w-3/4 shimmer rounded" />
      <div className="h-4 w-1/2 shimmer rounded" />
      <div className="h-8 w-1/3 shimmer rounded" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 4 }) => (
  <div className="grid grid-cols-2 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
