import { Brain } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ShinyButton } from "@/components/animation/ShinyButton";
import Squares from "@/components/animation/Squares";

const Home = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden  bg-[#020817]">
      <div className="absolute h-full w-full z-50 opacity-75">
        <Squares
          speed={0.5}
          squareSize={50}
          direction="diagonal"
          borderColor="purple"
          hoverFillColor="purple"
        />
      </div>

      <div className="relative z-50 container mx-auto min-h-screen flex flex-col w-11/12">
        {/* Header */}
        <header className="flex items-center justify-between py-6 text-white">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold ">Memento</span>
          </div>

          <Link to="/dashboard">
            <ShinyButton className="hover:bg-purple-500">Dashboard</ShinyButton>
          </Link>
        </header>

        {/* Main content */}
        <main>
          <section className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-10 px-4  sm:flex-row sm:gap-16">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-1 flex-col justify-center gap-6 text-center sm:text-left text-white"
            >
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Remember <span className="text-white">Everything</span>
                <br />
                Learn <span className="text-white">Forever</span>
              </h1>

              <p className="text-sm text-slate-300 sm:text-base md:text-lg">
                Master any subject with scientifically-proven spaced repetition.
                Our smart algorithm optimizes your learning and helps you
                remember more in less time.
              </p>

              <div className="mt-4">
                <Link to="/dashboard">
                  <ShinyButton className="hover:bg-purple-500">
                    Get Started Free
                  </ShinyButton>
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-center sm:justify-start gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-700"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-300">
                  <span className="font-bold text-white">
                    More Features coming soon
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Right Side - Image */}
            <div className="flex-1 sm:flex justify-center items-center max-w-[500px] sm:max-w-none hidden">
              <img
                src="/FuturesticBrain.png"
                alt="Brain"
                className="w-full h-auto max-h-[500px] object-contain"
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
