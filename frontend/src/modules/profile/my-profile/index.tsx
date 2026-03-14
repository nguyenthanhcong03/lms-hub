"use client";

import Image from "next/image";

import UpdateInfo from "./components/update-info";
import UploadAvatar from "./components/upload-avatar";

const MyProfilePage = () => {
  return (
    <>
      <div className="relative h-[250px] w-full object-contain">
        <Image
          src="/images/bg-profile.png"
          alt="cover-image"
          fill
          className="rounded-lg"
        />
        <div className="shadow-lg">
          <UploadAvatar />
        </div>
      </div>
      <UpdateInfo />
    </>
  );
};

export default MyProfilePage;
