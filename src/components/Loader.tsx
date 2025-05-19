import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface BrainLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}
const Loader = ({
  className,
  size = "md",
  color = "primary",
}: BrainLoaderProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const colorClasses = {
    primary: "text-primary fill-primary",
    secondary: "text-secondary fill-secondary",
    accent: "text-accent fill-accent",
    blue: "text-blue-500 fill-blue-500",
    green: "text-green-500 fill-green-500",
    purple: "text-purple-500 fill-purple-500",
  };
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={cn("relative", sizeClasses[size])}
        >
          {/* Brain outline - always visible */}
          <svg
            viewBox="0 0 24 24"
            className={cn(
              "absolute inset-0 stroke-current stroke-[0.5] opacity-30",
              colorClasses[color as keyof typeof colorClasses]
            )}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5 2C8.89555 2 8.31711 2.23545 7.8859 2.65432C7.45468 3.07319 7.21 3.63775 7.21 4.22545C7.21 4.22545 7.21 4.23364 7.21 4.23364C5.591 5.18364 4.5 6.95455 4.5 9C4.5 9.61091 4.599 10.1964 4.77 10.7436C3.7 11.5073 3 12.7382 3 14.1C3 15.3382 3.5978 16.4327 4.5 17.1964C4.5 17.1964 4.5 17.2045 4.5 17.2045C4.5 18.7473 5.75 20 7.29 20C7.38 20 7.47 20 7.56 19.9918C8.46 20.6236 9.54 21 10.71 21C11.88 21 12.96 20.6236 13.86 19.9918C13.95 20 14.04 20 14.13 20C15.67 20 16.92 18.7473 16.92 17.2045C16.92 17.2045 16.92 17.1964 16.92 17.1964C17.8222 16.4327 18.42 15.3382 18.42 14.1C18.42 12.7382 17.72 11.5073 16.65 10.7436C16.821 10.1964 16.92 9.61091 16.92 9C16.92 6.95455 15.829 5.18364 14.21 4.23364C14.21 4.23364 14.21 4.22545 14.21 4.22545C14.21 3.63775 13.9653 3.07319 13.5341 2.65432C13.1029 2.23545 12.5244 2 11.92 2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.9999 2C11.9999 3.5 11.9999 5 9.99992 6C7.99992 7 8.99992 11 8.99992 11C8.99992 11 7.99992 10.5 7.49992 10C6.99992 9.5 5.99992 9.5 5.99992 10C5.99992 10.5 6.99992 10.5 6.99992 11C6.99992 11.5 5.99992 12 5.49992 12C4.99992 12 4.49992 13 4.99992 13.5C5.49992 14 6.49992 13.5 6.99992 14C7.49992 14.5 6.99992 15.5 6.49992 16C5.99992 16.5 6.49992 17.5 7.49992 17C8.49992 16.5 9.99992 17.5 9.99992 18C9.99992 18.5 10.4999 20 11.9999 20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 2C12 3.5 12 5 14 6C16 7 15 11 15 11C15 11 16 10.5 16.5 10C17 9.5 18 9.5 18 10C18 10.5 17 10.5 17 11C17 11.5 18 12 18.5 12C19 12 19.5 13 19 13.5C18.5 14 17.5 13.5 17 14C16.5 14.5 17 15.5 17.5 16C18 16.5 17.5 17.5 16.5 17C15.5 16.5 14 17.5 14 18C14 18.5 13.5 20 12 20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Brain fill - animated */}
          <svg
            viewBox="0 0 24 24"
            className={cn(
              "absolute inset-0",
              colorClasses[color as keyof typeof colorClasses]
            )}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="brain-mask">
                <rect x="0" y="0" width="24" height="24" fill="white" />
                <motion.rect
                  x="0"
                  y="0"
                  width="24"
                  initial={{ height: 24 }}
                  animate={{
                    height: [24, 0, 24],
                    transition: {
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                      ease: "easeInOut",
                    },
                  }}
                  fill="black"
                />
              </mask>
            </defs>
            <g mask="url(#brain-mask)">
              <path
                d="M9.5 2C8.89555 2 8.31711 2.23545 7.8859 2.65432C7.45468 3.07319 7.21 3.63775 7.21 4.22545C7.21 4.22545 7.21 4.23364 7.21 4.23364C5.591 5.18364 4.5 6.95455 4.5 9C4.5 9.61091 4.599 10.1964 4.77 10.7436C3.7 11.5073 3 12.7382 3 14.1C3 15.3382 3.5978 16.4327 4.5 17.1964C4.5 17.1964 4.5 17.2045 4.5 17.2045C4.5 18.7473 5.75 20 7.29 20C7.38 20 7.47 20 7.56 19.9918C8.46 20.6236 9.54 21 10.71 21C11.88 21 12.96 20.6236 13.86 19.9918C13.95 20 14.04 20 14.13 20C15.67 20 16.92 18.7473 16.92 17.2045C16.92 17.2045 16.92 17.1964 16.92 17.1964C17.8222 16.4327 18.42 15.3382 18.42 14.1C18.42 12.7382 17.72 11.5073 16.65 10.7436C16.821 10.1964 16.92 9.61091 16.92 9C16.92 6.95455 15.829 5.18364 14.21 4.23364C14.21 4.23364 14.21 4.22545 14.21 4.22545C14.21 3.63775 13.9653 3.07319 13.5341 2.65432C13.1029 2.23545 12.5244 2 11.92 2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.9999 2C11.9999 3.5 11.9999 5 9.99992 6C7.99992 7 8.99992 11 8.99992 11C8.99992 11 7.99992 10.5 7.49992 10C6.99992 9.5 5.99992 9.5 5.99992 10C5.99992 10.5 6.99992 10.5 6.99992 11C6.99992 11.5 5.99992 12 5.49992 12C4.99992 12 4.49992 13 4.99992 13.5C5.49992 14 6.49992 13.5 6.99992 14C7.49992 14.5 6.99992 15.5 6.49992 16C5.99992 16.5 6.49992 17.5 7.49992 17C8.49992 16.5 9.99992 17.5 9.99992 18C9.99992 18.5 10.4999 20 11.9999 20"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 2C12 3.5 12 5 14 6C16 7 15 11 15 11C15 11 16 10.5 16.5 10C17 9.5 18 9.5 18 10C18 10.5 17 10.5 17 11C17 11.5 18 12 18.5 12C19 12 19.5 13 19 13.5C18.5 14 17.5 13.5 17 14C16.5 14.5 17 15.5 17.5 16C18 16.5 17.5 17.5 16.5 17C15.5 16.5 14 17.5 14 18C14 18.5 13.5 20 12 20"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>

          {/* Pulsing circle behind the brain */}
          <motion.div
            className={cn(
              "absolute inset-0 -z-10 rounded-full",
              color === "primary" ? "bg-primary/10" : "bg-current/10"
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.2, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-center text-sm font-medium"
        >
          Loading your knowledge...
        </motion.p>
      </div>
    </div>
  );
};

export default Loader;
