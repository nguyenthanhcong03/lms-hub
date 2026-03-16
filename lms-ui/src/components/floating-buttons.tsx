"use client";

import dynamic from "next/dynamic";

// Dynamic imports with ssr: false to prevent hydration mismatch
const Chatbot = dynamic(() => import("@/components/chatbot/chatbot"), {
  ssr: false,
});

const FloatingButtons = () => {
  return (
    <>
      <Chatbot />
    </>
  );
};

export default FloatingButtons;
