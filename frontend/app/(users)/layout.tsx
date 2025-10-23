const UserLayout = ({ children }: { children: React.ReactNode }) => {
  // The navbar and footer are now handled by ConditionalLayout in the root layout
  return <>{children}</>;
};

export default UserLayout;
