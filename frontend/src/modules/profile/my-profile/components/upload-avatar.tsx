import { useAuth } from "@/shared/contexts/auth-context";
import { updateAuthMe } from "@/shared/services/auth";
import { getAxiosErrorMessage } from "@/utils";
import { UploadButton } from "@/utils/uploadthing"; // adjust this path
import { CircularProgress } from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const UploadAvatar = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const { user, setUser } = useAuth();

  const handleUpload = async (avatar: string) => {
    const result = await updateAuthMe({ avatar });
    setAvatarUrl(avatar);
    setUser(result?.data);
  };

  const handleDeleteAvatar = async () => {
    try {
      const res = await updateAuthMe({ avatar: "" });
      if (res?.data) {
        setAvatarUrl(null);
        setUser(res.data);
      }
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Xóa ảnh đại diện thất bại!");
      toast.error(message);
    }
  };

  useEffect(() => {
    if (user?.avatar) {
      setAvatarUrl(user.avatar);
    }
  }, [user]);
  return (
    <>
      <div className="absolute -bottom-10 left-10 h-32 w-32 cursor-pointer rounded-full border-4 border-solid border-white shadow-lg transition hover:opacity-80">
        <div className="group relative h-full w-full">
          <Image
            src={avatarUrl || "/images/profile-photo.webp"}
            alt="cover-image"
            fill
            className="rounded-full"
          />
          {isUploading && (
            <div className="absolute left-1/2 top-7 -translate-x-1/2 text-primary">
              <CircularProgress
                aria-label="Loading..."
                color="primary"
                showValueLabel={true}
                size="md"
                value={progress}
              />
            </div>
          )}
          {avatarUrl && (
            <button
              onClick={handleDeleteAvatar}
              className="absolute -top-2 right-0 z-[9999] hidden h-8 w-8 items-center justify-center rounded-full bg-white group-hover:flex"
            >
              <FaRegTrashAlt className="text-red-500" />
            </button>
          )}
        </div>

        {!avatarUrl && (
          <div className="absolute inset-0 opacity-0">
            <UploadButton
              appearance={{
                button: {
                  background: "yellow",
                  padding: "",
                  color: "#000",
                  width: "128px",
                  height: "128px",
                  borderRadius: "50%",
                },
              }}
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]?.url) {
                  handleUpload(res[0].url);
                }
                setProgress(0);
                setIsUploading(false);
              }}
              onUploadError={(error: Error) => {
                alert(`Upload error: ${error.message}`);
                setProgress(0);
                setIsUploading(false);
              }}
              onUploadProgress={(progress) => {
                setProgress(Math.round(progress));
                setIsUploading(true);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default UploadAvatar;
