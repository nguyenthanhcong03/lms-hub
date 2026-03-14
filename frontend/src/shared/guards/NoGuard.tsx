// ** React Imports
import { useAuth } from "@/shared/contexts/auth-context";
import { ReactElement, ReactNode } from "react";

// ** Types

interface NoGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const NoGuard = (props: NoGuardProps) => {
  // ** Props
  const { children, fallback } = props;

  const auth = useAuth();

  // if (auth.loading) {
  // 	return fallback;
  // }

  return <>{children}</>;
};

export default NoGuard;
