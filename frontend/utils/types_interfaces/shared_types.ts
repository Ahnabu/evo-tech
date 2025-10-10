// common types used in the project

import { StaticImageData } from "next/image";
import { ComponentProps } from "react";

type currentRouteProps = {
    params: { [key: string]: string; }
    searchParams: { [key: string]: string | string[] | undefined; }
};


type Productcardtype = {
    imgsrc: string;
    prodname: string;
    prodslug: string;
    prodprice: number;
    instock: boolean;
    prodprevprice: number;
};

type Productcardtype2 = {
    prodid: number;
    imgsrc: string;
    prodname: string;
    prodslug: string;
    prodprice: number;
    instock: boolean;
    prodprevprice: number;
};


type Servicecardtype = {
    gotourl: string;
    imgsrc: string | StaticImageData;
    name: string;
};

// usable with icon components (e.g. lucide-react, react-icons, heroicons, mui icons, etc.)
type IconProps = ComponentProps<'svg'> & {
    size?: number | string;
};


export type { Productcardtype, Servicecardtype, currentRouteProps, Productcardtype2, IconProps };
