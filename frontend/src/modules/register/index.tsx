import Image from "next/image";
import RegisterForm from "./components/register-form";

const RegisterPage = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8">
            <div className="flex items-center justify-center gap-2">
              <div className="relative h-14 w-14 flex-shrink-0">
                <Image fill src="/images/yolo.png" alt="tiktok"></Image>
              </div>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                Sign up
              </h1>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
