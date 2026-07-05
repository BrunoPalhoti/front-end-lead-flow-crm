import type { ReactNode } from "react";
import { PageLoader } from "@/shared/components/PageLoader";

interface AsyncPageProps {
  isLoading: boolean;
  children: ReactNode;
}

export function AsyncPage({ isLoading, children }: AsyncPageProps) {
  if (isLoading) {
    return <PageLoader />;
  }

  return children;
}
