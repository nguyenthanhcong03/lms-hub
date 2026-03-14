"use client";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";
import { FaComments } from "react-icons/fa";
import CommentSection from "./comment-section";

interface CommentDrawerProps {
  isExpanded: boolean;
}

const CommentDrawer = ({ isExpanded }: CommentDrawerProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="h-full">
      <div
        onClick={onOpen}
        className={`fixed bottom-20 z-10 ${isExpanded ? "right-5" : "right-[calc(23%+20px)]"}`}
      >
        <button className="flex items-center gap-2 rounded-full border-slate-100 bg-white px-4 py-2 text-primary shadow">
          <FaComments size={20} />
          <span className="text-sm font-bold">Bình luận</span>
        </button>
      </div>
      <Drawer
        isOpen={isOpen}
        size="3xl"
        classNames={{
          body: "px-0",
        }}
        radius="none"
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.5 },
            },
            exit: {
              x: 100,
              opacity: 0,
              transition: { duration: 0.5 },
            },
          },
        }}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader></DrawerHeader>
              <DrawerBody>
                <CommentSection />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CommentDrawer;
