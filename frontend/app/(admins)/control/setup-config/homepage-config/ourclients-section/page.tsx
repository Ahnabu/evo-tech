import { AddOurClientsForm } from "@/components/admin/setup_config/homepage/add-update-ourclients-form";
import { OurClientsDataTable } from "@/components/admin/setup_config/homepage/comps/ourclients-section-datatable";
import { OurClientsDisplayType } from "@/schemas/admin/setupconfig/homepage/ourClientsSection/ourClientsSchema";
import axiosErrorLogger from "@/components/error/axios_error";
import axiosIntercept from "@/utils/axios/axiosIntercept";
// import { unstable_noStore as noStore } from "next/cache";

const getOurClients = async (): Promise<OurClientsDisplayType[]> => {
    const axioswithIntercept = await axiosIntercept();

    // noStore();
    const ourClientsData = await axioswithIntercept.get(`/api/admin/lp/ourclients`)
        .then((res) => res.data.ourclientsdata)
        .catch((error: any) => {
            axiosErrorLogger({ error });
            return [];
        });

    return ourClientsData;
};

const OurClientsSectionPage = async () => {
    const ourClientsData = await getOurClients();

    return (
        <div className="w-full h-fit flex flex-col px-5 md:px-7 py-8 gap-6 font-inter">
            <div className="flex flex-col gap-4">
                <h2 className="text-lg lg:text-xl font-bold tracking-tight text-stone-900">Our Clients</h2>
                <AddOurClientsForm />
            </div>
            <OurClientsDataTable ourClientsData={ourClientsData} />
        </div>
    )
}

export default OurClientsSectionPage;
