import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import axios from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";
import { unstable_noStore as noStore } from "next/cache";

import BannerCarousel from "@/components/carousels/bannercarousel";
import LogoCarouselClient from "@/components/carousels/logocarousel-client";
import ScrollProductsAlongX from "@/components/scroll_containers/scroll_products_x";

import { LiaShippingFastSolid, LiaHeadsetSolid } from "react-icons/lia";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import { PiMedal } from "react-icons/pi";
import { RiTestTubeFill } from "react-icons/ri";

import Architects3DModel from "@/public/assets/application_fields/3D-Hagia-Sophia-Model.png";
import Medical3DModel from "@/public/assets/application_fields/foot-anatomy-3dmodel.png";
import Collectible3DModel from "@/public/assets/application_fields/thundar-northwolf-3d-model.png";
import Gaming3DModel from "@/public/assets/application_fields/chess-pieces-3d-model.jpg";
import Designers3DModel from "@/public/assets/application_fields/minimalist-vase-3d-model.png";
import Industry3DModel from "@/public/assets/application_fields/industrial-robot-arm-clean-3d-Model.png";
import FeaturedCategories from "@/components/cards/featuredcategories";
import PopularProductsSlider from "@/components/cards/popularproductsslider";

export const metadata: Metadata = {
  title: {
    absolute: "Home | Evo-TechBD",
  },
};

interface LPFeaturedItemSectionTypes {
  title: string;
  view_more_url: string;
  items: any[];
}

// Minimal banner shape expected by BannerCarousel
type Banner = {
  imgurl: string;
  title?: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_url?: string;
  more_text?: string;
};

// Stable loading components to prevent re-render cascades
const CarouselLoader = () => (
  <div className="w-full h-full flex justify-center items-center text-stone-500 text-[13px] leading-6 font-[400] bg-stone-800">
    <RiTestTubeFill className="size-8 lg:size-10 p-2 rounded-full bg-[#0866FF]/25 text-[#0866FF]/90" />
  </div>
);

const CarouselFallback = () => (
  <div className="w-full h-full flex justify-center items-center text-stone-200 text-[13px] leading-6 font-[400] bg-stone-800">
    Loading...
  </div>
);

// home page components start here ----------------------------
const LandingHeaderCarousel = async () => {
  noStore();
  const response = await axios.get("/banners/active").catch((err) => {
    axiosErrorLogger({ error: err });
    return { data: { data: [] } };
  });
  const slides: Banner[] = (response?.data?.data || []).map((banner: any) => ({
    imgurl: banner.image,
    title: banner.title,
    subtitle: banner.subtitle,
    description: banner.description,
    button_text: banner.button_text,
    button_url: banner.button_url,
    more_text: banner.more_text,
  }));

  return (
    <>
      {slides.length > 0 ? (
        <BannerCarousel uniqueid="landingheadercarousel" slides={slides} />
      ) : (
        <CarouselLoader />
      )}
    </>
  );
};


const ApplicationFields = () => {
  const applicationFields = [
    {
      af_imgsrc: Architects3DModel,
      af_name: "Architects",
      af_model_creator: "",
    },
    {
      af_imgsrc: Designers3DModel,
      af_name: "Designers",
      af_model_creator: "",
    },
    {
      af_imgsrc: Collectible3DModel,
      af_name: "Collectibles",
      af_model_creator: "",
    },
    {
      af_imgsrc: Gaming3DModel,
      af_name: "Gaming",
      af_model_creator: "",
    },
    {
      af_imgsrc: Medical3DModel,
      af_name: "Medical",
      af_model_creator: "",
    },
    {
      af_imgsrc: Industry3DModel,
      af_name: "Industry",
      af_model_creator: "",
    },
  ];

  return (
    <div className="grid justify-items-center w-full h-fit grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {applicationFields.map((field, idx) => (
        <div
          key={`app_field_${idx}`}
          className={`relative flex flex-col items-center min-w-[200px] w-full ${
            idx === 0 || idx === 5 ? "lg:col-span-2" : ""
          } h-[170px] sm:h-[220px] lg:h-[275px] bg-[#ffffff] rounded-[10px] overflow-hidden`}
        >
          <div
            className="relative w-full h-full overflow-hidden"
            aria-label={field.af_name}
          >
            <Image
              src={field.af_imgsrc}
              alt={`3D Model-${field.af_name}`}
              fill
              quality={90}
              draggable="false"
              sizes="100%"
              loading="lazy"
              className="object-contain pointer-events-none"
            />
          </div>
          {field.af_model_creator && (
            <div className="flex justify-center w-full h-fit text-[10px] leading-5 tracking-[-0.015em] font-[400] text-stone-400 bg-[#e4e4e4] select-none">
              Model from{" "}
              <span className="ml-1 text-stone-700">
                {field.af_model_creator}
              </span>
            </div>
          )}
          <div className="z-[5] absolute inset-0 px-3 py-2 sm:px-5 sm:py-4 font-[600] text-[16px] sm:text-[20px] leading-6 tracking-tight text-stone-700 bg-gradient-to-br from-white from-5% via-transparent via-35% to-transparent">
            {field.af_name}
          </div>
        </div>
      ))}
    </div>
  );
};

const WhyShopWithUs = () => {
  const specialties = [
    {
      s_icon: PiMedal,
      s_title: "Quality Products",
      s_desc: "We provide imported products from top brands.",
    },
    {
      s_icon: LiaShippingFastSolid,
      s_title: "Fast Delivery",
      s_desc: "We deliver your products as fast as possible.",
    },
    {
      s_icon: IoShieldCheckmarkOutline,
      s_title: "Secure Payment",
      s_desc: "Convenient and secure payment methods.",
    },
    {
      s_icon: LiaHeadsetSolid,
      s_title: "24/7 Support",
      s_desc: "Reach out to us anytime for any queries.",
    },
  ];

  return (
    <div className="grid justify-items-center w-full h-fit grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-12">
      {specialties.map((specialty, idx) => (
        <div
          key={`specialty_${idx}`}
          className="flex flex-col items-center w-full h-[220px] px-3 py-5 gap-3 bg-[#fafafa] rounded-[10px] overflow-hidden"
        >
          <div className="flex justify-center items-center w-[55px] h-[55px] rounded-[12px] bg-sky-500">
            <specialty.s_icon
              className="inline w-7 h-7 text-white"
              aria-labelledby={`sp-${specialty.s_title}`}
            />
          </div>
          <h3
            id={`sp-${specialty.s_title}`}
            className="w-full h-fit font-[600] text-[13px] sm:text-[16px] leading-5 sm:leading-6 tracking-tight text-stone-800 text-center"
          >
            {specialty.s_title}
          </h3>
          <p className="w-full h-fit font-[400] text-[11px] sm:text-[14px] leading-5 sm:leading-6 text-stone-600 text-center">
            {specialty.s_desc}
          </p>
        </div>
      ))}
    </div>
  );
};
// home page components end here ----------------------------

const Home = () => {
  return (
    <>
      <div className="w-full flex justify-center mb-8">
        <div className="w-full max-w-[1200px] px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div
              id="carousel1"
              className="w-full h-[460px] md:h-[520px] lg:h-[600px]"
            >
              <Suspense fallback={<CarouselFallback />}>
                <LandingHeaderCarousel />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <FeaturedCategories />
      <PopularProductsSlider title="Popular Products" />

      <div className="w-full max-w-[1440px] h-fit pb-12 flex flex-col items-center font-inter">
        <div
          id="application_fields"
          className="flex flex-col items-center w-full min-h-[400px] px-4 sm:px-8 py-8 gap-8 bg-[radial-gradient(at_center,_var(--tw-gradient-stops))] from-[#f0f7fc] to-[#eeeeee] to-40%"
        >
          <h2 className="flex justify-center w-full h-fit mt-4 px-3 py-1 font-[600] text-[20px] sm:text-[24px] leading-8 text-stone-700 text-center">
            Application Fields
          </h2>
          <div className="flex justify-center w-full h-fit max-sm:px-5">
            <ApplicationFields />
          </div>
        </div>

        <div
          id="our_clients"
          className="flex flex-col items-center w-full min-h-[250px] bg-gradient-to-r from-[#eeeeee] via-[#e8eae8] to-[#eeeeee] gap-10 px-3 sm:px-8 md:px-12 "
        >
          <h2 className="flex justify-center w-full h-fit mt-4 px-3 py-1 font-[600] text-[20px] sm:text-[24px] leading-8 text-stone-700 text-center">
            We Proudly Served
          </h2>
          <LogoCarouselClient />
        </div>

        <div
          id="why_shop_with_us"
          className="flex flex-col items-center w-full min-h-[350px] px-4 sm:px-8 md:px-12 py-6 gap-10 bg-[radial-gradient(at_center,_var(--tw-gradient-stops))] from-[#f0f7fc] to-[#eeeeee] to-40%"
        >
          <h2 className="flex justify-center w-full h-fit mt-4 px-3 py-1 font-[600] text-[20px] sm:text-[24px] leading-8 text-stone-700 text-center">
            Why Shop on Evo-TechBD
          </h2>
          <div className="flex justify-center w-full h-fit">
            <WhyShopWithUs />
          </div>
        </div>
      </div>
    </>
  );
};

Home.displayName = "LandingHome";

export default Home;
