import { ReactNode } from "react";

export const dynamic = "force-dynamic";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  return children;
};

export default UserLayout;

