"use client";
import { ROUTE_CONFIG } from "@/shared/configs/route";
import Image from "next/image";
import Link from "next/link";
import { FaAngleRight, FaCloud, FaCode, FaQuidditch } from "react-icons/fa";
import { FaMobileScreen } from "react-icons/fa6";
import dynamic from "next/dynamic";
const ParticleBackground = dynamic(() => import("./particle_background"), {
  ssr: false,
});
const HeroSection = () => {
  return (
    <div className="relative w-full md:py-20">
      <div className="absolute left-0 top-0 z-[-1] h-full w-full">
        <ParticleBackground />
      </div>

      <div className="grid h-full grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-20">
        <div className="flex flex-col items-center lg:items-start">
          <h1
            className="animate-fade-in-up mb-5 translate-y-5 text-center text-4xl font-extrabold leading-tight text-[#3F3D56] opacity-0 md:text-left md:text-5xl"
            style={{ animationDelay: "0.4s" }}
          >
            Your Future Starts with{" "}
            <span className="after:bg-accent/30 relative z-10 inline-block text-primary after:absolute after:bottom-2 after:left-0 after:z-[-1] after:h-2.5 after:w-full after:skew-x-[-15deg] after:transform after:content-['']">
              One
            </span>{" "}
            Click
          </h1>

          <p
            className="animate-fade-in-up mb-5 translate-y-5 text-lg leading-relaxed text-gray-700 opacity-0 md:mb-10 md:text-xl"
            style={{ animationDelay: "0.6s" }}
          >
            Take control of your career and passion with online courses. Whether
            you're learning for fun or chasing a dream, everything you need is
            just one click away.
          </p>
          <div className="mt-4">
            <Link
              href={ROUTE_CONFIG.COURSE}
              className="group relative flex min-w-[150px] items-center justify-center overflow-hidden rounded-lg bg-primary px-8 py-4 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40"
            >
              <span>Xem các khóa học</span> <FaAngleRight />
              <span className="absolute left-[-100%] top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-[100%]"></span>
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative h-[275px] w-full">
            <div className="animate-fade-and-float z-2 relative h-full w-full opacity-0 [filter:drop-shadow(0_30px_40px_rgba(108,99,255,0.2))]">
              <Image
                src="/images/hero-img.png"
                alt="Web Development"
                className="rounded-2xl"
                fill
              />
            </div>

            <div className="absolute left-[-20px] top-[10%] z-20 flex items-center rounded-xl bg-white p-4 opacity-0 shadow-lg [animation:floatIcon_4s_ease-in-out_infinite,fadeIn_0.8s_ease-out_1.2s_forwards]">
              <div className="flex items-center gap-3">
                <FaCode className="text-2xl text-primary" />
                <div className="whitespace-nowrap text-xs font-semibold text-secondary">
                  Clean Code
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-400 text-xs font-semibold text-white">
                  +1
                </div>
              </div>
            </div>

            <div className="absolute bottom-[30%] left-[-20px] z-20 flex items-center rounded-xl bg-white p-4 opacity-0 shadow-lg [animation:floatIcon_5s_ease-in-out_infinite,fadeIn_0.8s_ease-out_1.5s_forwards] md:left-[-40px]">
              <div className="flex items-center gap-3">
                <FaMobileScreen className="text-2xl text-primary" />
                <div className="whitespace-nowrap text-xs font-semibold text-secondary">
                  Mobile First
                </div>
              </div>
            </div>

            <div className="absolute right-[-20px] top-[0%] z-20 flex items-center rounded-xl bg-white p-4 opacity-0 shadow-lg [animation:floatIcon_4.5s_ease-in-out_infinite,fadeIn_0.8s_ease-out_1.8s_forwards]">
              <div className="flex items-center gap-3">
                <FaCloud className="text-2xl text-primary" />
                <div className="whitespace-nowrap text-xs font-semibold text-secondary">
                  Cloud Ready
                </div>
              </div>
            </div>

            <div className="absolute bottom-[10%] right-0 z-20 flex items-center rounded-xl bg-white p-4 opacity-0 shadow-lg [animation:floatIcon_5.5s_ease-in-out_infinite,fadeIn_0.8s_ease-out_2.1s_forwards]">
              <div className="flex items-center gap-3">
                <FaQuidditch className="text-2xl text-primary" />
                <div className="whitespace-nowrap text-xs font-semibold text-secondary">
                  UX Design
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-400 text-xs font-semibold text-white">
                  +2
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
