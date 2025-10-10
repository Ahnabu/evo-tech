"use client";

import { useCategory } from "@/hooks/use-taxonomy";
import { useState, useEffect } from "react";

const DynamicTextBySlug = ({ slug }: { slug: string }) => {
    const [mounted, setMounted] = useState(false);
    const category = useCategory(slug);

    useEffect(() => {
        setMounted(true);
    }, []);

    const displayText = (mounted && category?.name) ? ` ${category.name}` : ` What Fits Your Needs`;

    return (
        <div className="flex flex-col items-center justify-end w-full h-[250px] md:h-[300px] pt-[90px] sm:pt-[98px] pb-10 bg-gradient-to-br from-stone-950 via-stone-600 via-60% to-stone-900 translate-y-[-60px] sm:translate-y-[-68px] mb-[-60px] sm:mb-[-68px]">
            {mounted && (
                <h1 className="w-fit h-fit px-4 py-4 text-[16px] sm:text-[18px] leading-7 md:text-2xl font-[500] text-stone-100 first-letter:text-[22px] md:first-letter:text-[30px]">
                    <span className="text-sky-400">Select</span>
                    {displayText}
                </h1>)
            }
        </div>
    );
}

export default DynamicTextBySlug;
