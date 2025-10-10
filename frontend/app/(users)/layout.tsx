import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";


const UserLayout = ({ children }: { children: React.ReactNode; }) => {


  return (
    <div className="relative w-full h-fit flex flex-col items-center bg-[#EEEEEE]">
      <Navbar />
      <div className="relative w-full min-h-screen h-fit flex flex-col items-center">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default UserLayout;
