import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full h-fit flex flex-col items-center bg-[#EEEEEE]">
      {/* Navbar should be full-width so its background and card can span the page correctly */}
      <Navbar />

      {/* Center the page content below the full-width navbar */}
      <div className="relative w-full min-h-screen h-fit flex flex-col items-center">
        <div className="w-full max-w-[1440px] mx-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
