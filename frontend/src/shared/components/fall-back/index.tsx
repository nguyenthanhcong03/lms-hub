import { Spinner } from "@heroui/react";

const FallbackSpinner = () => {
  return (
    <div className="my-auto flex h-screen items-center justify-center">
      <Spinner variant="spinner" size="lg" />
    </div>
  );
};

export default FallbackSpinner;
