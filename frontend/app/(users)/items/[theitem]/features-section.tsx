"use client";

import Image from 'next/image';
import { m, Variants } from 'framer-motion';
import parse from 'html-react-parser';


const ItemFeaturesSection = ({ ifeaturesdata, framerSectionVariants }: { ifeaturesdata: any; framerSectionVariants: Variants; }) => {
    
    return (
        <div className="flex flex-col items-center w-full h-fit py-8 gap-5">
            {ifeaturesdata.header.length > 0 &&
                ifeaturesdata.header.map((headeritem: any, index: number) => (
                    <m.div
                        key={`features_header${index}`}
                        variants={framerSectionVariants}
                        initial="initial"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        className="relative flex w-full h-fit rounded-[8px] overflow-hidden bg-[#f5f5f5]"
                        aria-label={headeritem.title}
                    >
                        <Image
                            src={headeritem.imgurl}
                            alt={headeritem.title}
                            width={1500}
                            height={200}
                            quality={100}
                            draggable="false"
                            sizes="100%"
                            className="object-cover object-center w-full h-auto max-w-full"
                        />
                    </m.div>
                ))
            }

            {ifeaturesdata.subsections.length > 0 &&
                ifeaturesdata.subsections.map((subsection: any, index: number) => (
                    <m.div
                        key={`features_subsection${index}`}
                        variants={framerSectionVariants}
                        initial="initial"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.05 }}
                        className={`flex flex-col items-center w-full h-fit my-4 md:my-6 gap-x-2 gap-y-4 sm:justify-evenly sm:items-start ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                    >
                        <div className="flex flex-col justify-center w-full max-w-[600px] min-h-[275px] md:min-h-[310px] lg:min-h-[430px] min-[1120px]:min-h-[450px] h-fit gap-4 px-4 py-3 md:px-6 lg:px-9 lg:py-6 text-[12px] sm:text-[13px] lg:text-[15px] leading-5 sm:leading-[1.375rem] lg:leading-6 font-[400] tracking-[-0.02em]">
                            <p className="w-full font-[600] text-stone-800 text-[18px] leading-6 lg:text-[22px] lg:leading-8 xl:text-[26px] xl:leading-10 my-3">
                                {subsection.title}
                            </p>
                            {parse(subsection.content)}
                        </div>

                        <div className="relative w-full aspect-square sm:min-w-[275px] sm:max-w-[450px] rounded-[8px] overflow-hidden focus:outline-none bg-[#f5f5f5]" aria-label={`features subsection ${index + 1}`}>
                            <Image
                                src={subsection.imgurl}
                                alt={`feature ${index + 1} image`}
                                fill
                                quality={100}
                                draggable="false"
                                sizes="100%"
                                className="object-cover object-center"
                            />
                        </div>
                    </m.div>
                ))
            }
        </div>
    );
}

export default ItemFeaturesSection;
